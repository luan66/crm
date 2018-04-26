$(function () {
    //1.抽取变量
    var car_form = $("#car_form");
    var car_datagrid = $("#car_datagrid");
    var car_dialog = $("#car_dialog");
    //2.方法统一管理,使用一个对象去管理方法
    var methodObj = {
        add: function () {
            //清空表单数据
            car_form.form("clear");

            car_dialog.dialog("setTitle", "新增车辆");

            car_dialog.dialog("open");
        },
        edit: function () {

            var car = car_datagrid.datagrid("getSelected");

            if (!car) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }
            //清空数据
            car_form.form("clear");
            car_dialog.dialog("setTitle", "车辆编辑");

            if (car.customer) {
                car["customer.name"] = car.customer.name;
                car["customer.id"] = car.customer.id;
            }
            car_form.form("load", car);

            car_dialog.dialog("open");
        },
        cancel: function () {
            car_dialog.dialog("close");
        },

        save: function () {
            car_form.form("submit", {
                url: '/car/saveOrUpdate.do',
                success: function (data) {
                    //使用easyui的form提交,需要把data转成json对象
                    data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert('温馨提示', data.message, 'info', function () {
                            //重新加载数据表格
                            car_datagrid.datagrid("load");
                            //关闭弹出框
                            car_dialog.dialog("close");

                        });
                    } else {
                        $.messager.alert('温馨提示', data.message, 'info');
                    }
                }
            })
        },
        reload:function () {
            car_datagrid.datagrid("reload");
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
    car_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        toolbar: '#car_toolbar',
        url:"/car/list.do",
        pagination: true,
        rownumbers:true,
        singleSelect: true,
        columns: [[
            {field: 'customer', title:'车主姓名', width: 100,
                formatter: function (value, row, index) {
                    return value ?value.name:'' }},
            {field: 'brand', title: '车辆品牌', width: 100},
            {field: 'model', title: '车辆型号', width: 100},
            {field: 'plateNumber', title: '车牌号码', width: 100},
            {field: 'gasDisplacement', title: '排气量/L', width: 50},
            {field: 'purchaseDate', title: '购买日期', width: 100},
            {field: 'valuation', title: '市场估价/万元', width: 50},
            {field: 'category', title: '分类', width: 50,
                formatter: function (value, row, index) {
                    return value ? "<font color='blue'>载客</font>" : "<font color='red'>载物</font>"
                }
            },
            {field: 'size', title: '车载大小', width: 50,
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
            {field: 'remarks', title: '备注信息', width: 200}
        ]]
    })

    //初始化弹出框 使用的是dialog
    car_dialog.dialog({
        width: 300,
        height: 350,
        buttons: '#car_btns',
        closed: true,

    })
})
function search(value) {
    //获取状态的参数

    $("#car_datagrid").datagrid("load", {
        keyword: value,
    });

}