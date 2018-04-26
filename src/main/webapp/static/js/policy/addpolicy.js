$(function () {
    $("#hidethis").hide();
    /*var customer_dialog = $("#customer_dialog");*/
    var choose_product_dialog = $("#choose_product_dialog");
    var product_datagrid = $("#product_datagrid");
    var car_datagrid = $("#car_datagrid");
    var customer_datagrid = $("#customer_datagrid");
    var customer_form = $("#customer_form");
    var choose_customer_dialog = $("#choose_customer_dialog");
    var choose_car_dialog = $("#choose_car_dialog");
    var safe_select = $("#safe_select");
    /*初始化操作*/
    // 初始化保险产品选择页面数据表格
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
    $("#carcategory").combobox({

    })
    safe_select.combogrid({
        url:'/safetymechanism/listAll.do',
        panelWidth:450,
        value:'请选择',
        idField:'id',
        textField:'name',
        columns:[[
            {field: 'id', title: '编号', width: 50},
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
        ]],
        onChange:function () {
            var hiddens = $(".product-tr");
            $.each(hiddens, function (index, item) {
                if (index!=0){
                    $(item).remove();
                }
            });
            $("#totalAmount").html(0);
        }
    })
    choose_customer_dialog.dialog({
        width: 800,
        height: 350,
        buttons: '#customer_btns2',
        closed: true,
        modal: true
    });
    choose_product_dialog.dialog({
        width: 800,
        height: 350,
        buttons: '#product_btns2',
        closed: true,
        modal: true
    });
    choose_car_dialog.dialog({
        width: 800,
        height: 350,
        buttons: '#car_btns2',
        closed: true,
        modal: true
    });
    //初始化数据表格
    customer_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        // toolbar: '#customer_toolbar',
        url:"/customer/list.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'name',title:'客户姓名',width:70},
            {field:'gender',title:'性别',width:40,formatter:function (value, row, index) {
                if (value==null){
                    return '未知';
                }
                if (value){
                    return '男';
                }
                if (!value){
                    return '女';
                }
            }},
            {field:'tel',title:'电话',width:100},
            {field:'address',title:'客户地址',width:100},
            {field:'idNo',title:'身份证号',width:100}
        ]],
        onDblClickRow:function () {
            sure_customer();
        }
    })
    car_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        // toolbar: '#customer_toolbar',
        url:"/car/list.do",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field: 'brand', title: '车辆品牌', width: 100},
            {field: 'model', title: '车辆型号', width: 100},
            {field: 'gasDisplacement', title: '排气量', width: 100},
            {field: 'valuation', title: '市场估价', width: 100},
            {field: 'category', title: '分类', width: 100,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>载客</font>" : "<font color='red'>载物</font>"
                }
            },
            {field: 'size', title: '车载大小', width: 100,
                formatter: function (value, row, index) {
                    if (value==0&&value==''){
                        return "小型";
                    }else if (value==1){
                        return "中型";
                    }else if (value==1){
                        return "大型";
                    } else{
                        return "超大型";
                    }
                }
            },
            {field: 'remarks', title: '备注信息', width: 100}
        ]],
        onDblClickRow:function () {
            sure_car();
        }
    });


    // 统一绑定方法 TODO
    var methodObject = {
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
            var safeId = $("#safe_select").combobox("getValue");
            if (safeId=="请选择" || safeId==null || safeId==''){
                $.messager.alert("温馨提示","亲, 请先选择承保机构!","warning");
                return;
            }
            choose_product_dialog.dialog("open");
            choose_product_dialog.dialog("setTitle","按住 Ctrl 多选保险产品");
            console.debug("safeId", safeId);
            $.get("/product/list.do",{smId:safeId,sStatus:1},function (data) {
                product_datagrid.datagrid("loadData", data);
            } );
            var clone = $("#hidethis").clone(true);

        },
        add_customer: function(){
            //清空表单数据
            customer_form.form("clear");

            customer_dialog.dialog("setTitle", "新增");

            customer_dialog.dialog("open")
        },
        choose_customer: function(){

            choose_customer_dialog.dialog("setTitle", "选择客户");

            choose_customer_dialog.dialog("open")
        },
        choose_car: function(){
            choose_car_dialog.dialog("setTitle", "选择车辆");
            choose_car_dialog.dialog("open")
        },
        save: function () {
            customer_form.form("submit", {
                url: '/customer/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //重新加载数据表格
                            customer_datagrid.datagrid("load");

                            //关闭弹出框
                            customer_dialog.dialog("close");
                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        cancel: function () {
            customer_dialog.dialog("close");
        },
        select_customer: function () {
            sure_customer();
        },
        select_car: function () {
            sure_car();
        },

    };
    // 所有的 a 标签统一绑定点击事件, 从 methodObject 对象中
    $("[data-cmd]").click(function () {
        methodObject[$(this).data("cmd")]();
    });
    $("#accord1").accordion({
        animate: true,
        width: 1500,
        height: 190
    });
    $("#accord2").accordion({
        animate: true,
        width: 1500,
        height: 190
    });
    $("#accord3").accordion({
        animate: true,
        width: 1500,
        height: 190
    });
    $("#accord4").accordion({
        animate: true,
        width: 1500,
        height: 220
    });
    //为accord添加点击事件f
    $(".easyui-accordion .panel-header").click();

    $("#pp").combobox({
        onChange: function (NewId, oldId) {
            $('#cc').combobox({
                width: 143,
                panelHeight: 'auto',
                valueField: 'id',
                textField: 'name',
                url: "/location_children?id=" + NewId,
                onLoadSuccess: function (data) {
                    if (data) {
                        $('#cc').combobox('setValue', data[0].id);
                    }
                }
            });
        }
    });
    $("#ppp").combobox({
        onChange: function (NewId, oldId) {
            $('#ccc').combobox({
                width: 143,
                panelHeight: 'auto',
                valueField: 'id',
                textField: 'name',
                url: "/location_children?id=" + NewId,
                onLoadSuccess: function (data) {
                    if (data) {
                        $('#ccc').combobox('setValue', data[0].id);
                    }
                }
            });
        }
    });

});
function delete_this(data) {
    $(data).closest("#hidethis").remove();
    var totalAmount = 0;
    $.each($(".annuaFlee"), function (index, item) {
        totalAmount = totalAmount + parseInt(item.innerHTML);
    })
    console.debug($("#duration"));
    duration=$("#duration").val();
    console.debug(totalAmount,duration);
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
            console.debug($("#totalAmount").html());
            param.totalAmount = $("#totalAmount").html();
        },
        success: function (data) {
            data = $.parseJSON(data)
            if (!data.success) {
                $.messager.alert("温馨提示", data.message, "error");
            } else {
                $.messager.alert("温馨提示", data.message, "info", function () {
                    $("#form").form('clear');
                });
            }
        }
    });
}

