package cn.wolfcode.crm.mapper;

import cn.wolfcode.crm.domain.Permission;
import cn.wolfcode.crm.domain.Role;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Role record);

    Role selectByPrimaryKey(Long id);

    List<Role> selectAll();

    int updateByPrimaryKey(Role record);

    /**
     * 维护角色和权限的关系：
     * @param id
     * @param permissions
     */
    void insertRelation(@Param("roleId") Long id, @Param("permissions") List<Permission> permissions);

    /**
     * 打破角色和权限的关系
     * @param roleId
     */
    void deleteRelation(Long roleId);

    /**
     * 根据员工id查询角色:
     * @param employeeId
     */
    void selectRolesByEmployeeId(Long employeeId);

    /**
     * 根据角色名称查询角色对象:(员工导入)
     * @param roleName
     * @return
     */
    Role selectByRoleName(String roleName);

    /**
     * 更具员工id查询角色:
     * @param id
     * @return
     */
    List<String> selectByEmployeeId(Long id);
}