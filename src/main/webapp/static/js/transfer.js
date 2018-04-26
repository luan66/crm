$(function () {
    //1.抽取变量
    var transfer_datagrid = $("#transfer_datagrid");

    //2.方法统一管理,使用一个对象去管理方法

    var methodObj = {
        reload:function () {
            transfer_datagrid.datagrid("reload");
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    transfer_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#transfer_toolbar',
        url:"/transfer/list.do?status=1",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'transDate',title:'移交日期',width:50},

            {field:'transUser',title:'操作人员',width:40,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'customer',title:'客户',width:40,formatter:function (value,row,index) {
                return value ? value.name : '';
            }},
            {field:'oldSeller',title:'原市场专员',width:40,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'newSeller',title:'新市场专员',width:40,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'transReason',title:'移交原因',width:100},
        ]],
    })
})

function mysearch() {
    var transUser = $("input[name=transUser]").val();
    var customer = $("input[name=customer]").val();
    var oldSeller = $("input[name=oldSeller]").val();
    var newSeller = $("input[name=newSeller]").val();
    var beginDate = $("input[name=beginDate]").val();
    var endDate = $("input[name=endDate]").val();

    $("#transfer_datagrid").datagrid("load",{
        transUser:transUser,
        customer:customer,
        oldSeller:oldSeller,
        newSeller:newSeller,
        beginDate:beginDate,
        endDate:endDate,
    })
}

