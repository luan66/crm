package cn.wolfcode.crm.web.filter;

import cn.wolfcode.crm.util.JsonUtil;
import com.alibaba.fastjson.JSON;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

/**
 * Created by mm on 2017/12/20.
 */
public class MyFormFilter extends FormAuthenticationFilter{

    //登录成功之后:(前台是ajax,所以返回是true或者false,跳转交给前台ajax;)
    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {
       //成功之后,响应回去:
        response.getWriter().print(JSON.toJSONString(new JsonUtil(true)));
        //该请求,不在往下执行:
        return false;
    }

    //登录失败之后:
    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        String errorMge = "登录错误,请联系管理员!";
        if(e instanceof UnknownAccountException){
            errorMge = "账号不存在!";
        }
        if(e instanceof IncorrectCredentialsException){
            errorMge = "密码错误!";
        }
        //响应到前台:
        try {
            response.getWriter().print(JSON.toJSONString(new JsonUtil(false,errorMge)));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        return false;
    }

    //处理不可以重复登录问题:
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        //如果是登录的请求,就执行里面的代码:
        if (this.isLoginRequest(request,response)) {
            //如果已经登录,先注销:
            Subject subject = SecurityUtils.getSubject();
            if (subject.isAuthenticated()) {
                subject.logout();
            }
        }
        return super.isAccessAllowed(request,response,mappedValue);
    }
}
