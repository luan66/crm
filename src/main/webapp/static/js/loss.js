$(function () {

    //抽取变量
    var loss_form = $("#loss_form");
    //提交资料
    var loss_dialog = $("#loss_dialog");
    var loss_datagrid = $("#loss_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        //审核
        editState:function () {
            //审核,改变状态,并且声成一张表
            //判断选中数据
            var row = loss_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $.messager.confirm("温馨提示", "确定审核吗", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/accident/audit.do",{losssId:row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                loss_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        reload:function () {
            loss_datagrid.datagrid("load");
        }


    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");

        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    loss_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/loss/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#loss_toolbar",
        columns: [[
            {field: 'name', title: '收款人名', width: 100, align: 'center'},
            {field: 'bankcard', title: '卡号', width: 100, align: 'center'},
            {field: 'totalaccount', title: '赔付总金额', width: 100, align: 'center'},
            {field: 'totalnumber', title: '损坏数量', width: 100, align: 'center'},
            {field: 'policySn', title: '保单号', width: 100, align: 'center'}
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
    $("#loss_datagrid").datagrid("load", {keyword: value});
}
function lookH(index) {
    $('#loss_datagrid').datagrid('selectRow',index);
    var row = $("#loss_datagrid").datagrid("getSelected");
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


