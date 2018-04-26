<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>权限界面</title>
    <%-- 导入插件的引用文件: --%>
    <%@include file="/static/common/common.jsp"%>
    <!-- 引用自己的js -->
    <script type="text/javascript" src="/static/js/permission.js"></script>
</head>
<body>

    <%-- 上面按钮: --%>
    <div id="btn_toolbar">
        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'" onclick="add()">加载权限</a>
    </div>

    <%-- 01:权限列表: --%>
    <div id="btn_datagrid"></div>


    <%-- 02:权限添加的窗口:当被引用是就不会再主页面显示了; --%>
    <div id="btn_dialog">
        <form id="btn_form" method="post">
            <table align="center" style="margin-top: 20px;">
                <input type="hidden" name="id">
                <tr>
                    <td>权限名:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="name">
                    </td>
                </tr>
                <tr>
                    <td>权限表达式:</td>
                    <td>
                        <input type="text" class="easyui-textbox" name="expression">
                    </td>
                </tr>
            </table>
        </form>
    </div>
</body>
</html>
