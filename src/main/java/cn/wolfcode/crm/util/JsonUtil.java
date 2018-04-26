package cn.wolfcode.crm.util;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by mm on 2017/12/17.
 */
@Setter
@Getter
public class JsonUtil {
    private boolean success;
    private String errorMge;

    public JsonUtil(boolean success){
        this.success = success;
    }
    public JsonUtil(boolean success,String errorMge){
        this.success = success;
        this.errorMge = errorMge;
    }

}
