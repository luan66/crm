$(function () {
    //1.抽取变量
    var fail_datagrid = $("#fail_datagrid");

    //2.方法统一管理,使用一个对象去管理方法

    var methodObj = {
        reload:function () {
            fail_datagrid.datagrid("reload");
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    fail_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#fail_toolbar',
        url:"/fail/list.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'id',title:'编号',width:30},
            {field:'failDate',title:'时间',width:50},
            {field:'customer',title:'客户',width:50,formatter:function (value,row,index) {
                return value ? value.name : '';
            }},

            {field:'chargeUser',title:'负责人',width:50,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'failReason',title:'详细原因',width:150},
        ]],
    })
})

function mysearch() {
    var customer = $("input[name=customer]").val();
    var chargeUser = $("input[name=chargeUser]").val();
    var beginDate = $("input[name=beginDate]").val();
    var endDate = $("input[name=endDate]").val();

    $("#fail_datagrid").datagrid("load",{
        customer:customer,
        chargeUser:chargeUser,
        beginDate:beginDate,
        endDate:endDate,
    })
}