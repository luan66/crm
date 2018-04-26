$(function () {
    //抽取变量
    var emp_password = $("#emp_password");
    var emp_form = $("#emp_form");
    var emp_dialog = $("#emp_dialog");
    var emp_datagrid = $("#emp_datagrid");
    var btn_changeState = $("#btn_changeState");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        add: function () {
            emp_password.show();
            emp_form.form("clear");
            emp_dialog.dialog("setTitle", "员工新增");
            emp_dialog.dialog("open");
        },
        edit: function () {
            emp_password.hide();

            var employee = emp_datagrid.datagrid("getSelected");

            if (!employee) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            emp_form.form("clear");
            emp_dialog.dialog("setTitle", "员工编辑");

            if (employee.department) {
                employee["department.id"] = employee.department.id;
            }
            emp_form.form("load", employee);

            //进行角色的数据回显,无法通过同名匹配,因为查询出来的为多个对象,不能通过employee.roles.id来匹配,需要通过combobox的setValue向里面传入一个对应id的集合
            var empId = employee.id;
            $.ajax({
                url: "/employee/queryRelationsByEmpId.do",
                data: {id: empId},
                async: false,
                success: function (data) {
                    $("#emp_roles").combobox("setValues", data);
                }
            });

            emp_dialog.dialog("open");
        },
        save: function () {
            emp_form.form("submit", {
                url: "/employee/saveOrUpdate.do",
                onSubmit: function (param) {
                    //注意这里获取combobox的多选值要用getValues,而不是用getValue,后者只能获取单个数据
                    var ids = $("#emp_roles").combobox("getValues");
                    //设置参数传递到后台的集合中
                    $.each(ids, function (index, item) {
                        // console.log(item);
                        param["roles[" + index + "].id"] = item;
                    });
                    console.log(param);
                    return $("#emp_form").form("validate");
                },
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            emp_dialog.dialog("close");
                            emp_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        cancel: function () {
            emp_dialog.dialog("close");
        },
        changState: function () {
            var employee = emp_datagrid.datagrid("getSelected");
            if (!employee) {
                $.messager.alert("温馨提示", "请选中一条数据!", "info");
                return;
            }

            //判断当前选中的员工的状态是离职还是在职,如果是在职,就设置点击时的提示消息为离职,同时设置标记为0,传到后台更改状态为0
            var state = employee.state ? "离职" : "在职";
            var flag = employee.state ? 0 : 1;

            $.messager.confirm("确认窗口", "确认要该员工" + state + "么?", function (r) {
                if (r) {
                    var id = emp_datagrid.datagrid("getSelected").id;
                    $.get("/employee/changeState.do", {id: id, flag: flag}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                emp_datagrid.datagrid("reload");
                            })
                        } else {
                            $.messager.alert("温馨提示", data.message, "info");
                        }
                    })
                }
            })
        },
        searchForEmp: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        },
        exportXls: function () {
            //xls文件导出
            window.location.href = "/employee/exportXls.do";
        },
        importXls: function () {
            //xls文件导入
            $("#emp_import").dialog("open");
        },
        download: function () {
            //文件下载
            window.location.href = "/employee/download.do";
        },
        reload: function () {
            emp_datagrid.datagrid("load");
        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });

    //初始化datagrid
    emp_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/employee/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#emp_toolbar",
        rownumbers:true,
        columns: [[
            {field: 'id', title: '员工编号', width: 50, align: 'center'},
            {field: 'username', title: '用户名', width: 100, align: 'center'},
            {field: 'realname', title: '真实姓名', width: 100, align: 'center'},
            {field: 'tel', title: '联系方式', width: 100, align: 'center'},
            {field: 'email', title: '邮箱', width: 100, align: 'center'},
            {field: 'inputTime', title: '入职时间', width: 100, align: 'center'},
            {
                field: 'department', title: '部门', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.name : "";
            }
            },
            /*{
             field: 'deptSn', title: '部门编号', width: 100, align: 'center', formatter: function (value, row, index) {
             return row.department ? row.department.sn : "";
             }
             },*/
            {
                field: 'state', title: '入职状态', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == null) {
                    return "";
                } else {
                    return value ? "在职" : "<font color='red'>离职</font>";
                }
            }
            },
            {
                field: 'admin', title: '是否管理员', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == null) {
                    return "";
                } else {
                    return value ? "是" : "否";
                }
            }
            }
        ]],
        onSelect: function (index, data) {
            if (!data.state) {
                /*btn_changeState.linkbutton("disable");*/
                //选中判断员工状态设置按钮文本显示离职还是在职
                btn_changeState.linkbutton({
                    text: "在职"
                });
                //移除data-cmd属性,同时增加disable方法禁用按钮
                $("a[data-cmd='edit']").data("cmd","");
                $("a[data-cmd='edit']").linkbutton("disable");

            } else {
                //btn_changeState.linkbutton("enable");
                btn_changeState.linkbutton({
                    text: "离职"
                });
                //同时设置编辑按钮为不可编辑
                //$("a[data-cmd='edit']").show();
                $("a[data-cmd='edit']").data("cmd", "edit");
                $("a[data-cmd='edit']").linkbutton("enable");

            }
        }
    });

    //初始化dialog
    emp_dialog.dialog({
        width : 280,
        height : 420,
        // 底部按钮
        buttons : "#emp_btns",
        closed : true
    });

    //初始化一个文件上传的dialog
    $("#emp_import").dialog({
        width: 400,
        height: 200,
        closed: true,
        title: "文件上传"
    })

    // 初始化弹出框
    // $("#emp_dialog").dialog({
    //     width : 280,
    //     height : 350,
    //     // 底部按钮
    //     buttons : "#emp_btns",
    //     closed : true
    // });

});

//注意,searchbox指定的search方法不能抽到method中管理
function search(value) {
    var deptId = $("input[name = 'deptId']").val();
    var beginDate = $("input[name = 'beginDate']").val();
    var endDate = $("input[name = 'endDate']").val();

    $("#emp_datagrid").datagrid("load", {
        keyword: value,
        deptId: deptId,
        beginDate: beginDate,
        endDate: endDate
    });

}



