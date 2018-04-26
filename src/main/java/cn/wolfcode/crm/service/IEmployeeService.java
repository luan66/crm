package cn.wolfcode.crm.service;

import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.page.PageResult;
import cn.wolfcode.crm.query.EmployeeQueryObject;
import cn.wolfcode.crm.query.QueryObject;
import jxl.Sheet;
import jxl.write.WritableSheet;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
public interface IEmployeeService {
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
    void insert(Employee record);

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
    void updateByPrimaryKey(Employee record);

    /**
     * 高级查询:
     * @param qo
     * @return
     */
    PageResult query(QueryObject qo);

    /**
     * 更改状态:
     * @param id
     */
    void changeState(Long id);

    /**
     * 根据员工id查询角色id:
     * @param employeeId
     * @return
     */
    List<Long> getRoleIdByEmployeeId(Long employeeId);

    /**
     * 导出员工:
     */
    WritableSheet redoXls(WritableSheet sheet,EmployeeQueryObject qo);

    /**
     * 导入员工:
     * @param sheet
     */
    void undoXls(Sheet sheet);

    /**
     * 初始化单元格格式:
     * @param sheet
     * @return
     */
    WritableSheet downloadTemp(WritableSheet sheet);

    /**
     * 登录验证时,根据用户名,查询员工对象:
     * @param username
     * @return
     */
    Employee selectByUsername(String username);
}
