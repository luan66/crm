package cn.wolfcode.crm.service;

import cn.wolfcode.crm.domain.Menu;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
public interface IMenuService {
    /**
     * 删除
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Long id);

    /**
     * 添加
     * @param record
     * @return
     */
    void insert(Menu record);

    /**
     * 查询一条
     * @param id
     * @return
     */
    Menu selectByPrimaryKey(Long id);

    /**
     * 查询所有
     * @return
     */
    List<Menu> selectAll();

    /**
     * 修改
     * @param record
     * @return
     */
    void updateByPrimaryKey(Menu record);

}
