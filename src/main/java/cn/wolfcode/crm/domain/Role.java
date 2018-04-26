package cn.wolfcode.crm.domain;


import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class Role {
    private Long id;
    private String sn;
    private String name;

    //维护和权限的关系:
    List<Permission> permissions = new ArrayList<>();
}