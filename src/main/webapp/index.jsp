<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主页</title>
    <!-- 主题 -->
    <link rel="stylesheet" type="text/css" href="/static/jquery/jquery-easyui/themes/default/easyui.css">
    <!-- 图片插件 -->
    <link rel="stylesheet" type="text/css" href="/static/jquery/jquery-easyui/themes/icon.css">
    <!-- jQuery -->
    <script type="text/javascript" src="/static/jquery/jquery-easyui/jquery.min.js"></script>
    <!-- easyui -->
    <script type="text/javascript" src="/static/jquery/jquery-easyui/jquery.easyui.min.js"></script>
    <!-- 使用分页时,引入国家化库,时期便为中文; -->
    <script type="text/javascript" src="/static/jquery/jquery-easyui/locale/easyui-lang-zh_CN.js"></script>

    <!-- 引用自己的js -->
    <script type="text/javascript" src="/static/js/index.js"></script>

</head>
<body>
<div id="btn_layout" class="easyui-layout" data-options='fit:true' >
    <div data-options="region:'north',height:70">
        <h1 style="text-align: center">员工管理系统</h1>
    </div>
    <div data-options="region:'south',height:50">
        <h4 style="text-align: center">版权信息 ： 欒先聖</h4>
    </div>

    <div data-options="region:'west',title:'菜单',width:150">
        <!-- 使用手风琴的样式: -->
        <div class="easyui-accordion" data-options="fit:true">
            <div title="系统管理">
                <!-- 菜单列表 -->
                <ul id="menu"></ul>
            </div>
            <div title="模块管理">2</div>
            <div title="其他">3</div>
        </div>
    </div>

    <div data-options="region:'center'" style="padding:5px;background:#eee;">
        <!-- 选项卡: -->
        <div id="tabs" class="easyui-tabs" data-options="fit:true">
            <div title="Tab1" style="padding:20px;display:none;">
                tab1
            </div>
        </div>

    </div>
</div>
</body>
</html>