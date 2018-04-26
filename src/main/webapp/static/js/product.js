$(function () {
    //1.抽取变量
    var product_form = $("#product_form");
    var product_datagrid = $("#product_datagrid");
    var product_dialog = $("#product_dialog");
    //2.方法统一管理,使用一个对象去管理方法
    var methodObj = {
        add: function () {
            //清空表单数据
            product_form.form("clear");

            product_dialog.dialog("setTitle", "新增保险");

            product_dialog.dialog("open");
        },
        edit: function () {

            var product = product_datagrid.datagrid("getSelected");

            if (!product) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            //清空数据
            product_form.form("clear");
            product_dialog.dialog("setTitle", "保险编辑");

            if (product.safetyMechanism) {
                product["safetyMechanism.name"] = product.safetyMechanism.name;
                product["safetyMechanism.id"] = product.safetyMechanism.id;
            }
            product_form.form("load", product);

            product_dialog.dialog("open");
        },
        cancel: function () {
            product_dialog.dialog("close");
        },

        save: function () {
            product_form.form("submit", {
                url: '/product/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //重新加载数据表格
                            product_datagrid.datagrid("load");
                            //关闭弹出框
                            product_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        reload:function () {
            product_datagrid.datagrid("reload");
        },
        searchForEmp: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })

    //初始化数据表格 使用的是datagrid的方式
    product_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#product_toolbar',
        url:"/product/list.do",
        pagination: true,
        rownumbers:true,
        singleSelect: true,
        columns: [[
            {field: 'sn', title: '保险编号', width: 30},
            {field: 'name', title: '保险名称', width: 120},
            {field: 'safetyMechanism', title: '保险机构', width: 200,
                formatter: function (value, row, index) {
                    return value ? value.name : '';
                }},
            {field: 'safeguardYear', title: '保障年限', width: 50},
            {field: 'totalMoney', title: '保额', width: 50},
            {field: 'annuaFlee', title: '基本年费', width: 50},
            {field: 'salesStatus', title: '销售状态', width: 50,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>在售</font>" : "<font color='red'>停售</font>"
                }
            },
            {field: 'undeduction', title: '不计免赔', width: 50,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>是</font>" : "<font color='red'>否</font>"
                }
            }
        ]]
    })

    //初始化弹出框 使用的是dialog
    product_dialog.dialog({
        width: 270,
        height: 380,
        buttons: '#product_btns',
        closed: true,

    })
})
function search(value) {
    //获取状态的参数
    var sStatus = $("#product_selectSalesStatus").val();
    var uStatus = $("#product_selectUndeduction").val();

    $("#product_datagrid").datagrid("load", {
        keyword: value,
        sStatus:sStatus,
        uStatus:uStatus,
    });

}