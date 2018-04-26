import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.config.IniSecurityManagerFactory;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.subject.Subject;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by mm on 2017/12/15.
 */
public class LoginTest {
    @Test
    public void testLogin() throws  Exception{
        //01_1:先创建SecerutyManageF工厂对象: 加上文件的路径;
        IniSecurityManagerFactory factory = new IniSecurityManagerFactory("classpath:shiro_realm.ini");
        //01_2:再用工厂创建对象;
        SecurityManager secutityManage = factory.getInstance();

        //02:加入到环境中:
        SecurityUtils.setSecurityManager(secutityManage);

        //03:获取用户subject
        Subject subject = SecurityUtils.getSubject();

        //04:登录认证:
        //先创建令牌对象:
        AuthenticationToken user = new UsernamePasswordToken("luan", "666");
        try {
            subject.login(user);
        }catch (UnknownAccountException e){
            System.out.println("用户名不存在!");
        }catch (IncorrectCredentialsException e){
            System.out.println("密码错误!");
        }
        //打印状态:
        System.out.println("登录状态" + subject.isAuthenticated());
        //注销:
        //subject.logout();
        //注销后的状态:
        //System.out.println("登录状态" + subject.isAuthenticated());

        //登陆之后判断角色==================================================
        //1:判断是否有单个权限:
        System.out.println(subject.hasRole("user"));
        System.out.println("---------------------------------");
        //2:判断是否同时有多个角色: 该方法是只返回一个统一的结果,集合中一个没有就返回false;
        System.out.println(subject.hasAllRoles(Arrays.asList("user")));
        //3:判断是否有角色,没有抛异常:
        subject.checkRole("user");
        //subject.checkRoles(Arrays.asList("role1","role3"));

        //登陆之后判断权限------------------------:
        //1:是否有权限:
        System.out.println(subject.isPermitted("user:create"));
        //2:是否有多个权限:
        System.out.println(subject.isPermittedAll("user:create","user:update"));
        System.out.println(subject.isPermittedAll("user:create","user:delete"));
        //3:没有权限抛异常:
        //subject.checkPermission("user:create");
        //subject.checkPermissions("user:create","user:delete");






    }
    
    @Test
    public void testPassWord() throws  Exception{
        Md5Hash pass = new Md5Hash("1","admin",2);
        System.out.println(pass.toString());
        SimpleHash pass2 = new SimpleHash("MD5","1");
        System.out.println(pass2);
    }
}
