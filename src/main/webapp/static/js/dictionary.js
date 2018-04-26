$(function () {

    //抽取变量(目录)
    var dictionary_form = $("#dictionary_form");
    var dictionary_dialog = $("#dictionary_dialog");
    var dictionary_datagrid = $("#dictionary_datagrid");
    //抽取变量(明细)
    var dictionaryItem_form = $("#dictionaryItem_form");
    var dictionaryItem_dialog = $("#dictionaryItem_dialog");
    var dictionaryItem_datagrid = $("#dictionaryItem_datagrid");

    //所有a标签的方法都交给methodObject对象来管理
    var methodObject = {

        //目录

        add: function () {
            dictionary_form.form("clear");
            dictionary_dialog.dialog("setTitle", "数据字典目录新增");
            dictionary_dialog.dialog("open");
        },
        edit: function () {

            var row = dictionary_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            dictionary_form.form("clear");
            dictionary_dialog.dialog("setTitle", "数据字典目录编辑");

            dictionary_form.form("load", row);

            dictionary_dialog.dialog("open");
        },
        save: function () {
            dictionary_form.form("submit", {
                url: "/dictionary/saveOrUpdate.do",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            dictionary_dialog.dialog("close");
                            dictionary_datagrid.datagrid("reload");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        remove: function () {
            //先判断是否有选中行,没有的话就给出提示
            var row = dictionary_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选中一条记录", "info");
                return;
            }

            $.messager.confirm("温馨提示", "您确定要删除该目录吗?", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/dictionary/delete.do?id=" + row.id, function (data) {
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
        cancel: function () {
            dictionary_dialog.dialog("close");
        },
        reload: function () {
            dictionary_datagrid.datagrid("reload");
        },

        //明细

        addItem: function () {
            dictionaryItem_form.form("clear");
            dictionaryItem_dialog.dialog("setTitle", "数据字典明细新增");
            dictionaryItem_dialog.dialog("open");
        },
        editItem: function () {

            var row = dictionaryItem_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert('温馨提示', '请选中一条记录！', 'info');
                return;
            }

            dictionaryItem_form.form("clear");
            dictionaryItem_dialog.dialog("setTitle", "数据字典明细编辑");

            //回显目录
            if(row.dictionary){
                row["dictionary.id"] = row.dictionary.id;
            }

            dictionaryItem_form.form("load", row);

            dictionaryItem_dialog.dialog("open");
        },
        saveItem: function () {
            dictionaryItem_form.form("submit", {
                url: "/dictionaryItem/saveOrUpdate.do",
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.success) {
                        $.messager.alert("温馨提示", data.message, "info", function () {
                            dictionaryItem_dialog.dialog("close");
                            dictionaryItem_datagrid.datagrid("reload");
                        });
                    } else {
                        $.messager.alert("温馨提示", data.message, "info");
                    }
                }
            })
        },
        removeItem: function () {
            //先判断是否有选中行,没有的话就给出提示
            var row = dictionaryItem_datagrid.datagrid("getSelected");

            if (!row) {
                $.messager.alert("温馨提示", "请选中一条记录", "info");
                return;
            }

            $.messager.confirm("温馨提示", "您确定要删除该明细吗?", function (r) {
                if (r) {
                    //获取选中行的id
                    $.get("/dictionaryItem/delete.do?id=" + row.id, function (data) {
                        if (data.success) {
                            $.messager.alert("温馨提示", data.message, "info", function () {
                                dictionaryItem_datagrid.datagrid("reload");
                            });
                        } else {
                            $.messager.alert("温馨提示", data.message);
                        }
                    })
                }
            })
        },
        cancelItem: function () {
            dictionaryItem_dialog.dialog("close");
        },
        reloadItem: function () {
            dictionaryItem_datagrid.datagrid("reload");
        }
    };

    //所有a标签的点击事件对应的方法都交给methodObject对象来管理,调用的时候只需要获取对应的cmd质量,然后通过method对象来调用即可
    $("a[data-cmd]").click(function () {
        var cmd = $(this).data("cmd");
        methodObject[cmd]();
    });

    //初始化 目录datagrid
    dictionary_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/dictionary/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#dictionary_toolbar",
        rownumbers:true,
        columns: [[
            {field: 'sn', title: '目录编号', width: 180, align: 'center'},
            {field: 'name', title: '目录名称', width: 180, align: 'center'},
            {field: 'intro', title: '目录简介', width: 180, align: 'center'}
        ]],
        onSelect:function (index, row) {
            $("#dictionaryItem_datagrid").datagrid("load",{sn:row.sn})
        }
    });

    //初始化 目录dialog
    dictionary_dialog.dialog({
        width: 280,
        height: 200,
        buttons: "#dictionary_btns",
        closed: true
    });

    //初始化 明细datagrid
    dictionaryItem_datagrid.datagrid({
        fit: true,
        fitColumns: true,
        striped: true,
        url: "/dictionaryItem/list.do",
        pagination: true,
        singleSelect: true,
        toolbar: "#dictionaryItem_toolbar",
        rownumbers:true,
        columns: [[
            {field: 'name', title: '明细名称', width: 180, align: 'center'},
            {field: 'intro', title: '明细简介', width: 180, align: 'center'},
            {field: 'dictionary', title: '所属目录', width: 180, align: 'center',
                formatter: function (value, row, index) {
                    console.log(row);
                    return value ? value.name : "";
                }
            }
        ]]
    });

    //初始化 明细dialog
    dictionaryItem_dialog.dialog({
        width: 280,
        height: 200,
        buttons: "#dictionaryItem_btns",
        closed: true
    });

});



