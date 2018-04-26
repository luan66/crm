$(function () {
    //1.抽取变量
    var customer_form = $("#customer_form");
    var customer_datagrid = $("#customer_datagrid");
    var customer_dialog = $("#customer_dialog");

    //2.方法统一管理,使用一个对象去管理方法

    var methodObj = {
        //吸纳
        join: function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }

            $.messager.confirm("温馨提示", "您确定要开发客户 : "+"<span style='color: red'>"+row.name+"</span>"+" 吗?",function (r) {
                if (r) {
                    // 发送请求
                    $.get("/customer/join.do", {id: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.message, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                customer_datagrid.datagrid("reload");
                                //关闭弹出框
                                customer_dialog.dialog("close");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.message, 'info');
                        }
                    })
                }
            });
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

        changeState: function () {
            //判断选中数据
            var row = customer_datagrid.datagrid("getSelected");
            if (!row) {
                $.messager.alert('温馨提示', '请选中一条数据！', 'info');
                return;
            }

            $.messager.confirm('温馨提示', '确认该员工设置为离职吗？', function (r) {
                if (r) {
                    // 发送请求
                    $.get("/customer/changeState.do", {id: row.id}, function (data) {
                        if (data.success) {
                            $.messager.alert('温馨提示', data.message, 'info', function () {
                                //重新加载数据表格(保持在当前页)
                                customer_datagrid.datagrid("reload");
                                //关闭弹出框
                                customer_dialog.dialog("close");
                            });
                        } else {
                            $.messager.alert('温馨提示', data.message, 'info');
                        }
                    })
                }
            });
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
        url:"/customer/list.do?statusKey=0",
        pagination: true,
        singleSelect: true,
        rownumbers:true,
        columns: [[
            {field:'status',title:'客户状态',width:70,formatter:function (value, row, index) {
                if (value == -2){
                    return '流失';
                };
                if (value == -1){
                    return '开发失败';
                };
                if (value == 0){
                    return '资源池客户';
                };
                if (value == 1){
                    return '潜在客户';
                };
                if (value == 2){
                    return '正式客户';
                };
            }},
            {field:'inputDate',title:'创建日期',width:100},

            {field:'inputUser',title:'创建人',width:60,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'chargeUser',title:'负责人',width:60,formatter:function (value,row,index) {
                return value ? value.username : '';
            }},
            {field:'name',title:'客户姓名',width:70},
            {field:'age',title:'年龄',width:50},
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
        height: 450,
        buttons: '#customer_btns',
        closed: true
    })
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