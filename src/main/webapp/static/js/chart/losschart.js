$(function () {

    //抽取变量(目录)
    var losschart_datagrid = $("#losschart_datagrid");

    //初始化 目录datagrid
    losschart_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/chart/listloss.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#losschart_toolbar",
        rownumbers:true,
        columns: [[
            {field: 'groupType', title: '分组类型', width: 180, align: 'center'},
            {field: 'lossAmount', title: '理赔总金额', width: 180, align: 'center'}
        ]]
    });
});

function doSearch(){
    var safetymechanismId = $("#safetymechanism").val();
    var beginDate = $("#beginDate").val();
    var endDate = $("#endDate").val();
    var groupType = $("#groupType").val();
    $("#losschart_datagrid").datagrid("load",{
        safetymechanismId:safetymechanismId,
        beginDate:beginDate,
        endDate:endDate,
        groupType:groupType
    });

}