function sure_customer() {
    var customer = $("#customer_datagrid").datagrid("getSelected");
    $("[name='customer.id']").val(customer.id);
    $("[name='customer.idNo']").val(customer.idNo);
    $("[name='customer.tel']").val(customer.tel);
    $("#address").textbox("setValue", customer.address);
    $("[name='customer.name']").val(customer.name);
    $("#customergender").combobox("setValue",customer.gender);
    $("#choose_customer_dialog").dialog("close");
}
function sure_car() {
    var car = $("#car_datagrid").datagrid("getSelected");
    
    $("#carbrand").textbox("setValue", car.brand);
    $("#carmodel").textbox("setValue",car.model);
    $("#cargasDisplacement").textbox("setValue",car.gasDisplacement);
    $("#carcategory").combobox("setValue",car.category);
    $("#carsize").combobox("setValue",car.size);
    $("#carvaluation").textbox("setValue",car.valuation);
    $("#choose_car_dialog").dialog("close");
}

//投保人用户确认
function affirm() {
    var idCard = $("#inIdCard").val();
    $.post('/offInsurance_selectByIdCard', {'idCard': idCard}, function (data) {
        if (!data.success) {
            $.messager.alert("温馨提示", data.msg, "error");
        } else {
            $.messager.alert("温馨提示", data.msg, "info", function () {
            });
        }
    })
}
//被保人用户确认
function offAffirm() {
    var idCard = $("#OffIdCard").val();
    $.post('/offInsurance_selectByIdCard', {'idCard': idCard}, function (data) {
        if (!data.success) {
            $.messager.alert("温馨提示", data.msg, "error");
        } else {
            $.messager.alert("温馨提示", data.msg, "info", function () {
            });
        }
    })
}
//查询保险信息
function openPro() {
    window.location.href = "/insuranceProduct";
}


//查询客户
function query_client() {
    window.location.href = "/customer";
}

//查询被投保人
function query_clientr(){
    window.location.href = "/customer";
}