$(function () {

    //抽取变量
    var case_form = $("#case_form");
    var case_dialog = $("#case_dialog");
    var case_datagrid = $("#case_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        add: function () {

            case_form.form("clear");

            case_dialog.dialog("setTitle", "案件新增");
            case_dialog.dialog("open");
        },
        edit: function () {
            //判断是否有选中数据
            var row = case_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选择数据", "info");
                return;
            }
            case_form.form("clear");
            //回显表单
            case_form.form("load", row);
            //编辑信息,
            case_dialog.dialog("open");
        },
        save: function () {
            //保存方法
            case_form.form("submit", {
                url: "/cases/saveOrUpdate.do",

                success: function (data) {
                    //使用easyUi表单提交,返回需要转换为json
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //从新加载数据表格
                            case_datagrid.datagrid("load");
                            //关闭窗口
                            case_dialog.dialog("close");
                        })
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        reload: function () {
            case_datagrid.datagrid("load");
        },
        cancel: function () {
            case_dialog.dialog("close");
        },
        seachState: function () {
            //先判断是否有选中行,没有的话就给出提示
            var row = case_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选中一条记录", "info");
                return;
            }

            $.messager.confirm("温馨提示", "点击确定查询保单", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/cases/seachState.do",{policySn:row.policySn,casesId:row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                case_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
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
    case_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/cases/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#case_toolbar",
        columns: [[
            {field: 'state', title: '当前状态', width: 100, align: 'center',formatter:function (value, row, index) {
                    if(value==1){
                        return "待处理";
                    }else if(value==2){
                        return "<font color='red'>已出车</font>";
                    }else if(value == 3){
                        return "<font color='red'>保单失效</font>";
                    }else if(value==4){
                        return "<font color='red'>没有该保单</font>";
                    }else if(value==5){
                        return "<font color='red'>已完成</font>"
                    }
                    else {
                        return "<font color='red'>待验证</font>";
                    }
            }},
            {field: 'name', title: '报案人名字', width: 100, align: 'center'},
            {field: 'sex', title: '报案人性别', width: 100, align: 'center'},
            {field: 'tel', title: '联系电话', width: 100, align: 'center'},
            {field: 'receivetime', title: '发生时间', width: 100, align: 'center'},
            {field: 'address', title: '发生地点', width: 100, align: 'center'},
            {field: 'policySn', title: '保单编号', width: 100, align: 'center'},
            {field: 'platenumbers', title: '车牌号', width: 100, align: 'center'},
            {field: 'employee', title: '接通员工', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.username : "";
            }
            }
        ]]
    });

    //初始化dialog
    case_dialog.dialog({
        width: 450,
        height: 420,
        buttons: "#case_btns",
        closed: true
    });

});

function doSearch(value) {
    $("#case_datagrid").datagrid("load", {keyword: value});
}



