$(function () {
    //1.抽取变量
    var systemLog_datagrid = $("#systemLog_datagrid");

    //2.方法统一管理,使用一个对象去管理方法
    var methodObj = {
        remove:function () {
            //判断选中数据
            var row = systemLog_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $.messager.confirm('温馨提示', '确认删除该日志吗？', function (r) {
                if (r) {
                    // 发送请求
                    $.get("/systemlog/delete.do", {id: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.msg, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                systemLog_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.msg, 'info');
                        }
                    })
                }
            });
        },

        reload:function () {
            $.messager.confirm('温馨提示', '您确定要加载系统日志吗？', function (r) {
                if(r){
                    // 发送请求
                    $.get("/systemlog/load.do", function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.msg, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                systemLog_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.msg, 'info');
                        }
                    })
                }
            })
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    systemLog_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#systemLog_toolbar',
        url:"/systemlog/listAll.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field: 'opuser', title: '操作人', width: 100,
                formatter:function (value, row, index) {
                    return value?value.username:"";
                }
            },
            {field: 'optime', title: '操作时间', width: 100},
            {field: 'opip', title: '操作主机ip', width: 100},
            {field: 'function', title: '操作的具体方法', width: 100},
            {field: 'params', title: '操作的参数条件', width: 100}
        ]],
    })

})
