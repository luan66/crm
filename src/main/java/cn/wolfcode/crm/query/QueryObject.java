package cn.wolfcode.crm.query;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by mm on 2017/12/17.
 */
@Setter
@Getter
public class QueryObject {
    private int page;   //当前页;
    private int rows;   //页面大小

    //分页开始:
    public int getBeginIndex(){
        return (page-1)*rows;
    }
}
