package cn.wolfcode.crm.service.impl;

import cn.wolfcode.crm.domain.Permission;
import cn.wolfcode.crm.mapper.PermissionMapper;
import cn.wolfcode.crm.service.IPermissionService;
import cn.wolfcode.crm.util.PermissionAnnotation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by mm on 2017/12/17.
 */
@Service
public class PermissionServiceImpl implements IPermissionService {
    @Autowired
    private PermissionMapper mapper;
    @Autowired
    private ApplicationContext ctx;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return mapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(Permission record) {
        return mapper.insert(record);
    }

    @Override
    public Permission selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Permission> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public int updateByPrimaryKey(Permission record) {
        return mapper.updateByPrimaryKey(record);
    }


    @Override
    public List<Permission> getPermissionByRoleId(Long roleId) {
        return mapper.getPermissionByRoleId(roleId);
    }

    //加载权限
    public void reload() {
        //查询出数据库中所有的权限表达式:
        List<String> expressions= mapper.selectExpression();

        //01:先找到有controller注解的类:
        Map<String, Object> maps = ctx.getBeansWithAnnotation(Controller.class);
        Collection<Object> controllers = maps.values();
        for (Object controller : controllers) {
            //02:拿到每一个类上的方法:
            //先获取到父类:然后获取父类中的方法:
            Method[] methods = controller.getClass().getSuperclass().getDeclaredMethods();
            //03:遍历方法,判断是否有注解:
            for (Method method : methods) {
                RequiresPermissions anno = method.getAnnotation(RequiresPermissions.class);
                if(anno != null){
                    //04:判断权限表达式是否已经存在:
                    String[] value = anno.value();
                    if(!expressions.remove(value[0])){
                        Permission p = new Permission();
                        p.setExpression(value[0]);
                        //权限名:
                        PermissionAnnotation annotation = method.getAnnotation(PermissionAnnotation.class);
                        String name = annotation.value();
                        p.setName(name);

                        //05:保存:
                        mapper.insert(p);
                    }
                }
            }
        }
        //03：
    }

    //根据员工id查询角色:
    public List<String> selectByEmployeeId(Long id) {
        return mapper.selectByEmployeeId(id);
    }

}
