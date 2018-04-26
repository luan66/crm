package cn.wolfcode.crm.service;

import cn.wolfcode.crm.domain.Department;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
public interface IDepartmentService {
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
    int insert(Department record);

    /**
     * 查询一条
     * @param id
     * @return
     */
    Department selectByPrimaryKey(Long id);

    /**
     * 查询所有
     * @return
     */
    List<Department> selectAll();

    /**
     * 修改
     * @param record
     * @return
     */
    int updateByPrimaryKey(Department record);

    /**
     * 更改部门的状态
     * @param id
     */
    void changeState(Long id);
}
