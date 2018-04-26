package cn.wolfcode.crm.realm;

import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.service.IEmployeeService;
import cn.wolfcode.crm.service.IPermissionService;
import cn.wolfcode.crm.service.IRoleService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

/**
 * Created by mm on 2017/12/20.
 */
public class MyRealm extends AuthorizingRealm{
    @Autowired
    private IEmployeeService employeeService;
    @Autowired
    private IRoleService roleService;
    @Autowired
    private IPermissionService permissionService;

    //认证:
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //获取登录用户名:
        String username = (String) authenticationToken.getPrincipal();
        //根据用户名,从数据库查询数据:
        Employee employee = employeeService.selectByUsername(username);
        System.out.println(employee);
        if(employee == null){
            return null;
        }
        //有改用户,验证密码:
        return new SimpleAuthenticationInfo(employee,employee.getPassword(), ByteSource.Util.bytes(username),this.getName());
    }

    //授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection){
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        //01:获取到当前用户:
        Employee employee = (Employee) principalCollection.getPrimaryPrincipal();
        //02:判断该员工是否是管理员:
        if(employee.isAdmin()){
            //角色授权:
            info.addRoles(Arrays.asList("admin"));
            //权限授权:
            info.addStringPermissions(Arrays.asList("*:*"));
        }else{
            //不是超级管理员:
            //先查询角色:
            List<String> roles = roleService.selectByEmployeeId(employee.getId());
            info.addRoles(roles);
            //在查询权限:
            List<String> permissions = permissionService.selectByEmployeeId(employee.getId());
            info.addStringPermissions(permissions);
        }
        return info;
    }
}
