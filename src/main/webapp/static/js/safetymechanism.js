$(function () {
    //1.抽取变量
    var safetymechanism_form = $("#safetymechanism_form");
    var safetymechanism_datagrid = $("#safetymechanism_datagrid");
    var safetymechanism_dialog = $("#safetymechanism_dialog");
    //2.方法统一管理,使用一个对象去管理方法
    var methodObj = {
        add: function () {
            //清空表单数据
            safetymechanism_form.form("clear");

            safetymechanism_dialog.dialog("setTitle", "新增机构");

            safetymechanism_dialog.dialog("open");
        },
        edit: function () {
            //判断选中数据
            var row = safetymechanism_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //清空表单数据
            safetymechanism_form.form("clear");
            //回显表单
            safetymechanism_form.form("load", row);

            safetymechanism_dialog.dialog("setTitle", "编辑机构");

            safetymechanism_dialog.dialog("open");
        },
        cancel: function () {
            safetymechanism_dialog.dialog("close");
        },

        save: function () {
            safetymechanism_form.form("submit", {
                url: '/safetymechanism/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //重新加载数据表格
                            safetymechanism_datagrid.datagrid("load");
                            //关闭弹出框
                            safetymechanism_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        changeState:function () {
            //判断选中数据
            var row = safetymechanism_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示','请选中一条数据！','info');
                return;
            }
            //判断当前选中的员工的状态是离职还是在职,如果是在职,就设置点击时的提示消息为离职,同时设置标记为0,传到后台更改状态为0
            var state = row.cooperation ? "解除" : "合作";
            var flag = row.cooperation ? 0 : 1;

            $.messager.confirm("确认窗口", "确认要与该机构" + state + "吗?", function (r) {
                if (r){
                    //移入资源池:
                    $.get("/safetymechanism/changeState.do",{id:row.id,flag:flag},function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.message,'info', function () {
                                //重新加载数据表格
                                safetymechanism_datagrid.datagrid("load");
                                //关闭弹出框
                                safetymechanism_dialog.dialog("close");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.message, 'info');
                        }
                    })
                }
            } )
        },
        reload:function () {
            safetymechanism_datagrid.datagrid("reload");
        },
        searchForEmp: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        }
    }
    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })
    //初始化数据表格 使用的是datagrid的方式
    safetymechanism_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#safetymechanism_toolbar',
        url:"/safetymechanism/list.do",
        pagination: true,
        rownumbers:true,
        singleSelect: true,
        columns: [[
            {field: 'code', title: '机构代码', width: 70},
            {field: 'name', title: '机构名称', width: 130},
            {field: 'legalPerson', title: '法人代表', width: 50},
            {field: 'dentityCard', title: '法人身份证', width: 80},
            {field: 'contactWay', title: '联系方式', width: 50},
            {field: 'address', title: '联系地址', width: 100},
            {field: 'cooperation', title: '合作状态', width: 30,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>合作</font>" : "<font color='red'>解除</font>"
                }
            }
        ]]
    })
    //初始化弹出框 使用的是dialog
    safetymechanism_dialog.dialog({
        width: 240,
        height: 350,
        buttons: '#safetymechanism_btns',
        closed: true,
    })
})
function search(value) {
    //获取状态的参数
    var status = $("#safetymechanism_select").val();

    $("#safetymechanism_datagrid").datagrid("load", {
        keyword: value,
        status : status
    });

}