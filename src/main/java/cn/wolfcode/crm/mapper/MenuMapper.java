package cn.wolfcode.crm.mapper;

import cn.wolfcode.crm.domain.Menu;
import java.util.List;

public interface MenuMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Menu record);

    Menu selectByPrimaryKey(Long id);

    List<Menu> selectAll();

    int updateByPrimaryKey(Menu record);

    /**
     * 查询子集元素
     * @param parentId
     * @return
     */
    List<Menu> getChildrensByParentId(Long parentId);
}
