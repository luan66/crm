$(function () {
    var customer_datagrid = $("#customer_datagrid");
    var customer_form = $("#customer_form");
    var customer_dialog = $("#customer_dialog");
    var product_datalist = $("#product_datalist");
    //初始化数据表格
    customer_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url:"/policy/temporaryList.do?state=2",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        toolbar:"#customer_toolbar",
        columns: [[
            {field:'customer',title:'投保人',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.name:'';
                }
            },
            {field:'sn',title:'核保单号',width:100,align: 'center'},
            {field:'totalAmount',title:'需缴金额',width:70,align: 'center'},
            {field:'state',title:'缴费状态',width:70,align: 'center',
                formatter:function (value, row, index) {
                    if(value==0){
                        return '<font style="color:green">暂存状态</font>';
                    }
                    if(value==1){
                        return '<font style="color:green">待审核</font>';
                    }
                    if(value==2){
                        return '<font style="color:green">申请交费</font>';
                    }
                    if(value==3){
                        return '<font style="color:green">待修改</font>';
                    }
                    if(value==4){
                        return '<font style="color:green">缴费成功</font>';
                    }
                    if(value==5){
                        return '<font style="color:red">拒保</font>';
                    }
                }
            },
            {field:'duration',title:'保险年限/年',width:70,align: 'center'},
            {field:'checkDate',title:'核保日期',width:70,align: 'center'},
            {field:'safetyMechanism',title:'保险机构',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.name:'';
                }
            }
        ]]
    })

    // 统一绑定方法
    var methodObject = {
        edit:function () {

            var row = customer_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            customer_form.form("clear");
            customer_dialog.dialog("setTitle", "缴费处理");

            //数据回显
            if (row.customer) {
                row["customer.name"] = row.customer.name;
                row["customer.idNo"] = row.customer.idNo;
                row["customer.tel"] = row.customer.tel;
                row["customer.address"] = row.customer.address;
            }
            if (row.safetyMechanism) {
                row["safetyMechanism.name"] = row.safetyMechanism.name;
            }

            row["policy.sn"] = row.sn;
            row["totalAmount"] = row.totalAmount;

            customer_form.form("load", row);

            //进行产品的数据回显
            $.ajax({
                url: "/policy/selectProducts.do",
                data: {sn: row.sn},
                async: false,
                success: function (data) {
                    //products = $.extend(true,{},data);
                    $("#product_datagrid").datagrid("loadData",data);
                }
            });

            customer_dialog.dialog("open");
        },
        save: function () {
            customer_form.form("submit", {
                url: '/issuepolicy/saveOrUpdate.do',

                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //$("#form").form('clear');
                            customer_dialog.dialog('close');
                            //重新加载数据表格
                            customer_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        cancel:function () {
            customer_dialog.dialog('close');
        }

    };
    // 所有的 a 标签统一绑定点击事件, 从 methodObject 对象中
    $("[data-cmd]").click(function () {
        methodObject[$(this).data("cmd")]();
    });

    //初始化dialog
    customer_dialog.dialog({
        width : 380,
        height : 500,
        // 底部按钮
        buttons : "#customer_btns",
        closed : true
    });

    $("#product_datagrid").datagrid({
        columns: [[
            {field:'name',title:'险种',width : 110,align: 'center'},
            {field:'annuaFlee',title:'险种金额',width : 50,align: 'center'}
        ]]
    })
})

function doSearch(){
    var customerName = $("#customerName").val();
    var policySn = $("#policySn").val();
    $("#customer_datagrid").datagrid("load",{
        customerName:customerName,
        policySn:policySn
    })
}

