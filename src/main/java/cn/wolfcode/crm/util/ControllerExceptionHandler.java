package cn.wolfcode.crm.util;

import com.alibaba.fastjson.JSON;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by mm on 2017/12/20.
 */

//该注解是对所有的controller类做增强:
@ControllerAdvice
public class ControllerExceptionHandler {

    //处理异常的注解:
    //该方法此时是处理:UnauthorizedException异常的方法:
    @ExceptionHandler(UnauthorizedException.class)
    public void exceptionHandler(HttpServletResponse response, HandlerMethod handler) {
        //如果方法上有该注解,就说明是ajax请求,没有就是普通请求:
        ResponseBody anno = handler.getMethod().getAnnotation(ResponseBody.class);
        if (anno != null) {
            //如果是ajax请求,就返回jsonUtil对象:
            try {
                response.getWriter().print(JSON.toJSONString(new JsonUtil(false,"你没有权限!") ));
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            //如果为普通请求,重定向:
            try {
                //没有权限是,跳转到那个界面;
                response.sendRedirect("/noPermission.jsp");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
