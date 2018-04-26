<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>部门界面</title>
    <%-- 导入插件的引用文件: --%>
    <%@include file="/static/common/common.jsp"%>
    <!-- 引用自己的js -->
    <script type="text/javascript" src="/static/js/department.js"></script>
</head>
<body>

    <%-- 上面按钮: --%>
    <div id="btn_toolbar">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'" data-method="add">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-edit'" data-method="edit">编辑</a>
        <a href="#" id="changeState" class="easyui-linkbutton" data-options="iconCls:'icon-remove'" data-method="changeState">停运</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-reload'" data-method="reload1">刷新</a>
    </div>
    <%-- 下面两个按钮 --%>
    <div id="btn_buttons">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'" data-method="save">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" data-method="cancel">取消</a>
    </div>

    <%-- 01:部门列表: --%>
    <div id="btn_datagrid"></div>


    <%-- 02:部门添加的窗口:当被引用是就不会再主页面显示了; --%>
    <div id="btn_dialog">
        <form id="btn_form" method="post">
            <table align="center" style="margin-top: 20px;">
                <input type="hidden" name="id">
                <tr>
                    <td>部门名:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="name">
                    </td>
                </tr>
                <tr>
                    <td>部门编号:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="sn">
                    </td>
                </tr>
                <tr>
                    <td>状态:</td>
                    <td>
                        <select class="easyui-combobox" name="state" style="width:145px;" data-options="panelHeight:true">
                            <option value="1" selected>在职</option>
                            <option value="0">离职</option>
                        </select>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</body>
</html>
