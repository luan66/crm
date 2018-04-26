package cn.wolfcode.crm.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {
    //登录
    @RequestMapping("login")    //spring MVC前台访问后台的资源路径;
    public String login() {
        return "forward:/login.jsp";
    }

}