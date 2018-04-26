$(function () {
    //1.抽取变量
    var menu_form = $("#menu_form");
    var menu_datagrid = $("#menu_datagrid");
    var menu_dialog = $("#menu_dialog");

    //2.方法统一管理,使用一个对象去管理方法
    var methodObj = {

        add: function () {
            //清空表单数据
            menu_form.form("clear");

            menu_dialog.dialog("setTitle", "新增菜单");

            menu_dialog.dialog("open");
        },
        edit: function () {
            //判断选中数据
            var row = menu_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //清空表单数据
            menu_form.form("clear");
            if(row.parent){
                //回显部门
                row["parent.id"] = row.parent.id;
            }

            //回显表单
            menu_form.form("load", row);

            menu_dialog.dialog("setTitle", "编辑菜单");

            menu_dialog.dialog("open");
        },


        cancel: function () {
            menu_dialog.dialog("close");
        },

        save: function () {
            menu_form.form("submit", {
                url: '/menu/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.msg, 'info', function () {
                            //重新加载数据表格
                            menu_datagrid.datagrid("load");
                            //关闭弹出框
                            menu_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.msg, 'info');
                    }
                }
            })
        },
        remove:function () {
            //判断选中数据
            var row = menu_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $.messager.confirm('温馨提示', '确认删除该菜单吗？', function (r) {
                if (r) {
                    // 发送请求
                    $.get("/menu/delete.do", {id: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.msg, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                menu_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.msg, 'info');
                        }
                    })
                }
            });
        },


        reload:function () {
            menu_datagrid.datagrid("load");
        },
        showParent:function () {
            menu_datagrid.datagrid("load",{parentId: null});
        },
        showChildren:function () {
            //判断选中数据
            var row = menu_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //重新加载datagrid
            menu_datagrid.datagrid("load", {parentId: row.id});
        }

    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    menu_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#menu_toolbar',
        url:"/menu/list.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field: 'text', title: '菜单名称', width: 100},
            {field: 'url', title: 'URL', width: 100},
            {field: 'parent', title: '上级菜单', width: 100,
                formatter: function (value, row, index) {
                    return value ? value.text : "";
                }
            },
        ]]
    })

    //初始化弹出框
    menu_dialog.dialog({
        width: 250,
        height: 200,
        buttons: '#menu_btns',
        closed: true
    })

    //树形表格下拉框
    $("#menu-combotree").combotree({
        panelWidth:160,
        panelHeight:'200',
        url:'/menu/getRootMenu.do'
    })
})
