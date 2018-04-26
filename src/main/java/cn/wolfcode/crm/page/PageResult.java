package cn.wolfcode.crm.page;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created by mm on 2017/12/17.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PageResult {
    private int total;
    private List<?> rows;
}
