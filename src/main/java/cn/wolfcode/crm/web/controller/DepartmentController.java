package cn.wolfcode.crm.web.controller;

import cn.wolfcode.crm.domain.Department;
import cn.wolfcode.crm.service.IDepartmentService;
import cn.wolfcode.crm.util.JsonUtil;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("department")
public class DepartmentController {
    @Autowired
    private IDepartmentService departmentService;

    //视图跳转
    @RequestMapping("view")
    public String input() {
        return "department";
    }


    //查询
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("query")    //spring MVC前台访问后台的资源路径;
    public List<Department> query() {
        return departmentService.selectAll();
    }

    //添加或修改
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("saveOrUpdate")
    public String saveOrUpdate(Department entity) {
        if (entity.getId() == null) {
            //添加:
            departmentService.insert(entity);
        } else {
            //修改:
            departmentService.updateByPrimaryKey(entity);
        }
        return JSON.toJSONString(new JsonUtil(true));
    }

    //设置:
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("changeState")
    public String changeState(Long id) {
        departmentService.changeState(id);
        return JSON.toJSONString(new JsonUtil(true));
    }
}

