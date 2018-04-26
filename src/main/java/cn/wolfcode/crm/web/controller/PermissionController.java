package cn.wolfcode.crm.web.controller;

import cn.wolfcode.crm.domain.Permission;
import cn.wolfcode.crm.service.IPermissionService;
import cn.wolfcode.crm.util.JsonUtil;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("permission")
public class PermissionController {
    @Autowired
    private IPermissionService permissionService;

    //视图跳转
    @RequestMapping("view")
    public String input() {
        return "permission";
    }

    //查询
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("query")    //spring MVC前台访问后台的资源路径;
    public List<Permission> query() {
        return permissionService.selectAll();
    }

    //添加或修改
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("saveOrUpdate")
    public String saveOrUpdate(Permission entity) {
        if (entity.getId() == null) {
            //添加:
            permissionService.insert(entity);
        } else {
            //修改:
            permissionService.updateByPrimaryKey(entity);
        }
        return JSON.toJSONString(new JsonUtil(true));
    }

    //根据角色id查询权限:
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("getPermissionByRoleId")
    public List<Permission> getPermissionByRoleId(Long roleId) {
        return permissionService.getPermissionByRoleId(roleId);
    }


    //加载权限:
    @RequestMapping("reload")
    public String reload() {
        permissionService.reload();
        return "redirect:/permission/view.do";
    }
}

