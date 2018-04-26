package cn.wolfcode.crm.web.controller;

import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.page.PageResult;
import cn.wolfcode.crm.query.EmployeeQueryObject;
import cn.wolfcode.crm.service.IEmployeeService;
import cn.wolfcode.crm.util.JsonUtil;
import cn.wolfcode.crm.util.PermissionAnnotation;
import com.alibaba.fastjson.JSON;
import jxl.Sheet;
import jxl.Workbook;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Controller
@RequestMapping("employee")
public class EmployeeController {
    @Autowired
    private IEmployeeService employeeService;

    //视图跳转
    @RequestMapping("view")
    @PermissionAnnotation("员工界面")
    @RequiresPermissions("employee:view")
    public String input() {
        return "employee";
    }

    //查询
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("query")    //spring MVC前台访问后台的资源路径;
    @PermissionAnnotation("员工查询")
    @RequiresPermissions("employee:query")
    public PageResult query(EmployeeQueryObject qo) {
        return employeeService.query(qo);
    }

    //添加或修改
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("saveOrUpdate")
    @PermissionAnnotation("员工添加/修改")
    @RequiresPermissions("employee:saveOrUpdate")
    public String saveOrUpdate(Employee entity) {
        if (entity.getId() == null) {
            //添加:
            employeeService.insert(entity);
        } else {
            //修改:
            employeeService.updateByPrimaryKey(entity);
        }
        return JSON.toJSONString(new JsonUtil(true));
    }

    //设置离职:
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("changeState")
    @PermissionAnnotation("员工离职")
    @RequiresPermissions("employee:changeState")
    public String changeState(Long id) {
        employeeService.changeState(id);
        return JSON.toJSONString(new JsonUtil(true));
    }

    //根据员工id查询角色id:
    @ResponseBody               //把返回的数据转化为json字符串,并按照原路返回;
    @RequestMapping("getRoleIdByEmployeeId")
    public List<Long> getRoleIdByEmployeeId(Long employeeId) {
        return employeeService.getRoleIdByEmployeeId(employeeId);
    }

    //导出员工:
    @RequestMapping("redoXls")
    public void redoXls(HttpServletResponse response, EmployeeQueryObject qo, String fileName) throws Exception {
        //响应文件类型:
        response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xls");
        //创建文件:
        WritableWorkbook workbook = Workbook.createWorkbook(response.getOutputStream());
        //穿件工作蒲:
        WritableSheet sheet = workbook.createSheet("sheet", 0);
        //为单元个设置值:
        sheet = employeeService.redoXls(sheet, qo);
        //响应:
        workbook.write();
        //关闭资源:
        workbook.close();
    }

    //下载模板:
    @RequestMapping("downloadTemp")
    public void downloadTemp(HttpServletResponse response) throws Exception {
        //响应文件类型:
        response.setHeader("Content-Disposition", "attachment;filename=xxx.xls");
        //创建文件:
        WritableWorkbook workbook = Workbook.createWorkbook(response.getOutputStream());
        //穿件工作蒲:
        WritableSheet sheet = workbook.createSheet("sheet", 0);
        //初始化单元格式:
        sheet = employeeService.downloadTemp(sheet);
        //响应:
        workbook.write();
        //关闭资源:
        workbook.close();
    }

    //导入员工:
    @RequestMapping("undoXls")
    public String undoXls(MultipartFile file) throws Exception {
        //获取文件:
        Workbook workbook = Workbook.getWorkbook(file.getInputStream());
        //获取工作蒲:
        Sheet sheet = workbook.getSheet(0);
        //调用service层方法处理:
        employeeService.undoXls(sheet);
        //关闭资源:
        workbook.close();
        return "redirect:/employee/view.do";
    }
}