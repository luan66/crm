package cn.wolfcode.crm.mapper;

import cn.wolfcode.crm.domain.Permission;
import java.util.List;

public interface PermissionMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Permission record);

    Permission selectByPrimaryKey(Long id);

    List<Permission> selectAll();

    int updateByPrimaryKey(Permission record);

    /**
     * 根据角色id查询权限:
     * @param roleId
     * @return
     */
    List<Permission> getPermissionByRoleId(Long roleId);

    /**
     * 查询所有的权限表达式
     * @return
     */
    List<String> selectExpression();

    /**
     * 根据员工查询权限:
     * @param id
     * @return
     */
    List<String> selectByEmployeeId(Long id);
}