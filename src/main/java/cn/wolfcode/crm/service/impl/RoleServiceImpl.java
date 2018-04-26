package cn.wolfcode.crm.service.impl;

import cn.wolfcode.crm.domain.Role;
import cn.wolfcode.crm.mapper.RoleMapper;
import cn.wolfcode.crm.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Service
public class RoleServiceImpl implements IRoleService {
    @Autowired
    private RoleMapper mapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return mapper.deleteByPrimaryKey(id);
    }

    @Override
    public void insert(Role record) {
        //添加角色:
        mapper.insert(record);
        //添加中间表数据:维护和权限的关系
        mapper.insertRelation(record.getId(),record.getPermissions());
    }

    @Override
    public Role selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Role> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public void updateByPrimaryKey(Role record) {
        //1:先修改自己:
        mapper.updateByPrimaryKey(record);
        //2:删除角色和权限的关系:
        mapper.deleteRelation(record.getId());
        //3:重新添加角色和权限的关系:
        mapper.insertRelation(record.getId(),record.getPermissions());
    }

    //更具员工id查询角色
    public List<String> selectByEmployeeId(Long id) {
        return mapper.selectByEmployeeId(id);
    }

}
