package cn.wolfcode.crm.web.controller;

import cn.wolfcode.crm.domain.Menu;
import cn.wolfcode.crm.service.IMenuService;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("menu")
public class MenuController {
    @Autowired
    private IMenuService menuService;

    //视图跳转
    @RequestMapping("view")
    public String input() {
        return "menu";
    }

    //查询
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("query")    //spring MVC前台访问后台的资源路径;
    public String query() {
        String s = JSON.toJSONString(menuService.selectAll());
        System.out.println(s);
        List<Menu> menus = menuService.selectAll();
        for(Menu m : menus){
            System.out.println(m);
        }
        return s;
    }
}

