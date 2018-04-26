import jxl.Sheet;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.junit.Test;

import java.io.File;

/**
 * Created by mm on 2017/12/18.
 */
public class JtxTest {
    //导出:
    @Test
    public void test() throws  Exception{
        //创建文件
        WritableWorkbook workbook = Workbook.createWorkbook(new File("H:/wenjian.xls"));
        //创建页面
        WritableSheet sheet = (WritableSheet) workbook.createSheet("day01",0);
        //创建单元格:
        Label label = new Label(0, 0, "java");
        //添加内容:
        sheet.addCell(label);
        //写出:
        workbook.write();
        //关闭资源:
        workbook.close();
    }

    //导入:
    @Test
    public void testIn() throws  Exception{
        //获取文件:
        Workbook workbook = Workbook.getWorkbook(new File("H:/wenjian.xls"));
        //获取工作普:
        Sheet sheet = workbook.getSheet("day01");
        //获取所有行:
        int rows = sheet.getRows();
        //获取所有列:
        int columns = sheet.getColumns();
        for(int i=0; i<rows;i++){
            //i每加一就是一个对象:
            for(int j=0; j<columns;j++) {
                System.out.println(sheet.getCell(j,i).getContents());
            }
        }
        //关闭资源:
        workbook.close();
    }
}
