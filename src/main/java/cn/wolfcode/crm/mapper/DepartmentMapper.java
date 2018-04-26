package cn.wolfcode.crm.mapper;

import cn.wolfcode.crm.domain.Department;
import java.util.List;

public interface DepartmentMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Department record);

    Department selectByPrimaryKey(Long id);

    List<Department> selectAll();

    int updateByPrimaryKey(Department record);

    /**
     * 员工导入时,根据部门名称查询部门:
     * @param deptName
     * @return
     */
    Department selectByDeptName(String deptName);

    /**
     * 更改部门状态：
     * @param id
     */
    void changeState(Long id);
}