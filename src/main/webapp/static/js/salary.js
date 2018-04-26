$(function () {
    //抽取变量
    var sal_form = $("#sal_form");
    var sal_dialog = $("#sal_dialog");
    var sal_datagrid = $("#sal_datagrid");
    var btn_changeState = $("#btn_changeState");
    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        add: function () {
            sal_form.form("clear");
            sal_dialog.dialog("setTitle", "新建任务单");
            sal_dialog.dialog("open");
        },
        //编辑
        edit: function () {
            var salary = sal_datagrid.datagrid("getSelected");
            if (!salary) {
                $.messager.alert('温馨提示', '亲！请选择一条记录哦^_^', 'info');
                return;
            }
            sal_form.form("clear");
            sal_dialog.dialog("setTitle", "编辑任务单");
            var salId = salary.id;
            $.ajax({
                url: "/salary/listAll.do",
                data: {id: salId},
                async: false,
                success:function(data) {
                    $("[name=id]").val(data[0].task.id)
                    $("#sal_name").val(salary.employee.username);
                    $("#sal_sn").val(data[0].task.sn);
                    $("#_easyui_textbox_input5").val(data[0].task.plan);
                    $("#sal_place").val(data[0].task.place);
                    $("#sal_content").val(data[0].task.content);
                }
            });
            sal_dialog.dialog("open");
        },
        //保存
        save: function () {
            sal_form.form("submit", {
                url: "/salary/saveOrUpdate.do",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            sal_dialog.dialog("close");
                            sal_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        //取消
        cancel: function () {
            sal_dialog.dialog("close");
        },
        //改变任务完成的状态
        changState: function () {
            var salary = sal_datagrid.datagrid("getSelected");
            if (!salary) {
                $.messager.alert("温馨提示", "亲！请选中一条数据哦！", "info");
                return;
            }
            var flag = salary.state ? "待完成" : "已完成";
            var state = salary.state ? "0" : "1";
            $.messager.confirm("确认窗口", "确认要标记" + flag + "么?", function (r) {
                if (r) {
                    var id = sal_datagrid.datagrid("getSelected").id;
                    $.get("/salary/changeState.do", {id: id, state: state}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                sal_datagrid.datagrid("reload");
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
            window.location.href = "/salary/exportXls.do";
        },
        //刷新
        reload: function () {
            sal_datagrid.datagrid("load");
        }
    };
    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });
    //初始化datagrid
    sal_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/salary/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#sal_toolbar",
        columns: [[
            {field: 'employee', title: '姓名', width: 100, align: 'center',formatter:function(value, row, index) {
                return value ? value.username : "";
            }},
            {field: 'department', title: '部门', width: 100, align: 'center',formatter:function(value, row, index) {
                return value ? value.name : "";
            }},
            {field:'tel', title:'电话', width: 100, align: 'center'},
            {field:'email', title:'邮箱', width: 100, align: 'center'},
            {field:'basesalary', title:'基本工资', width: 100, align: 'center'},
            {field:'bonus', title:'奖金', width: 100, align: 'center'},
            {field:'month', title:'日期', width: 100, align: 'center'},
            {field:'totalsalary', title:'总薪资', width: 100, align: 'center'},
            {field: 'remark', title: '查看薪资明细', width: 100, align: 'center',formatter:function(value, row, index){
                return '<a href="javascript:;" class="easyui-linkbutton" onclick="look('+index+')">查看</a>';
            },
            }
        ]],
    });
    //初始化dialog
    $("#sal_dialog").dialog({
        width: 400,
        height: 400,
        closed: true
    });
});
//高级查询
function search(value) {
    var deptId = $("input[name = 'deptId']").val();
    var beginDate = $("input[name = 'beginDate']").val();
    var endDate = $("input[name = 'endDate']").val();

    $("#sal_datagrid").datagrid("load", {
        keyword: value,
        deptId: deptId,
        beginDate: beginDate,
        endDate: endDate
    });
}

function look(index) {
    $('#sal_datagrid').datagrid('selectRow',index);
    var salary = $('#sal_datagrid').datagrid('getSelected');
    $("#sal_form").form("clear");
    $("#sal_dialog").dialog("setTitle", "查看薪资明细");
    var salId = salary.id;
    $.ajax({
        url: "/salary/listAll.do",
        data: {id: salId},
        async: false,
        success:function(data) {
            $("#sal_basesalary").val(data[index].salary.basesalary);
            $("#sal_bonus").val(data[index].salary.bonus);
            $("#sal_hire").val(data[index].hire);
            $("#sal_pay").val(data[index].pay);
            $("#sal_tax").val(data[index].tax);
            $("#sal_postsalary").val(data[index].postsalary);
            $("#sal_ifpay").val(data[index].ifpay ? '是':'否');
            $("#sal_programme").val(data[index].programme);
            $("#sal_totalsalary").val(data[index].salary.totalsalary);
        }
    });
    $("#sal_dialog").dialog("open");
}
