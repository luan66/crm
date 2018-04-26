package cn.wolfcode.crm.service.impl;

import cn.wolfcode.crm.domain.Department;
import cn.wolfcode.crm.mapper.DepartmentMapper;
import cn.wolfcode.crm.service.IDepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Service
public class DepartmentServiceImpl implements IDepartmentService {
    @Autowired
    private DepartmentMapper mapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return mapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(Department record) {
        return mapper.insert(record);
    }

    @Override
    public Department selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Department> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public int updateByPrimaryKey(Department record) {
        return mapper.updateByPrimaryKey(record);
    }

    //更改部门状态:
    public void changeState(Long id) {
        mapper.changeState(id);
    }
}
