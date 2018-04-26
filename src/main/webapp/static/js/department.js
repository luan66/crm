$(function () {
    //1.抽取变量
    var department_form = $("#department_form");
    var department_datagrid = $("#department_datagrid");
    var department_dialog = $("#department_dialog");

    //2.方法统一管理,使用一个对象去管理方法

    var methodObj = {

        add: function () {
            //清空表单数据
            department_form.form("clear");

            department_dialog.dialog("setTitle", "新增部门");

            department_dialog.dialog("open");
        },
        edit: function () {
            //判断选中数据
            var row = department_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //清空表单数据
            department_form.form("clear");

            //回显部门经理
            if(row.manager){
                row["manager.id"] = row.manager.id;
            }

            //回显上级部门
            if (row.parent){
                row["parent.id"] = row.parent.id;
            }


            //回显表单
            department_form.form("load", row);

            department_dialog.dialog("setTitle", "编辑部门");

            department_dialog.dialog("open");
        },

        cancel: function () {
            department_dialog.dialog("close");
        },

        save: function () {
            department_form.form("submit", {
                url: '/department/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //重新加载数据表格
                            department_datagrid.datagrid("load");
                            //关闭弹出框
                            department_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },

        changeState: function () {
            //判断选中数据
            var row = department_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }

            $.messager.confirm('温馨提示', '确认该员工设置为离职吗？', function (r) {
                if (r) {
                    // 发送请求
                    $.get("/department/changeState.do", {id: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.message, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                department_datagrid.datagrid("reload");
                                //关闭弹出框
                                department_dialog.dialog("close");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.message, 'info');
                        }
                    })
                }
            });
        },
        reload:function () {
            department_datagrid.datagrid("reload");
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    department_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#department_toolbar',
        url:"/department/listAll.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field: 'sn', title: '部门编号', width: 100},
            {field: 'name', title: '部门名称', width: 100},
            {field: 'manager', title: '部门经理', width: 100,
                formatter: function (value, row, index) {
                    return value ? value.realname : "";
                }
            },
            {field: 'parent', title: '上级部门', width: 100,
                formatter: function (value, row, index) {
                    return value ? value.name : "";
                }
            },
            {field: 'state', title: '状态', width: 100,
                formatter: function (value, row, index) {
                    return value ? "正常" : "<font color='red'>停用</font>"
                }
            }
        ]],
        onClickRow: function (rowIndex, rowData) {
            if (!rowData.state) {
                $('#changeState_btn').linkbutton('disable');
                $('#edit_btn').linkbutton('disable');
            } else {
                $('#changeState_btn').linkbutton('enable');
                $('#edit_btn').linkbutton('enable');
            }
        }
    })

    //初始化弹出框
    department_dialog.dialog({
        width: 270,
        height: 230,
        buttons: '#department_btns',
        closed: true
    })

    //数据表格下拉框
    $('#department_combogrid').combogrid({
        panelWidth:500,
        panelHeight:'200',
        url:"/employee/listAll.do",
        columns:[[
            {field:'id',title:'ID',width:80},
            {field:'username',title:'用户名',width:80},
            {field:'realname',title:'真实姓名',width:80},
            {field:'tel',title:'电话',width:80},
            {field:'email',title:'邮箱',width:80},
            {field:'department',title:'部门',width:80,
                formatter: function (value, row, index) {
                    return value ? value.name : "";
                }
            }
        ]]
    });
    //树形表格下拉框
    $("#department-combotree").combotree({
        panelWidth:160,
        panelHeight:'200',
        url:'/department/getDeptTrees.do'
    })
})