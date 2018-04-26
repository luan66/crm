package cn.wolfcode.crm.mapper;

import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.domain.Role;
import cn.wolfcode.crm.query.EmployeeQueryObject;
import cn.wolfcode.crm.query.QueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EmployeeMapper {
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
    int insert(Employee record);

    /**
     * 查询一条
     * @param id
     * @return
     */
    Employee selectByPrimaryKey(Long id);

    /**
     * 查询所有
     * @return
     */
    List<Employee> selectAll();

    /**
     * 修改
     * @param record
     * @return
     */
    int updateByPrimaryKey(Employee record);

    /**
     * 更改状态
     * @param id
     */
    void changeState(Long id);

    /**
     * 查询总条数
     * @param qo
     * @return
     */
    int queryForCount(QueryObject qo);

    /**
     * 查询数据集合:
     * @param qo
     * @return
     */
    List<Employee> queryForList(QueryObject qo);

    /**
     * 维护员工和角色的关系
     * @param id
     * @param roles
     */
    void insertRelation(@Param("employeeId") Long id, @Param("roles") List<Role> roles);

    /**
     * 根据员工id查询角色id:
     * @param employeeId
     * @return
     */
    List<Long> getRoleIdByEmployeeId(Long employeeId);

    /**
     * 打破员工和角色的关系:
     * @param employeeId
     */
    void deleteRelation(Long employeeId);

    /**
     * 员工导出:
     * @param qo
     * @return
     */
    List<Employee> queryForRedoXls(EmployeeQueryObject qo);

    /**
     * 登陸验证:
     * @param username
     * @return
     */
    Employee selectByUsername(String username);
}