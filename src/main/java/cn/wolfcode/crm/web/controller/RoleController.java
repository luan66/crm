package cn.wolfcode.crm.web.controller;

import cn.wolfcode.crm.domain.Role;
import cn.wolfcode.crm.service.IRoleService;
import cn.wolfcode.crm.util.JsonUtil;
import cn.wolfcode.crm.util.PermissionAnnotation;
import com.alibaba.fastjson.JSON;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("role")
public class RoleController {
    @Autowired
    private IRoleService roleService;

    //视图跳转
    @RequestMapping("view")
    @PermissionAnnotation("角色界面")
    @RequiresPermissions("role:view")
    public String input() {
        return "role";
    }

    //查询
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("query")    //spring MVC前台访问后台的资源路径;
    @PermissionAnnotation("角色查询")
    @RequiresPermissions("role:query")
    public List<Role> query() {
        return roleService.selectAll();
    }

    //添加或修改
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("saveOrUpdate")
    public String saveOrUpdate(Role entity) {
        if (entity.getId() == null) {
            //添加:
            roleService.insert(entity);
        } else {
            //修改:
            roleService.updateByPrimaryKey(entity);
        }
        return JSON.toJSONString(new JsonUtil(true));
    }

}

