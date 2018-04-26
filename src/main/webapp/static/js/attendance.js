$(function () {
    //抽取变量
    var att_dialog = $("#att_dialog");
    var att_datagrid = $("#att_datagrid");
    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        searchForAtt: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        }
    }
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    })
    att_dialog.dialog({
        width: 400,
        height: 500,
        top:50,
        closed: true
    })
    //初始化表格数据
    att_datagrid.datagrid({
        url: '/attendance/list.do',
        fit: true,
        fitColumns: true,
        striped: true,
        pagination: true,
        singleSelect: true,
        toolbar: '#att_search',
        columns: [[
            {field: 'currentdate', title: '日期', width: 100, align: 'center'},
            {
                field: 'employee',
                title: '员工姓名',
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    return value ? value.username : "";
                }
            },
            {
                field: 'department',
                title: '部门',
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    return value ? value.name : "";
                }
            },
            {field: 'begintime', title: '上班时间', width: 100, align: 'center'},
            {field: 'endtime', title: '下班时间', width: 100, align: 'center'},
            {field: 'state', title: '考勤状态', width: 100, align: 'center',formatter:function(value, row, index) {
                if (row.begintime == null || row.endtime == null) {
                    return "<font color='red'>异常</font>";
                } else {
                    return "<font color='green'>正常</font>";
                }
            }},
        ]]
    })
})

function search(data) {
    var deptId = $("input[name = 'deptId']").val();
    var beginDate = $("input[name = 'beginDate']").val();
    var endDate = $("input[name = 'endDate']").val();

    $("#att_datagrid").datagrid("load", {
        keyword: data,
        deptId: deptId,
        beginDate: beginDate,
        endDate: endDate
    });
}