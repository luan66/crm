import cn.wolfcode.crm.domain.Employee;
import cn.wolfcode.crm.mapper.EmployeeMapper;
import cn.wolfcode.crm.service.IEmployeeService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created by mm on 2017/12/17.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:ApplicationContext.xml")
public class EmployeeTest {
    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private IEmployeeService service;


    @Test
    public void testDataSource() throws  Exception{
        System.out.println(sqlSessionFactory);
    }
    //添加:
    @Test
    public void testEmployeeMapper() throws  Exception{
        Employee employee = new Employee();
        employee.setUsername("luan");
        employee.setRealname("luan");
        employee.setPassword("666");
        employee.setState(true);
        employeeMapper.insert(employee);
    }
    //添加:
    @Test
    public void testEmployeeService() throws  Exception{
        Employee employee = new Employee();
        employee.setUsername("luan");
        employee.setRealname("luan");
        employee.setPassword("666");
        employee.setState(true);
        service.insert(employee);
    }

}
