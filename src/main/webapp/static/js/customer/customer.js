$(function () {
    //1.抽取变量
    var customer_form = $("#customer_form");
    var customer_datagrid = $("#customer_datagrid");
    var customer_dialog = $("#customer_dialog");
    var transfer_dialog = $("#transfer_dialog");
    var transfer_form = $("#transfer_form");
    var fail_form = $("#fail_form");
    var fail_dialog = $("#fail_dialog");
    var lost_form = $("#lost_form");
    var lost_dialog = $("#lost_dialog");
    var choose_dialog = $("#choose_dialog");

    //2.方法统一管理,使用一个对象去管理方法
    $("#yy").attr("align","center")
//
    var methodObj = {

        add: function () {
            //清空表单数据
            customer_form.form("clear");

            customer_dialog.dialog("setTitle", "新增");

            customer_dialog.dialog("open");
        },
        edit: function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //清空表单数据
            customer_form.form("clear");

            //回显性别
            if(row.manager){
                row["gender"] = row.gender;
            }

            //回显上级部门
            if (row.parent){
                row["parent.id"] = row.parent.id;
            }


            //回显表单
            customer_form.form("load", row);

            customer_dialog.dialog("setTitle", "编辑");

            customer_dialog.dialog("open");
        },

        cancel: function () {
            customer_dialog.dialog("close");
            transfer_dialog.dialog("close");
            fail_dialog.dialog("close");
            lost_dialog.dialog("close");
        },
        //打开选择创建人dialog
        open_choose:function () {
            choose_dialog.dialog("open")
        },
        //客户移交
        transfer:function () {

            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            //清空表单数据
            transfer_form.form("clear");

            //回显客户姓名
               row["customer.id"]=row.id;
               $("#name").html(row.name);


            //回显负责人姓名,id
            if (row.chargeUser){
               $("#chargeUser").html(row.chargeUser.username);
               row["oldSeller.id"]=row.chargeUser.id;
            }
            //回显方法
            transfer_form.form("load", row);

            transfer_dialog.dialog("open");
        },
        //客户移交确定
        ok: function () {
            transfer_form.form("submit",{
                url:'/transfer/trans.do',

                success:function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success){
                        $.messager.alert("温馨提示",data.message,'info',function () {
                            //重新加载数据表格
                            customer_datagrid.datagrid("load");
                            //关闭弹出窗
                            transfer_dialog.dialog("close");
                        });

                    } else {
                        $.messager.alert('温馨提示',data.messager,'info');
                    }
                }
            })
        },

        //客户开发失败
        fail:function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }

            if (!row.chargeUser){
                $.messager.alert('温馨提示','都还没开发呢,怎么会失败?天道酬勤,请继续努力!','info');
                return;
            }
            $.messager.confirm("温馨提示", "确定要将客户 : "+"<span style='color: red'>"+row.name+"</span>"+" 设置为开发失败吗?",function (r) {
                if(r){
                    //清空表单数据
                    fail_form.form("clear");
                    //负责人姓名
                    $("#nowname").html(row.chargeUser.username);
                    //取到客户id,负责人id
                    row["customer.id"]=row.id;
                    row["chargeUser.id"]=row.chargeUser.id;

                    //回显方法
                    fail_form.form("load", row);

                    fail_dialog.dialog("open");
                }
            })
        },
        //客户开发失败确定
        failok: function () {
            fail_form.form("submit",{
                url:'/fail/fail.do',

                success:function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success){
                        $.messager.alert("温馨提示",data.message,'info',function () {
                            //重新加载数据表格
                            customer_datagrid.datagrid("load");
                            //关闭弹出窗
                            fail_dialog.dialog("close");
                        });
                    } else {
                        $.messager.alert('温馨提示',data.messager,'info');
                    }
                }
            })
        },
        //客户流失按钮
        lost:function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }

            $.messager.confirm("温馨提示", "确定要将客户 : "+"<span style='color: red'>"+row.name+"</span>"+" 设置为客户流失吗?",function (r) {
                if(r){
                    //清空表单数据
                    lost_form.form("clear");
                    //取到客户id,
                    row["customer.id"]=row.id;
                    if (row.chargeUser){
                        //负责人姓名
                        $("#nowname_lost").html(row.chargeUser.username);
                        //负责人id
                        row["chargeUser.id"]=row.chargeUser.id;
                    }

                    //回显方法
                    lost_form.form("load", row);

                    lost_dialog.dialog("open");
                }
            })
        },
        //客户流失表单提交
        failok: function () {
            lost_form.form("submit",{
                url:'/lost/lost.do',

                success:function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success){
                        $.messager.alert("温馨提示",data.message,'info',function () {
                            //重新加载数据表格
                            customer_datagrid.datagrid("load");
                            //关闭弹出窗
                            fail_dialog.dialog("close");
                        });
                    } else {
                        $.messager.alert('温馨提示',data.messager,'info');
                    }
                }
            })
        },
        share:function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }
            $.messager.confirm("温馨提示", "确定要将客户 : "+"<span style='color: red'>"+row.name+"</span>"+" 移入客户资源池吗?",function (r) {
                if (r){
                    //移入资源池:
                    $.get("/customer/share.do",{id:row.id},function (data) {
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
                    })
                }
            } )
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
                            customer_datagrid.datagrid("reload");
                            //关闭弹出框
                            customer_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },

        reload:function () {
            customer_datagrid.datagrid("reload");
        }
    }

    //统一绑定点击事件
    $("a[data-cmd]").click(function () {
        var methodName = $(this).data("cmd");
        methodObj[methodName]();
    })


    //初始化数据表格
    customer_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#customer_toolbar',
        url:"/customer/list.do?status=1",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'inputDate',title:'创建日期',width:100},

            {field:'inputUser',title:'创建人',width:60,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'chargeUser',title:'负责人',width:60,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'name',title:'客户姓名',width:70},
            {field:'age',title:'年龄',width:35},
            {field:'gender',title:'性别',width:35,formatter:function (value, row, index) {
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
            {field:'job',title:'职业',width:100},
            {field:'salaryLevel',title:'薪资水平',width:100},
            {field:'tel',title:'电话',width:100},
            {field:'email',title:'邮箱',width:100},
            {field:'address',title:'客户地址',width:100},
            {field:'source',title:'客户来源',width:100},
            {field:'qq',title:'QQ',width:80},
            {field:'wechat',title:'微信',width:100},
            {field:'idNo',title:'身份证号',width:100},

        ]],
    })

    //初始化弹出框
    customer_dialog.dialog({
        width: 270,
        height: 530,
        buttons: '#customer_btns',
        closed: true
    })
    //初始化弹出框
    transfer_dialog.dialog({
        title:'客户移交',
        width: 280,
        height: 380,
        buttons:'#transfer_btns',
        closed: true
    })
    //初始化弹出框
    fail_dialog.dialog({
        title:'设置开发失败',
        width: 280,
        height: 280,
        buttons:'#fail_btns',
        closed: true
    })
    //初始化弹出框
    lost_dialog.dialog({
        title:'设置客户流失',
        width: 280,
        height: 280,
        buttons:'#lost_btns',
        closed: true
    })

    //初始化dialog
    choose_dialog.dialog({
        title:'请选择创建人',
        width : 660,
        height : 390,
        // 底部按钮
        buttons : "#choose_btns",
        closed : true,
        modal:true,
    });

})

function mysearch() {
    var idNo = $("input[name=idNo]").val();
    var chargeUser_name = $("input[name=chargeUser_name]").val();
    var tel = $("input[name=tel]").val();
    var beginDate = $("input[name=beginDate]").val();
    var endDate = $("input[name=endDate]").val();
    var keyword = $("input[name=keyword]").val();

    $("#customer_datagrid").datagrid("load",{
        keyword:keyword,
        chargeUser_name:chargeUser_name,
        tel:tel,
        idNo:idNo,
        beginDate:beginDate,
        endDate:endDate,
    })
}