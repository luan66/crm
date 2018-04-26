package cn.wolfcode.crm.service.impl;

import cn.wolfcode.crm.domain.Department;
import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.domain.Role;
import cn.wolfcode.crm.mapper.DepartmentMapper;
import cn.wolfcode.crm.mapper.EmployeeMapper;
import cn.wolfcode.crm.mapper.RoleMapper;
import cn.wolfcode.crm.page.PageResult;
import cn.wolfcode.crm.query.EmployeeQueryObject;
import cn.wolfcode.crm.query.QueryObject;
import cn.wolfcode.crm.service.IEmployeeService;
import jxl.Sheet;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WriteException;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Service
public class EmployeeServiceImpl implements IEmployeeService {
    @Autowired
    private EmployeeMapper mapper;
    @Autowired
    private DepartmentMapper departmentMapper;
    @Autowired
    private RoleMapper roleMapper;


    public int deleteByPrimaryKey(Long id) {
        return mapper.deleteByPrimaryKey(id);
    }

    public void insert(Employee record) {
        //加密密码:
        Md5Hash password = new Md5Hash(record.getPassword(), record.getUsername(), 2);
        record.setPassword(password.toString());
        //1:添加员工:
        mapper.insert(record);
        //2:维护员工和角色的关系:
        mapper.insertRelation(record.getId(),record.getRoles());
    }


    public Employee selectByPrimaryKey(Long id) {
        return mapper.selectByPrimaryKey(id);
    }


    public List<Employee> selectAll() {
        return mapper.selectAll();
    }


    public void updateByPrimaryKey(Employee record) {
        //1:先修改自己:
        mapper.updateByPrimaryKey(record);
        //2:删除角色和权限的关系:
        mapper.deleteRelation(record.getId());
        //3:重新添加角色和权限的关系:
        mapper.insertRelation(record.getId(),record.getRoles());
    }


    public PageResult query(QueryObject qo) {
        int total = mapper.queryForCount(qo);
        if(total == 0){
            return new PageResult();
        }
        List<Employee> rows = mapper.queryForList(qo);
        return new PageResult(total,rows);
    }


    public void changeState(Long id) {
        mapper.changeState(id);
    }


    public List<Long> getRoleIdByEmployeeId(Long employeeId) {
        return mapper.getRoleIdByEmployeeId(employeeId);
    }


    public WritableSheet redoXls(WritableSheet sheet, EmployeeQueryObject qo) {
        //查询数据中的数据
        List<Employee> list = mapper.queryForRedoXls(qo);
        try {
        if(list != null){
            //先设置标题:
            sheet.addCell(new Label(0,0,"用户名"));
            sheet.addCell(new Label(1,0,"真实姓名"));
            sheet.addCell(new Label(2,0,"电话"));
            sheet.addCell(new Label(3,0,"邮箱"));
            sheet.addCell(new Label(4,0,"录入时间"));
            sheet.addCell(new Label(5, 0,"状态(在职/离职)"));
            sheet.addCell(new Label(6,0,"部门(例:人事部)"));
            sheet.addCell(new Label(7,0,"超级管理员(是/否)"));
            sheet.addCell(new Label(8,0,"角色(例:总经理/开发人员)"));
            //行:
            for(int i=0,rows=1;i<list.size();i++,rows++){
                    //设置内容:
                    sheet.addCell(new Label(0,rows,list.get(i).getUsername().toString()));
                    sheet.addCell(new Label(1,rows,list.get(i).getRealname().toString()));
                    sheet.addCell(new Label(2,rows,list.get(i).getTel().toString()));
                    sheet.addCell(new Label(3,rows,list.get(i).getEmail().toString()));
                    sheet.addCell(new Label(4,rows,list.get(i).getInputtime().toString()));
                    //状态:
                    sheet.addCell(new Label(5, rows,list.get(i).isState()?"在职":"离职"));
                    //超管
                    sheet.addCell(new Label(6,rows,list.get(i).isAdmin()?"是":"否"));
                    //部门:
                    sheet.addCell(new Label(7,rows,list.get(i).getDeptId().getName()));
                    //角色
                    List<String> roleNames = new ArrayList<>();
                    for (Role role : list.get(i).getRoles()) {
                        roleNames.add(role.getName());
                    }
                    sheet.addCell(new Label(8,rows,roleNames.toString()));
            }
        }else{
            throw new RuntimeException("导出内容不能为空!");
        }
        } catch (WriteException e) {
            e.printStackTrace();
        }
        return sheet;
    }

    //导入员工:
    public void undoXls(Sheet sheet) {
        //获取所有的行数:
        int rows = sheet.getRows();
        //遍历所有的行.一行一条数据:
        for(int i = 1; i<rows;i++){
            Employee emp = new Employee();
            emp.setPassword("123456");
            emp.setUsername(sheet.getCell(0,i).getContents());
            emp.setRealname(sheet.getCell(1,i).getContents());
            emp.setTel(sheet.getCell(2,i).getContents());
            emp.setEmail(sheet.getCell(3,i).getContents());
            //格式化日期:
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                emp.setInputtime(dateFormat.parse(sheet.getCell(4, i).getContents()));
            } catch (ParseException e) {
                e.printStackTrace();
            }

            emp.setState((sheet.getCell(5,i).getContents().equals("在职"))?true:false);

            //设置部门:
            String deptName = sheet.getCell(6, i).getContents();
            Department dept = departmentMapper.selectByDeptName(deptName);
            emp.setDeptId(dept);

            emp.setAdmin((sheet.getCell(7,i).getContents().equals("是")?true:false));

            //01:往数据库插入员工:
            mapper.insert(emp);

            //设置角色(维护关系):
            String roleStr = sheet.getCell(8, i).getContents();
            String[] roleNames = roleStr.split("/");
            //存放角色对象的集合:
            List<Role> roles = new ArrayList<>();
            for (String roleName : roleNames) {
                //根据角色名称,逐个查询角色对象:
                roles.add(roleMapper.selectByRoleName(roleName));
            }
            //02:维护员工和角色关系:
            mapper.insertRelation(emp.getId(),roles);
        }
    }

    //下载模板,
    public WritableSheet downloadTemp(WritableSheet sheet) {
        try {
            sheet.addCell(new Label(0,0,"用户名"));
            sheet.addCell(new Label(1,0,"真实姓名"));
            sheet.addCell(new Label(2,0,"电话"));
            sheet.addCell(new Label(3,0,"邮箱"));
            sheet.addCell(new Label(4,0,"录入时间(例:2014-09-01)"));
            sheet.addCell(new Label(5, 0,"状态(在职/离职)"));
            sheet.addCell(new Label(6,0,"部门(例:人事部)"));
            sheet.addCell(new Label(7,0,"超级管理员(是/否)"));
            sheet.addCell(new Label(8,0,"角色(例:总经理/开发人员)"));
        } catch (WriteException e) {
            e.printStackTrace();
        }
        return sheet;
    }

    //登录验证:
    public Employee selectByUsername(String username) {
        return mapper.selectByUsername(username);
    }
}
