$(function () {

    //抽取变量
    var role_form = $("#role_form");
    var role_dialog = $("#role_dialog");
    var role_datagrid = $("#role_datagrid");

    //定义一个存储allPermission,初始化发送请求查询出所有数据的全局变量
    var allpermissions;


    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {
        add: function () {

            role_form.form("clear");

            //重新初始化所有权限数据
            $("#allPermissions").datagrid("loadData", allpermissions);

            //清空已有权限
            $("#selfPermissions").datagrid("loadData", []);


            role_dialog.dialog("setTitle", "角色新增");
            role_dialog.dialog("open");
        },
        edit: function () {

            //获取选中的角色记录
            var role = role_datagrid.datagrid("getSelected");

            if (!role) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            //重新初始化所有权限数据
            //$("#allPermissions").datagrid("load"); //这里使用异步请求发送会有问题,如果响应比较慢,先执行下面的又比较快,就会出现左边所有的权限部分重复的无法被删除的问题
            //解决方式,1)使用ajax发送同步请求,完全响应后再执行后面的代码,或者异步发送,将下面的代码发放到响应的回调函数中处理,但是需要调用datagrid的localData方法手动设置响应回来的数据
            /*$.ajax({
             url:"/permission/listAll.do",
             async:false,//发送同步请求
             success:function (data) {
             $("#allPermissions").datagrid("loadData",data);
             }
             });*/


            //2)一开始就将所有的permission查询出来放到一个全局变量中,这里就不再发送请求,直接用localdata数据设置本地数据即可
            $("#allPermissions").datagrid("loadData", allpermissions);

            //清空已有权限,因为后面由重新发送load加载数据了,所以这里就没有比要先清空数据了
            //$("#selfPermissions").datagrid("loadData", []);

            //回显已有的权限数据
            $("#selfPermissions").datagrid("options").url = "/permission/queryPermissionsByRoleId.do?roleId=" + role.id;
            $("#selfPermissions").datagrid("load");

            role_form.form("clear");
            role_dialog.dialog("setTitle", "角色编辑");

            role_form.form("load", role);

            role_dialog.dialog("open");
        },
        save: function () {
            role_form.form("submit", {
                url: "/role/saveOrUpdate.do",
                onSubmit: function (param) {
                    //获取已选中的权限列表中的所有权限的id值
                    var selfRows = $("#selfPermissions").datagrid("getRows");
                    var ids = $.map(selfRows, function (item, index) {
                        return item.id;
                    });
                    //遍历数组,将每一个id值设置给一个permissions中每一个permission的id
                    /*$.each(ids, function (index, item) {
                     param["permissions[" + index + "].id"] = item;
                     //此时发送请求后台SpringMVC框架会自动的封装数据到对应属性名的集合中的每一个元素的id上
                     });*/

                    //传参方式二: 对应方法上添加一个pIds集合,后台使用批量往mysql数据库中添加数据的方法
                    param["pIds"] = ids;

                    //设置了onSubmit属性,就必须手动调用表格的validate方法才会起到验证作用
                    return $("#role_form").form("validate");
                },
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            role_dialog.dialog("close");
                            role_datagrid.datagrid("load");
                        })
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        reload: function () {
            role_datagrid.datagrid("load");
        },
        cancel: function () {
            role_dialog.dialog("close");
        },
        remove: function () {
            //先判断是否有选中行,没有的话就给出提示
            var role = role_datagrid.datagrid("getSelected");

            if (!role) {
                $.messager.alert("温馨提示", "请选中一条记录", "info");
                return;
            }

            $.messager.confirm("温馨提示", "您确定要删除该角色么?", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/role/delete.do?roleId=" + role.id, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                console.log("1");
                                role_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        right: function () {
            //权限多选右移
            var selected = $("#allPermissions").datagrid("getSelections");

            for (var i = selected.length - 1; i >= 0; i--) {
                //追加
                $("#selfPermissions").datagrid("appendRow", selected[i]);
                //获取选中行的rowIndex
                var index = $("#allPermissions").datagrid("getRowIndex", selected[i]);
                //删除选中行
                $("#allPermissions").datagrid("deleteRow", index);
            }


        },
        left: function () {
            //权限多选左移
            var selected = $("#selfPermissions").datagrid("getSelections");
            for (var i = selected.length - 1; i >= 0; i--) {
                //追加
                $("#allPermissions").datagrid("appendRow", selected[i]);
                //获取当前选中行在datagrid中的索引位置
                var index = $("#selfPermissions").datagrid("getRowIndex", selected[i]);
                //删除选中行
                $("#selfPermissions").datagrid("deleteRow", index);
            }

        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });

    //初始化页面列表的datagrid
    role_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/role/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#role_toolbar",
        columns: [[
            {field: 'sn', title: '角色编号', width: 100, align: 'center'},
            {field: 'name', title: '角色名称', width: 100, align: 'center'},
        ]]
    });

    //初始化dialog
    role_dialog.dialog({
        width: 600,
        height: 550,
        buttons: "#role_btns",
        closed: true
    });

    //初始化allpermissions的datagrid
    $("#allPermissions").datagrid({
        width: 260,
        height: 370,
        rownumbers: true,
        title: "所有权限",
        url: "/permission/listAll.do",
        singleSelect: false,
        striped: true,
        fitColumns: true,
        columns: [[
            {field: 'name', title: "权限名称", width: 100, align: "center"}
        ]],
        onDblClickRow: function (index, row) {
            /*//方式一:先判断选中的行右边是否已经存在,如果已经存在,就选中对应行,否则才新增
             var selfRows = $("#selfPermissions").datagrid("getRows");
             //取出所有的已有权限的id,组成集合
             var ids = $.map(selfRows,function (item,index) {
             return item.id;
             });

             //判断当前选中行的id是否存在于已有的中,如果存在,就选中已有权限中对应的行
             if ($.inArray(row.id,ids) != -1) {
             //这里特别注意,指定要选中行的id的时候,应该是当前id对应在数组中的索引,也就是判断返回的索引,才是真正应该选中的行在所在的索引
             $("#selfPermissions").datagrid("selectRow",$.inArray(row.id,ids));
             return;
             }*/

            //将选中的行添加到已有权限列表中
            $("#selfPermissions").datagrid("appendRow", row);
            //删除已选择过的
            $("#allPermissions").datagrid("deleteRow", index);
        },
        onLoadSuccess: function (data) {
            //console.log(data);
            allpermissions = $.map(data.rows, function (item, index) {
                return item;
            });
            //console.log(allpermissions);
        }
    });

    //初始化selfPermissions的datagrid
    $("#selfPermissions").datagrid({
        width: 250,
        height: 370,
        title: "已有权限",
        singleSelect: false,
        striped: true,
        fitColumns: true,
        columns: [[
            {field: 'name', title: "权限名称", width: 100, align: "center"}
        ]],
        onDblClickRow: function (index, row) {
            //将选中的行添加到所有权限列表中
            $("#allPermissions").datagrid("appendRow", row);
            //删除已选择过的
            $("#selfPermissions").datagrid("deleteRow", index);
        },
        onLoadSuccess: function (data) {
            //删除右边已经有的左边的所有权限数据(用全局变量存储查询数据的方法不能这么操作,因为这时每次编辑的时候就不会再重新加载所有权限的数据了)
            //var allRows = $("#allPermissions").datagrid("getRows");
            var allRows = allpermissions;
            //console.log(allRows);
            var ids = $.map(data.rows, function (item, index) {
                return item.id;
            });

            //正着删除会导致数据漏删的情况(补位情况,所以从后面往前删)
            /*for (var i = 0; i < allRows.length; i++) {
             var row = allRows[i];
             //console.log("--" + $.inArray(row.id, ids));
             if ($.inArray(row.id,ids) != -1) {
             $("#allPermissions").datagrid("deleteRow", i);
             //console.log(1)
             }
             }*/
            for (var i = allRows.length - 1; i >= 0; i--) {
                var row = allRows[i];
                //console.log("--" + $.inArray(row.id, ids));
                if ($.inArray(row.id, ids) != -1) {
                    $("#allPermissions").datagrid("deleteRow", i);
                    //console.log(1)
                }
            }
            /* console.log("-----------");
             console.log(allpermissions);
             console.log("-----------");*/
        }
    })

});



