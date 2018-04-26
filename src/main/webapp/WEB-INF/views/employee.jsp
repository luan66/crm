<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>员工界面</title>
    <%-- 导入插件的引用文件: --%>
    <%@include file="/static/common/common.jsp"%>
    <!-- 引用自己的js -->
    <script type="text/javascript" src="/static/js/employee.js"></script>
</head>
<body>

    <%-- 上面按钮: --%>
    <div id="btn_toolbar">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'" data-method="add">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-edit'" data-method="edit">编辑</a>
        <a href="#" id="changeState" class="easyui-linkbutton" data-options="iconCls:'icon-remove'" data-method="changeState">离职</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-reload'" data-method="reload1">刷新</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-redo'" data-method="redoXls">导出员工</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-undo'" data-method="undoXls">导入员工</a>
        <%-- 高级查询: --%>
        <div style="float: right;margin-right: 100px;">
        关键字:<input id="keyword" type="text" class="easyui-textbox" name="keyword" data-options="prompt:'用户名'">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" data-method="searchForm">搜索</a>
        </div>
    </div>

    <%-- 下面两个按钮 --%>
    <div id="btn_buttons">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'" data-method="save">添加</a>
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" data-method="cancel">取消</a>
    </div>

    <%-- 导入员工: --%>
    <div id="undoXls" align="center">
        <form id="undoXls_form" action="/employee/undoXls.do" method="post" enctype="multipart/form-data">
            <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-help',width:236" data-method="downloadTemp">下载员工模板</a>
            <br><br><br><br>
            <input id="undoXls_file" class="easyui-filebox" data-options="buttonText:'选择文件',width:236" name="file">
            <br>
            <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-undo',width:236" data-method="submit">导入员工</a>
        </form>
    </div>

    <%-- 01:员工列表: --%>
    <div id="btn_datagrid"></div>


    <%-- 02:员工添加的窗口:当被引用是就不会再主页面显示了; --%>
    <div id="btn_dialog" >
            <form id="btn_form" method="post">
                <table align="center" style="margin-top: 20px;">
                <input type="hidden" name="id">
                <tr>
                    <td>用户名:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="username">
                    </td>
                </tr>
                <tr>
                    <td>真实姓名:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="realname">
                    </td>
                </tr>
                <tr id="password">
                    <td>密码:</td>
                    <td>
                        <input type="text" class="easyui-passwordbox" name="password">
                    </td>
                </tr>
                <tr>
                    <td>电话:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="tel">
                    </td>
                </tr>
                <tr>
                    <td>邮箱:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="email">
                    </td>
                </tr>
                <tr>
                    <td>录入时间:</td>
                    <td>
                        <input class="easyui-datebox" name="inputtime" >
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
                <tr>
                    <td>部门:</td>
                    <td>
                        <input class="easyui-combobox" name="deptId.id"
                               data-options="valueField:'id',textField:'name',url:'/department/query.do',panelHeight:true" />
                    </td>
                </tr>
                <tr>
                    <td>角色:</td>
                    <td>
                        <input id="role_input" class="easyui-combobox"
                               data-options="valueField:'id',textField:'name',url:'/role/query.do',panelHeight:true,multiple:true" />
                    </td>
                </tr>
                <tr>
                    <td>是否是超管:</td>
                    <td>
                        <select class="easyui-combobox" name="admin" style="width:145px;" data-options="panelHeight:true">
                            <option value="0" selected>否</option>
                            <option value="1">是</option>
                        </select>
                    </td>
                </tr>
                </table>
            </form>
    </div>
</body>
</html>
