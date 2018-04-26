package cn.wolfcode.crm.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@ToString
public class Employee {
    private Long id;            //员工id
    private String username;    //用户名
    private String realname;    //真实姓名
    private String password;    //密码
    private String tel;         //电话
    private String email;       //邮箱
    //后台往前台传:
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    //后台往前台传值:
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date inputtime;     //录入时间
    private boolean state;      //状态
    private Department deptId;  //部门id
    private boolean admin;      //是否是超管;

    //维护和角色的关系:
    private List<Role> roles = new ArrayList<>();
}