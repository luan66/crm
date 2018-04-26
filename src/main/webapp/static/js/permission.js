$(function () {

    //抽取变量
    var permission_datagrid = $("#permission_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        load: function () {
            $.messager.confirm("温馨提示", "确认要加载权限么?", function (r) {
                if (r) {
                    $.get("/permission/load.do", function (data) {
                        $.messager.alert("温馨提示", "权限加载成功", "info", function () {
                            permission_datagrid.datagrid("load");
                        })
                    });
                }
            })
        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    permission_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/permission/list.do",
        rownumbers:true,
        pagination: true,
        singleSelect: true,
        toolbar: "#permission_toolbar",
        columns: [[
            {field: 'name', title: '权限名称', width: 100, align: 'center'},
            {field: 'resource', title: '权限资源', width: 100, align: 'center'}
        ]]
    });

});



