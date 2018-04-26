package cn.wolfcode.crm.service;

import cn.wolfcode.crm.domain.Role;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
public interface IRoleService {
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
    void insert(Role record);

    /**
     * 查询一条
     * @param id
     * @return
     */
    Role selectByPrimaryKey(Long id);

    /**
     * 查询所有
     * @return
     */
    List<Role> selectAll();

    /**
     * 修改
     * @param record
     * @return
     */
    void updateByPrimaryKey(Role record);

    /**
     * 根据员工id查询角色:
     * @param id
     * @return
     */
    List<String> selectByEmployeeId(Long id);
}
