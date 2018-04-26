$(function () {

    //抽取变量(目录)
    var salechart_datagrid = $("#salechart_datagrid");

    //初始化 目录datagrid
    salechart_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/chart/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#salechart_toolbar",
        rownumbers:true,
        columns: [[
            {field: 'groupType', title: '分组类型', width: 180, align: 'center'},
            {field: 'saleAmount', title: '销售总金额', width: 180, align: 'center'}
        ]]
    });
});

function doSearch(){
    var safetymechanismId = $("#safetymechanism").val();
    var productId = $("#product").val();
    var beginDate = $("#beginDate").val();
    var endDate = $("#endDate").val();
    var groupType = $("#groupType").val();
    $("#salechart_datagrid").datagrid("load",{
        safetymechanismId:safetymechanismId,
        productId:productId,
        beginDate:beginDate,
        endDate:endDate,
        groupType:groupType
    });

}

