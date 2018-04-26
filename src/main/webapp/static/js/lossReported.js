$(function () {

    //抽取变量
    var reported_form = $("#reported_form");
    //提交资料
    var reported_dialog = $("#reported_dialog");
    var reported_datagrid = $("#reported_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        //审核
        editState:function () {
            //审核,改变状态,并且声成一张表
            //判断选中数据
            var row = reported_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $.messager.confirm("温馨提示", "确定审核吗", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/accident/audit.do",{reportedsId:row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                reported_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        reload:function () {
            reported_datagrid.datagrid("load");
        }


    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");

        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    reported_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/accident/list.do?state=3",
        pagination: true,
        singleSelect: true,
        toolbar: "#reported_toolbar",
        columns: [[
            {field: 'state', title: '当前状态', width: 100, align: 'center',formatter:function (value, row, index) {
                    if(value==4){
                        return "<font color='red'>已审核</font>";
                    }
                    else {
                        return "<font color='red'>未审核</font>";
                    }

            }},
            {field: 'cases', title: '报案地址', width: 100, align: 'center',formatter:function (value, row, index) {
                return row["cases"].address?row["cases"].address:"请联系紧急电话";
            }},
            {field: 'tel', title: '报案人电话', width: 100, align: 'center',formatter:function (value, row, index) {
                return row["cases"].tel?row["cases"].tel:"没有电话,结合地址车牌号去现场";
            }},
            {field: 'platenumbers', title: '车牌号', width: 100, align: 'center',formatter:function (value, row, index) {
                return row["cases"].platenumbers?row["cases"].platenumbers:"没有报车牌号";
            }},
            {field: 'policy', title: '保单编号', width: 100, align: 'center',formatter:function (value, row, index) {
                return row["policy"].sn?row["policy"].sn:"没有保单号";
            }},
            {field: 'employee', title: '去现场员工', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.username : "<font color='red'>未分配</font>";
            }
            },
            {field: 'casesImg', title: '事故描述', width: 100, align: 'center'},
            {field: 'responsibility', title: '事故责任指定', width: 100, align: 'center'},
            {field: 'loss', title: '赔损单', width: 100, align: 'center',formatter:function (value, row, index) {
                return '<a href="javascript:;" class="easyui-linkbutton" onclick="lookH('+index+')">查看明细</a>';
            }},
            {field: 'remark', title: '备注', width: 100, align: 'center'}
        ]]
    })
    //初始化dialog
    $("#submitLoss_dialog").dialog({
        width: 320,
        height: 330,
        closed: true
    });

});

function doSearch(value) {
    $("#reported_datagrid").datagrid("load", {keyword: value});
}
function lookH(index) {
    $('#reported_datagrid').datagrid('selectRow',index);
    var row = $("#reported_datagrid").datagrid("getSelected");
    //获取到当前行id
    var lossId= row["loss"].id;
    console.log(lossId)
    //获取到当前行id
    $.get("/loss/get.do",{id:lossId},function (data) {

        $("#submitLoss_form").form("clear");
        $("#submitLoss_form").form("load",data);
        $("#submitLoss_dialog").dialog("setTitle","明细表");
        $("#submitLoss_dialog").dialog("open");
    })

}


