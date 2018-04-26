$(function () {
    var feesearch_datagrid = $("#feesearch_datagrid");
    var feesearch_form = $("#feesearch_form");
    var feesearch_dialog = $("#feesearch_dialog");
    //初始化数据表格
    feesearch_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url:"/issuepolicy/list.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        toolbar:"#feesearch_toolbar",
        columns: [[
            {field:'serialNumber',title:'保单号',width:70,align: 'center'},
            {field:'customer',title:'投保人',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.name:'';
                }
            },
            {field:'customer.tel',title:'电话',width:100,align: 'center',
                formatter:function (value, row, index) {
                    return row.customer?row.customer.tel:'';
                }
            },
            {field:'customer.address',title:'客户地址',width:100,align: 'center',
                formatter:function (value, row, index) {
                    return row.customer?row.customer.address:'';
                }
            },
            {field:'customer.idNo',title:'身份证号',width:100,align: 'center',
                formatter:function (value, row, index) {
                    return row.customer?row.customer.idNo:'';
                }
            },
            {field:'policy',title:'核保单号',width:100,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.sn:'';
                }
            },
            {field:'totalAmount',title:'保费金额',width:70,align: 'center'},
            {field:'state',title:'缴费状态',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?'缴费成功':'<font style="color:red">待缴费</font>';
                }
            },
            {field:'paymentWay',title:'缴费方式',width:70,align: 'center',
                formatter:function (value, row, index) {
                    if (value==0){
                        return "现金支付";
                    }
                    if (value==1){
                        return "刷卡支付";
                    }
                    if (value==2){
                        return "支票支付";
                    }
                }
            },
            {field:'beginDate',title:'起保日期',width:70,align: 'center'},
            {field:'endDate',title:'止保日期',width:70,align: 'center'},
            {field:'safetyMechanism',title:'保险机构',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.name:'';
                }
            },
            {field:'inputUser',title:'录入人',width:70,align: 'center',
                formatter:function (value, row, index) {
                    return value?value.username:'';
                }
            }
        ]]
    })
    // 统一绑定方法
    var methodObject = {
        edit:function () {

            var row = feesearch_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            feesearch_form.form("clear");
            feesearch_dialog.dialog("setTitle", "保单信息");

            //数据回显
            if (row.customer) {
                row["customer.name"] = row.customer.name;
                row["customer.idNo"] = row.customer.idNo;
                row["customer.tel"] = row.customer.tel;
                row["customer.address"] = row.customer.address;
            }
            if (row.safetyMechanism){
                row["safetyMechanism.name"] = row.safetyMechanism.name;
            }
            if (row.policy){
                row["policy.sn"] = row.policy.sn;
            }
            if (row.inputUser){
                row["inputUser.username"] = row.inputUser.username;
            }
            if (row.paymentWay==0){
                row["paymentWay"] = "现金支付";
            }
            if (row.paymentWay==1){
                row["paymentWay"] = "刷卡支付";
            }
            if (row.paymentWay==2){
                row["paymentWay"] = "支票支付";
            }

            feesearch_form.form("load", row);

            //进行产品的数据回显
            $.ajax({
                url: "/issuepolicy/productlist.do",
                data: {sn: row.policy.sn},
                async: false,
                success: function (data) {
                    //products = $.extend(true,{},data);
                    $("#product_datagrid").datagrid("loadData",data);
                }
            });

            feesearch_dialog.dialog("open");
        },
        doSearch:function () {
            var keyword = $("#keyword").val();
            var policySn = $("#policySn").val();
            var startDate = $("#startDate").val();
            var overDate = $("#overDate").val();
            console.log($("#startDate").val());
            feesearch_datagrid.datagrid("load",
                {
                    keyword:keyword,
                    policySn:policySn,
                    startDate:startDate,
                    overDate:overDate
                })
        },
        remove: function () {
            //先判断是否有选中行,没有的话就给出提示
            var row = feesearch_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选中一条记录", "info");
                return;
            }

            $.messager.confirm("温馨提示", "您确定要删除吗?", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/issuepolicy/delete.do?id=" + row.id, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                dictionary_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        reload: function () {
            feesearch_datagrid.datagrid("load");
        },
        cancel:function () {
            feesearch_dialog.dialog('close');
        }

    };
    // 所有的 a 标签统一绑定点击事件, 从 methodObject 对象中
    $("[data-cmd]").click(function () {
        methodObject[$(this).data("cmd")]();
    });

    //初始化dialog
    feesearch_dialog.dialog({
     width : 380,
     height : 500,
     // 底部按钮
     buttons : "#feesearch_btns",
     closed : true
     });

    $("#product_datagrid").datagrid({
        columns: [[
            {field:'name',title:'险种',align: 'center',width:110
            },
            {field:'annuaFlee',title:'险种金额',align: 'center',width:50
            }
        ]]
    })
})
