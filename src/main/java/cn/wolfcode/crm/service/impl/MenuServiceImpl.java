package cn.wolfcode.crm.service.impl;

import cn.wolfcode.crm.domain.Menu;
import cn.wolfcode.crm.mapper.MenuMapper;
import cn.wolfcode.crm.service.IMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Service
public class MenuServiceImpl implements IMenuService {
    @Autowired
    private MenuMapper mapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return mapper.deleteByPrimaryKey(id);
    }

    @Override
    public void insert(Menu record) {
        //添加角色:
        mapper.insert(record);
    }

    @Override
    public Menu selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Menu> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public void updateByPrimaryKey(Menu record) {
        //1:先修改自己:
        mapper.updateByPrimaryKey(record);
    }

}
