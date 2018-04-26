$(function () {
    //抽取变量
    var sche_form = $("#sche_form");
    var sche_dialog = $("#sche_dialog");
    var sche_datagrid = $("#sche_datagrid");
    var btn_changeState = $("#btn_changeState");
    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        add: function () {
            sche_form.form("clear");
            sche_dialog.dialog("setTitle", "新建任务单");
            sche_dialog.dialog("open");
        },
        //编辑
        edit: function () {
            var schedule = sche_datagrid.datagrid("getSelected");
            if (!schedule) {
                $.messager.alert('温馨提示', '亲！请选择一条记录哦^_^', 'info');
                return;
            }
            sche_form.form("clear");
            sche_dialog.dialog("setTitle", "编辑任务单");
            var scheId = schedule.id;
            $.ajax({
                url: "/schedule/listAll.do",
                data: {id: scheId},
                async: false,
                success:function(data) {
                    $("[name=id]").val(data[0].task.id)
                    $("#sche_name").val(schedule.employee.username);
                    $("#sche_sn").val(data[0].task.sn);
                    $("#_easyui_textbox_input5").val(data[0].task.plan);
                    $("#sche_place").val(data[0].task.place);
                    $("#sche_content").val(data[0].task.content);
                }
            });
            sche_dialog.dialog("open");
        },
        //保存
        save: function () {
            sche_form.form("submit", {
                url: "/schedule/saveOrUpdate.do",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            sche_dialog.dialog("close");
                            sche_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        //取消
        cancel: function () {
            sche_dialog.dialog("close");
        },
        //改变任务完成的状态
        changState: function () {
            var schedule = sche_datagrid.datagrid("getSelected");
            if (!schedule) {
                $.messager.alert("温馨提示", "亲！请选中一条数据哦！", "info");
                return;
            }
            var flag = schedule.state ? "待完成" : "已完成";
            var state = schedule.state ? "0" : "1";
            $.messager.confirm("确认窗口", "确认要标记" + flag + "么?", function (r) {
                if (r) {
                    var id = sche_datagrid.datagrid("getSelected").id;
                    $.get("/schedule/changeState.do", {id: id, state: state}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                sche_datagrid.datagrid("reload");
                            })
                        } else {
                            $.messager.alert("温馨提示", data.message, "info");
                        }
                    })
                }
            })
        },
        //关键字查询
        searchForSche: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        },
        //打印任务
        exportXls: function () {
            window.location.href = "/schedule/exportXls.do";
        },
        //刷新
        reload: function () {
            sche_datagrid.datagrid("load");
        }
    };
    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });
    //初始化datagrid
    sche_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/schedule/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#sche_toolbar",
        columns: [[
            {field: 'currentdate', title: '日期', width: 100, align: 'center'},
            {field: 'employee', title: '姓名', width: 100, align: 'center',formatter:function(value, row, index) {
                return value ? value.username : "";
            }},
            {field: 'department', title: '部门', width: 100, align: 'center',formatter:function(value, row, index) {
                return value ? value.name : "";
            }},
            {field: 'task', title: '任务', width: 100, align: 'center',formatter:function(value, row, index) {
                return value ? value.sn : "";
            }},
            {field: 'state', title: '状态', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == null) {
                    return "<font color='orange'>待完成</font>";
                } else {
                    return value ? "<font color='green'>已完成</font>" : "<font color='red'>未完成</font>";
                }
            }},
            {field: 'remark', title: '查看任务', width: 100, align: 'center',formatter:function(value, row, index){
                return '<a href="javascript:;" class="easyui-linkbutton" onclick="look('+index+')">查看</a>';
                },
            }
        ]],
        //禁用按钮或启用按钮
        onSelect:function(index, data) {
            if (data.state == '已完成') {
                $("a[data-cmd='edit']").data("cmd","");
                $("a[data-cmd='edit']").linkbutton("disable");
                $("a[data-cmd='changState']").data("cmd","");
                $("a[data-cmd='changState']").linkbutton("disable");
            } else {
                $("a[data-cmd='edit']").data("cmd","edit");
                $("a[data-cmd='edit']").linkbutton("enable");
                $("a[data-cmd='changState']").data("cmd","changState");
                $("a[data-cmd='changState']").linkbutton("enable");
            }
        }
    });
    //初始化dialog
    sche_dialog.dialog({
        width: 400,
        height: 450,
        buttons: "#sche_btns",
        closed: true
    });
});
//高级查询
function search(value) {
    var deptId = $("input[name = 'deptId']").val();
    var beginDate = $("input[name = 'beginDate']").val();
    var endDate = $("input[name = 'endDate']").val();

    $("#sche_datagrid").datagrid("load", {
        keyword: value,
        deptId: deptId,
        beginDate: beginDate,
        endDate: endDate
    });
}
//查看任务明细
function look(index) {
    $('#sche_datagrid').datagrid('selectRow',index);
    var schedule = $('#sche_datagrid').datagrid('getSelected');
    $("#sche_form").form("clear");
    $("#sche_dialog").dialog("setTitle", "查看任务单");
    var scheId = schedule.id;
    $.ajax({
        url: "/schedule/listAll.do",
        data: {id: scheId},
        async: false,
        success:function(data) {
            $("#sche_name").val(schedule.employee.username);
            $("#sche_sn").val(data[0].task.sn);
            $("#_easyui_textbox_input5").val(data[0].task.plan);
            $("#sche_place").val(data[0].task.place);
            $("#sche_content").val(data[0].task.content);
        }
    });
    $("#sche_dialog").dialog("open");
}