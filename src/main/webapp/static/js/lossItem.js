$(function () {
    //抽取变量
    var lossItem_form = $("#lossItem_form");
    //提交资料
    var lossItem_dialog = $("#lossItem_dialog");
    var lossItem_datagrid = $("#ac");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        reload: function () {
            lossItem_datagrid.datagrid("load");
        },

        //查看明细
        save: function () {
            console.log("21313");
            var row = lossItem_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $(function () {
                $.dialog.open("/lossItem/get.do?id=" + (row.id), {
                    title: "事故明细表",
                    width: 950,
                    height: 680
                })
            })
        },



    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");

        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    lossItem_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/lossItem/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#lossItem_toolbar",
        columns: [[

            {
                field: 'state', title: '状态', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == 2) {
                    return "<font color='green'>已发送</font>";
                }
                else {
                    return "<font color='red'>未发送给客户</font>";
                }
            }
            },
            {field: 'ownerName', title: '车主信息', width: 100, align: 'center'},
            {field: 'policySn', title: '保单号', width: 100, align: 'center'},
            {field: 'policyCompany', title: '机构名称', width: 100, align: 'center'},
            {field: 'policyName', title: '险种', width: 100, align: 'center'},
            {field: 'lossAddress', title: '事故地点', width: 100, align: 'center'},
            {field: 'casesTime', title: '事故时间', width: 100, align: 'center'},
            {field: 'accidentEmpName', title: '去现场员工', width: 100, align: 'center'},
            {field: 'carName', title: '车辆信息', width: 100, align: 'center'}
        ]]
    })
    //初始化dialog
    $("#submitLoss_dialog").dialog({
        width: 320,
        height: 330,
        closed: true
    });
    //初始化dialog
    $("#div2").dialog({
        width: 500,
        height: 400,
        closed: true
    });

});

function doSearch(value) {
    $("#ac").datagrid("load", {keyword: value});
}


function lookH(index) {
    $('#ac').datagrid('selectRow', index);
    var row = $("#ac").datagrid("getSelected");
    //获取到当前行id
    var lossItemId = row["lossItem"].id;
    console.log(lossItemId)
    //获取到当前行id
    $.get("/lossItem/get.do", {id: lossItemId}, function (data) {

        $("#submitLoss_form").form("clear");
        $("#submitLoss_form").form("load", data);
        $("#submitLoss_dialog").dialog("setTitle", "明细表");
        $("#submitLoss_dialog").dialog("open");
    })
}

//导出
function exportSxl() {
    $.messager.alert('温馨提示', '导出成功！c:/User/明细表.sxl', 'info');
}

//发送给客户
 function send() {

    var row = $("#ac").datagrid("getSelected");
    if (!row) {
        $.messager.alert('温馨提示', '请选中一条数据！', 'info');
        return;
    }
    $.messager.confirm("温馨提示", "发送给客户", function (r) {
        if (r) {
            //获取选中行的id
            $.get("/lossItem/send.do", {id: row.id}, function (data) {
                if (data.success) {
                    $.messager.alert("温馨提示", data.message, "info", function () {
                        $("#ac").datagrid("reload");
                    });
                } else {
                    $.messager.alert("温馨提示", data.message);
                }
            })
        }
    })
}
