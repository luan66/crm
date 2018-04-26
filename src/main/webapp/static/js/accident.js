$(function () {

    //抽取变量
    var accident_form = $("#accident_form");
    //提交资料
    var submitImg_dialog = $("#submitImg_dialog");
    var accident_datagrid = $("#accident_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        editState: function () {
            //判断是否有选中数据
            var row = accident_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选择数据", "info");
                return;
            }
            $.messager.confirm("温馨提示", "确定受理该事故单", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/accident/seachState.do", {casesId: row["cases"].id, accidentsId: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                accident_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        save: function () {
            //保存方法
            accident_form.form("submit", {
                url: "/accident/update.do",
                success: function (data) {
                    //使用easyUi表单提交,返回需要转换为json
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //从新加载数据表格
                            accident_datagrid.datagrid("load");
                            //关闭窗口
                            submitImg_dialog.dialog("close");
                        })
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        reload: function () {
            accident_datagrid.datagrid("load");
        },
        cancel: function () {
            submitImg_dialog.dialog("close");
        },
        //提交事故现场资料
        submitImg: function () {
            //弹出表框  事故现场描述,和责任指定  补充描述
            //获取当前行,有信息会显示
            //判断是否有选中数据
            var row = accident_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert("温馨提示", "请选择数据", "info");
                return;
            }
            accident_form.form("clear");
            //回显数据
            accident_form.form("load", row);
            submitImg_dialog.dialog("setTitle", "保存资料");
            submitImg_dialog.dialog("open");
        },
        //提交理赔单
        submitLoss: function () {
            //获取当前行
            var row = accident_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert("温馨提示", "请选择数据", "info");
                return;
            }
            var obj = [];
            obj["policySn"] = row["policy"].sn;
            console.log(obj);
            $("#submitLoss_form").form("clear");
            $("#submitLoss_form").form("load", obj);

            $("#submitLoss_dialog").dialog("setTitle", "添加赔款信息");

            $("#submitLoss_dialog").dialog("open");
        },
        lossSave: function () {
            //保存理赔明细表,同时绑定在事故表上,
            $("#submitLoss_form").form("submit", {
                url: "/loss/saveOrUpdate.do",
                success: function (data) {
                    //使用easyUi表单提交,返回需要转换为json
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //从新加载数据表格
                            accident_datagrid.datagrid("load");
                            //关闭窗口
                            $("#submitLoss_dialog").dialog("close");
                        })
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        lossCancel: function () {
            $("#submitLoss_dialog").dialog("close");
        },
        //上报审批
        reported: function () {
            //发送请求,修改状态
            //获取当前行
            var row = accident_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert("温馨提示", "请选择数据", "info");
                return;
            }
            console.log(row.id);
            $.messager.confirm("温馨提示", "确定资料填写完,要上报审批吗?", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/accident/reported.do", {accidentId: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                accident_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        saveTest: function () {

        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");

        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    accident_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/accident/list.do?stateKeyMin=4",
        pagination: true,
        singleSelect: true,
        toolbar: "#accident_toolbar",
        onClickRow: function (rowIndex, rowData) {
            console.log(rowData)
            if (rowData.responsibility != '' && rowData.casesImg != '') {
                $("#submit_btn").linkbutton({text: '修改事故描述资料'});
                console.log(2);
            }
            if (rowData.loss != null) {
                $("#submitLoss_btn").linkbutton({text: '理赔资料已保存'});
                $("#submitLoss_btn").linkbutton("disable");
            }
            if (rowData.state > 3) {
                $("#reported_btn").linkbutton({text: '资料已提交审核'});
                $("#reported_btn").linkbutton("disable");
            }
            // if (!rowData.casesImg) {
            // } else {
            //     $("#changeState_btn").linkbutton({text: '离职'});
            // }
        },
        columns: [[
            {
                field: 'state', title: '当前状态', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == 1) {
                    return "<font color='red'>已去现场</font>";
                } else if (value == 2) {
                    return "<font color='red'>勘查完成</font>";
                } else if (value == 3) {
                    return "<font color='red'>已上报审批</font>";
                }
                else {
                    return "<font color='red'>待受理</font>";
                }
            }
            },
            {
                field: 'cases', title: '报案地址', width: 100, align: 'center', formatter: function (value, row, index) {
                return row["cases"].address ? row["cases"].address : "请联系紧急电话";
            }
            },
            {
                field: 'tel', title: '报案人电话', width: 100, align: 'center', formatter: function (value, row, index) {
                return row["cases"].tel ? row["cases"].tel : "没有电话,结合地址车牌号去现场";
            }
            },
            {
                field: 'platenumbers',
                title: '车牌号',
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    return row["cases"].platenumbers ? row["cases"].platenumbers : "没有报车牌号";
                }
            },
            {
                field: 'policy', title: '保单编号', width: 100, align: 'center', formatter: function (value, row, index) {
                if (row["policy"] != null) {
                    return row["policy"].sn ? row["policy"].sn : "没有保单号";
                } else {
                    return "";
                }
            }
            },
            {
                field: 'employee',
                title: '去现场员工',
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    return value ? value.username : "<font color='red'>未分配</font>";
                }
            },
            {field: 'casesImg', title: '事故描述', width: 100, align: 'center'},
            {field: 'responsibility', title: '事故责任指定', width: 100, align: 'center'},
            {
                field: 'loss', title: '赔损单', width: 100, align: 'center', formatter: function (value, row, index) {
                console.log(row)
                return '<a href="javascript:;" class="easyui-linkbutton" onclick="lookH(' + index + ')">查看明细</a>';

            }
            },
            {field: 'remark', title: '备注', width: 100, align: 'center'}
        ]]
    })

    //初始化dialog
    submitImg_dialog.dialog({
        width: 400,
        height: 370,
        buttons: "#accident_btns",
        closed: true
    });
    //初始化dialog
    $("#submitLoss_dialog").dialog({
        width: 400,
        height: 300,
        buttons: "#submitLoss_btns",
        closed: true
    });

    $('#dg').datagrid({
        width: 500,
        height: 430,
        url: '/loss/listAll.do',
        iconCls: 'icon-edit',
        singleSelect: true,
        method: 'get',
        onClickCell: onClickCell,
        columns: [[
            {field: 'state', title: '状态', width: 100, editor: 'text'},
            {field: 'casesImg', title: '备注', width: 100, editor: 'text'},
            {field: 'responsibility', title: '责任', width: 100, align: 'right', editor: 'text'}
        ]],
        closed: false,
        buttons: "#butn"
    });
});

function doSearch(value) {
    $("#accident_datagrid").datagrid("load", {keyword: value});
}

function lookH(index) {
    $('#accident_datagrid').datagrid('selectRow', index);
    var row = $("#accident_datagrid").datagrid("getSelected");
    //获取到当前行id
    //TODO  获取不到lossId
    if (row["loss"] != null) {
        var lossId = row["loss"].id;
    }
    console.log(lossId)
    //获取到当前行id
    $.get("/loss/get.do", {id: lossId}, function (data) {
        console.log(data);
        $("#submitLoss_form").form("clear");
        $("#submitLoss_form").form("load", data);
        $("#submitLoss_dialog").dialog("setTitle", "明细表");
        $("#submitLoss_dialog").dialog("open");
    })
}


