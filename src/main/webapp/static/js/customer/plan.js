$(function () {
    //1.抽取变量
    var plan_datagrid = $("#plan_datagrid");
    var plan_dialog = $("#plan_dialog");
    var plan_form = $("#plan_form");
    var chooseCust = $("#chooseCust");
    var chooseCust_dialog = $("#chooseCust_dialog");
    var cust_datagrid = $("#cust_datagrid");
    var mark_form = $("#mark_form");

    //2.方法统一管理,使用一个对象去管理方法

    var methodObj = {
        reload:function () {
            plan_datagrid.datagrid("reload");
        },
        cancel: function () {
            plan_dialog.dialog("close");
            mark_form.dialog("close");
        },
        add: function () {
            plan_form.form("clear");
            plan_dialog.dialog("setTitle", "新增计划");
            plan_dialog.dialog("open");
        },
        chooseCust:function () {
            chooseCust_dialog.dialog("open")

        },
        //删除
        remove:function () {
            var row = plan_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            $.messager.confirm("温馨提示", "确定要删除计划 : "+"<span style='color: red'>"+row.subject+"</span>"+" 吗?",function (r) {
                if (r){
                    $.get("/plan/delete.do",{id:row.id},function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                plan_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message, "info");
                        }
                    })
                }
            })
        },

        //标记执行结果
        mark:function () {
            var row = plan_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            mark_form.form("clear");

            row["id"] = row.id;
            mark_form.form("load",row);
            $("#sn").html(row.id);
            $("#subject").html(row.subject);
            mark_form.dialog("open");
        },
        //标记结果提交
        result:function () {
            mark_form.form("submit", {
                url: "/plan/result.do",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            mark_form.dialog("close");
                            plan_datagrid.datagrid("reload");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        save: function () {
            plan_form.form("submit", {
                url: "/plan/saveOrUpdate.do?status=false",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            plan_dialog.dialog("close");
                            plan_datagrid.datagrid("reload");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        //修改计划
        edit: function () {
            var row = plan_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            plan_form.form("clear");
            plan_dialog.dialog("setTitle", "修改计划");

            if (row.customer) {
                row["customer.id"] = row.customer.id;
                row["xx"] = row.customer.name;
            }
            plan_form.form("load", row);

            plan_dialog.dialog("open");
        },
        //选择客户 确定
        selectCust:function () {
            var row = cust_datagrid.datagrid("getSelected");

            $("[name='customer.id']").val(row.id);
            /*$("[name='customer.name']").val(row.name);*/
            $("#xx").textbox("setText",row.name)
            chooseCust_dialog.dialog("close");
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    plan_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#plan_toolbar',
        url:"/plan/list.do?status=0",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'id',title:'编号',width:30},
            {field:'result',title:'执行结果',width:30,formatter:function (value,row,index) {
                if (value == 3){
                    return "<span style='color: blue'>优</span>";
                };
                if (value == 2){
                    return "<span style='color: blue'>中</span>";
                };
                if (value == 1){
                    return "<span style='color: blue'>差</span>";
                };
            }},
            {field:'date',title:'计划时间',width:50},
            {field:'inputUser',title:'创建人',width:50,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'customer',title:'客户',width:30,formatter:function (value,row,index) {
                return value ? value.name : '';
            }},
            {field:'subject',title:'计划主题',width:50,},
            {field:'type',title:'实施方式',width:50,},
            {field:'detail',title:'详情',width:80,},
            {field:'remark',title:'备注',width:50,},
        ]],
    })

    //初始化数据表格  选择客户
    cust_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url:"/customer/list.do?status=1",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'chargeUser',title:'负责人',width:60,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
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
            {field:'email',title:'邮箱',width:100},
            {field:'address',title:'客户地址',width:100},
            {field:'idNo',title:'身份证号',width:100},
        ]],
    })

    //初始化dialog
    plan_dialog.dialog({
        width : 500,
        height : 370,
        // 底部按钮
        buttons : "#plan_btns",
        closed : true
    });
    //初始化dialog
    chooseCust_dialog.dialog({
        title:'请选择潜在客户',
        width : 660,
        height : 390,
        // 底部按钮
        buttons : "#chooseCust_btns",
        closed : true,
        modal:true,
    });
    //初始化dialog
    mark_form.dialog({
        title:'标记执行结果',
        width : 300,
        height : 230,
        // 底部按钮
        buttons : "#mark_btns",
        closed : true,
        modal:true,
    });

})

function mysearch() {
    var customer = $("input[name=customer]").val();
    var chargeUser = $("input[name=chargeUser]").val();
    var sbuject = $("input[name=sbuject]").val();
    var type = $("input[name=type]").val();
    var beginDate = $("input[name=beginDate]").val();
    var endDate = $("input[name=endDate]").val();

    $("#plan_datagrid").datagrid("load",{
        customer:customer,
        sbuject:sbuject,
        type:type,
        chargeUser:chargeUser,
        beginDate:beginDate,
        endDate:endDate,
    })
}