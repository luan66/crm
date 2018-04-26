<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>角色界面</title>
    <%-- 导入插件的引用文件: --%>
    <%@include file="/static/common/common.jsp"%>
    <!-- 引用自己的js -->
    <script type="text/javascript" src="/static/js/role.js"></script>
</head>
<body>

    <%-- 上面的按钮 --%>
    <div id="btn_toolbar">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'" data-method="add">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-edit'" data-method="edit">编辑</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-reload'" data-method="reload1">刷新</a>
    </div>
    <%-- 下面两个按钮 --%>
    <div id="btn_buttons">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'" data-method="save">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" data-method="cancel">取消</a>
    </div>

    <%-- 01:角色列表: --%>
    <div id="btn_datagrid"></div>


    <%-- 02:角色添加的窗口:当被引用是就不会再主页面显示了; --%>
    <div id="btn_dialog" >
            <form id="btn_form" method="post">
                <table align="center" style="margin-top: 20px;">
                <input type="hidden" name="id">
                <tr>
                    <td>角色名:<input type="text" class="easyui-textbox" name="name"></td>
                    <td>角色编号:<input type="text" class="easyui-textbox" name="sn"></td>
                </tr>
                <tr>
                    <td>
                        <div id="allPermissions"></div>
                    </td>
                    <td>
                        <div id="selfPermissions"></div>
                    </td>
                </tr>
                </table>
            </form>
    </div>
</body>
</html>
