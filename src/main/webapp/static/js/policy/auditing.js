$(function () {
    $("#hidethis").hide();
    //抽取变量
    // var temporary_password = $("#temporary_password");
    var temporary_form = $("#temporary_form");
    var temporary_dialog = $("#temporary_dialog");
    var temporary_datagrid = $("#temporary_datagrid");
    var choose_product_dialog = $("#choose_product_dialog");
    var product_datagrid = $("#product_datagrid");
    var policy_dialog = $("#policy_dialog");
    var safe_select = $("#safe_select");
    // var btn_changeState = $("#btn_changeState");
    $("#aa").accordion("select","投保人");

    // 手风琴初始化
    $("#accord1").accordion({
        animate: true,
        width: 800,
        height: 130,
        selected: true
    });
    $("#accord2").accordion({
        animate: true,
        width: 800,
        height: 130
    });
    $("#accord3").accordion({
        animate: true,
        width: 800,
        height: 160
    });
    choose_product_dialog.dialog({
        width: 800,
        height: 350,
        buttons: '#product_btns2',
        closed: true,
        modal:true
    });
    product_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#product_toolbar',
        url:"/product/list.do",
        pagination: true,
        rownumbers:true,
        ctrlSelect: true,
        columns: [[
            {field: 'sn', title: '保险编号', width: 100},
            {field: 'name', title: '保险名称', width: 100},
            {field: 'safetyMechanism', title: '保险机构', width: 100,
                formatter: function (value, row, index) {
                    return value ? value.name : '';
                }},
            {field: 'safeguardYear', title: '保障年限', width: 100},
            {field: 'totalMoney', title: '保额', width: 100},
            {field: 'annuaFlee', title: '基本年费', width: 100},
            {field: 'salesStatus', title: '销售状态', width: 100,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>在售</font>" : "<font color='red'>停售</font>"
                }
            },
            {field: 'undeduction', title: '不计免赔', width: 100,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>是</font>" : "<font color='red'>否</font>"
                }
            }
        ]]
    });
    safe_select.combogrid({
        url:'/safetymechanism/listAll.do',
        panelWidth:450,
        value:'请选择',
        idField:'code',
        textField:'name',
        columns:[[
            {field: 'code', title: '机构代码', width: 100},
            {field: 'name', title: '机构名称', width: 100},
            {field: 'legalPerson', title: '法人代表', width: 100},
            {field: 'dentityCard', title: '法人身份证', width: 100},
            {field: 'contactWay', title: '联系方式', width: 100},
            {field: 'address', title: '联系地址', width: 100},
            {field: 'cooperation', title: '合作状态', width: 100,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>合作</font>" : "<font color='red'>解除</font>"
                }
            }
        ]]
    });
    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        // 保单编辑
        edit: function () {
            var temporary = temporary_datagrid.datagrid("getSelected");
            if (!temporary) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            temporary_form.form("clear");
            temporary_dialog.dialog("setTitle", "保单编辑");
            temporary_dialog.dialog("open");
            $.get("/policy/policyDetail.do", {id:temporary.id}, function (data) {
                // 数据都封装到dialog上
                // 设置隐藏域
                $("[name=id]").val(temporary.id);
                $("[name='customer.id']").val(data.customer.id);
                $("[name='customer.name']").val(data.customer.name);
                $("[name='customer.gender']").val(data.customer.gender);
                $("[name='customer.tel']").val(data.customer.tel);
                $("[name='customer.idNo']").val(data.customer.idNo);
                $("[name='customer.address']").val(data.customer.address);
                // 设置车辆信息

                $("[name='car.id']").val(data.car.id);
                $("[name='car.customer.name']").val(data.customer.name);
                $("[name='car.brand']").val(data.car.brand);
                $("[name='car.model']").val(data.car.model);
                $("[name='car.gasDisplacement']").val(data.car.gasDisplacement);
                $("[name='car.plateNumber']").val(data.car.plateNumber);
                $("[name='car.category']").val(data.car.category);
                $("#purchaseDate").datebox('setValue', data.car.purchaseDate);
                // $("#purchaseDate").val(data.car.purchaseDate);
                $("[name='car.valuation']").val(data.car.valuation);
                $("[name='car.size']").val(data.car.size);
                // 设置保险产品

                var safe = "";
                $.each(data.products, function (index, item) {
                    safe = item.safetyMechanism;
                    var clone = $("#hidethis").clone(true);
                    clone.show();
                    clone.attr("data-oid",item.id);
                    clone.find("#productName").html(item.name);
                    clone.find("#productSn").html(item.sn);
                    clone.find("#annuaFlee").html(item.annuaFlee);
                    clone.insertAfter($("#hidethis"));
                });
                $("#safe_select").combogrid("setValue",safe.name);
                $("[name='duration']").val(data.duration);
                var totalAmount = 0;
                $.each($(".annuaFlee"), function (index, item) {
                    totalAmount = totalAmount + parseInt(item.innerHTML);
                })
                var duration = $("[name=duration]").val();
                $("#totalAmount").html(totalAmount * duration);
            });
        },
        // 选中的保险产品信息添加到页面
        select_product: function () {
            var products = product_datagrid.datagrid("getSelections");
            var oids = $.map($(".product-tr"), function (item,index) {
                return $(item).attr("data-oid");
            });
            $.each(products, function (index, item) {
                if ($.inArray(item.id + "", oids)==-1){
                    var clone = $("#hidethis").clone(true);
                    clone.show();
                    clone.attr("data-oid",item.id);
                    clone.find("#productName").html(item.name);
                    clone.find("#productSn").html(item.sn);
                    clone.find("#annuaFlee").html(item.annuaFlee);
                    clone.insertAfter($("#hidethis"));
                }
            });
            var totalAmount = 0;
            $.each($(".annuaFlee"), function (index, item) {
                totalAmount = totalAmount + parseInt(item.innerHTML);
            })
            var duration = $("[name=duration]").val();
            $("#totalAmount").html(totalAmount * duration);
            choose_product_dialog.dialog("close");
        },
        // 添加商品信息
        add_product: function () {
            choose_product_dialog.dialog("open");
            choose_product_dialog.dialog("setTitle","按住 Ctrl 多选");
            var safeId = $("#safe_select").val();
            console.debug("safeId", safeId);
            $.get("/product/list.do",{smId:safeId,sStatus:1},function (data) {
                console.debug(data);
                product_datagrid.datagrid("loadData", data);
            } );
            var clone = $("#hidethis").clone(true);

        },
        audit: function () {
            var temporary = temporary_datagrid.datagrid("getSelected");
            if (!temporary) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            var id = temporary.id;
            $.get("/policy/audit.do",{id:id}, function (data) {
                if (data.success) {
                    $.messager.alert("温馨提示", data.message, "info", function () {
                        temporary_dialog.dialog("close");
                        temporary_datagrid.datagrid("load");
                    });
                } else {
                    $.messager.alert("温馨提示", data.message, "info");
                }
            })
        },
        save: function () {
            temporary_form.form("submit", {
                url: "/temporary/saveOrUpdate.do",
                onSubmit: function (param) {
                    //注意这里获取combobox的多选值要用getValues,而不是用getValue,后者只能获取单个数据
                    var ids = $("#temporary_roles").combobox("getValues");
                    //设置参数传递到后台的集合中
                    $.each(ids, function (index, item) {
                        param["roles[" + index + "].id"] = item;
                    });
                    return $("#temporary_form").form("validate");
                },
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            temporary_dialog.dialog("close");
                            temporary_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        cancel: function () {
            temporary_dialog.dialog("close");
            $.each($(".product-tr"), function (index, item) {
                // console.debug($(item).attr("data-oid"));
                if ($(item).attr("data-oid")!=-1){
                    item.remove();
                }
            })
        },
        roll: function () {
            var temporary = temporary_datagrid.datagrid("getSelected");
            if (!temporary) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            var id = temporary.id;
            $.messager.prompt('提示信息', '请输入退改事由：', function(r){
                if (r==null || r==''){
                    return;
                }
                $.post("/policy/roll.do",{id:id,remark:r}, function (data) {
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            temporary_dialog.dialog("close");
                            temporary_datagrid.datagrid("load");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                });
            });


        },
        changState: function () {

            var temporary = temporary_datagrid.datagrid("getSelected");
            if (!temporary) {
                $.messager.alert("温馨提示", "请选中一条数据!", "info");
                return;
            }

            //判断当前选中的保单的状态是离职还是在职,如果是在职,就设置点击时的提示消息为离职,同时设置标记为0,传到后台更改状态为0
            var state = temporary.state ? "离职" : "在职";
            var flag = temporary.state ? 0 : 1;

            $.messager.confirm("确认窗口", "确认要该保单" + state + "么?", function (r) {
                if (r) {
                    var id = temporary_datagrid.datagrid("getSelected").id;
                    $.get("/temporary/changeState.do", {id: id, flag: flag}, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                temporary_datagrid.datagrid("reload");
                            })
                        } else {
                            $.messager.alert("温馨提示", data.message, "info");
                        }
                    })
                }
            })
        },
        searchForEmp: function () {
            var keyword = $("input[name = 'keyword']").val();
            search(keyword);
        },
        reload: function () {
            temporary_datagrid.datagrid("reload");
        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });

    //初始化datagrid
    temporary_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/policy/temporaryList.do?state=1",
        pagination: true,
        singleSelect: true,
        toolbar: "#temporary_toolbar",
        columns: [[
            {field: 'sn', title: '保单编号', width: 100, align: 'center'},
            {
                field: 'customer', title: '投保人', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.name : "";
            }
            },
            {field: 'applyDate', title: '申请日期', width: 100, align: 'center'},

            {field: 'checkDate', title: '核保日期', width: 100, align: 'center'},
            {field: 'endDate', title: '保险截止日', width: 100, align: 'center'},
            {field: 'duration', title: '保险时长(/年)', width: 100, align: 'center'},
            {
                field: 'inputUser', title: '业务员', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.realname : "";
            }
            },
            {
                field: 'auditor', title: '审核人', width: 100, align: 'center', formatter: function (value, row, index) {
                return value ? value.realname : "";
            }
            },
            {field: 'totalAmount', title: '投保总金额', width: 100, align: 'center'},
            {field: 'state', title: '状态', width: 100, align: 'center', formatter: function (value, row, index) {
                var state="";
                if (value==0){
                    state="暂存";
                } else if (value==1){
                    state ="未审核"
                } else if (value==2){
                    state ="已审核待缴费"
                } else if (value==3){
                    state ="已缴费"
                }
                return state;
            }},
            {
                field: 'detail', title: '查看明细', width: 100, align: 'center', formatter: function (value, row, index) {
                return "<a href='#' id='detail'>保险产品明细</a>";
            }
            }
            /*{
             field: 'deptSn', title: '部门编号', width: 100, align: 'center', formatter: function (value, row, index) {
             return row.department ? row.department.sn : "";
             }
             },*/

        ]],
        onSelect: function (index, data) {
        }
    });

    temporary_dialog.dialog({
        width: 810,
        height: 450,
        // 底部按钮
        buttons: "#temporary_btns",
        closed: true,
        modal: true
    });
});
function delete_this(data) {
    $(data).closest("#hidethis").remove();
    var totalAmount = 0;
    $.each($(".annuaFlee"), function (index, item) {
        totalAmount = totalAmount + parseInt(item.innerHTML);
    })
    var duration = $("[name=duration]").val();
    $("#totalAmount").html(totalAmount * duration);
}
function calculate() {
    var totalAmount = 0;
    $.each($(".annuaFlee"), function (index, item) {
        totalAmount = totalAmount + parseInt(item.innerHTML);
    })
    var duration = $("[name=duration]").val();
    $("#totalAmount").html(totalAmount * duration);
}
//注意,searchbox指定的search方法不能抽到method中管理
function searchTemporary() {
    $("#temporary_form").form("submit",{
        url: "/policy/temporaryList.do",
        success: function (data) {
            data = $.parseJSON(data);
            $("#temporary_datagrid").datagrid("loadData",data);
        }
    })

}

// 暂存保单, 提交表单
function temporary_submit() {
    $("#form").form("submit", {
        url: '/policy/saveOrUpdate.do',
        onSubmit: function (param) {
            var oids = $.map($(".product-tr"), function (item,index) {
                return $(item).attr("data-oid");
            });
            oids.shift();
            param.pIds = oids;
        },
        success: function (data) {
            data = $.parseJSON(data)
            if (!data.success) {
                $.messager.alert("温馨提示", data.message, "error");
            } else {
                $.messager.alert("温馨提示", data.message, "info", function () {
                    $("#form").form('clear');
                    $("#temporary_dialog").dialog("close");
                });
            }
        }
    });
}


