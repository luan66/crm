$(function () {

    $("#myTree").tree({
        url: "/menu/getRootMenu.do",
        onClick: function (node) { //点击节点的时候绑定点击事件增加选项卡面板,node包含当前点击的节点对象的相关信息
            if (!node.url) {
                return;
            }
            //判断对应节点文本内容的选项卡面板是否已存在,如果已存在就选中,不存在则新增
            if ($("#myTabs").tabs("exists", node.text)) {
                //console.debug(node);
                $("#myTabs").tabs("select", node.text);
                return;
            }
            $("#myTabs").tabs("add", {
                title: node.text,
                closable: true,
                //href:node.attributes.url //href是发送异步请求加载对应的内容,但是href属性只会加载对应url的body中的数据到tab中,可能会造成一些异常,所以如果要加载,最好使用content然后使用iframe的src属性来加载
                content: '<iframe src="' + node.url + '" width="100%" height="100%" frameborder=0></iframe>' //<iframe>标签会等对应的url所指向的页面完全渲染完毕后再去加载到自己本身中,所以不需要担心出现加载或者渲染不完全的情况
            })
        }
    });
    $("#myTabs").tabs({
        fit: true,
        border: false
    });
    //初始化弹出框
    $("#emp_dialog").dialog({
        width: 330,
        height: 330,
        buttons: "#emp_btn",
        closed: true,
        modal: true
    }); 
});

function onduty() {
    $.messager.confirm("确认窗口", "亲，确定要上班吗？", function (r) {
        if (r) {
            $.get("/attendance/getAll.do", function (data) {
                if (data.success) {
                    $.messager.alert("温馨提示", data.message, "info");
                    $("#sigin").attr("disabled", true);
                    $("#sigout").attr("disabled", false);
                } else {
                    $.messager.alert("温馨提示", data.message, "info");
                }
            })
        }
    })
}
function offduty() {
    $.messager.confirm("确认窗口", "亲，确定要下班吗？", function (r) {
        if (r) {
            $.get("/attendance/updateAll.do", function (data) {
                if (data.success) {
                    $.messager.alert("温馨提示", data.message, "info");
                    $("#sigin").attr("disabled", false);
                    $("#sigout").attr("disabled", true)
                } else {
                    $.messager.alert("温馨提示", data.message, "info");
                }
            })
        }
    })
}

function importSql() {
    $("#fileE").trigger("click");

}

function getFilePath() {
    console.log($("#fileE"));
    $("#iform").form("submit",{
        success: function (data) {
            var data = $.parseJSON(data);
            if (data.success) {
                $.messager.alert("温馨提示", data.message, "info", function () {
                    console.log(123);
                });
            } else {
                $.messager.alert("温馨提示", data.message, "info");
            }
        }
    });
}

function exportSql() {
    window.location.href = "/backups/export.do";
}

//修改资料
 function edit() {
    $("#emp_password").hide();


    if (!employee) {
        $.messager.alert('温馨提示', '请选中一条记录！', 'info');
        return;
    }

    $("#emp_form").form("clear");
    $("#emp_dialog").dialog("setTitle", "员工编辑");

    if (employee.department) {
        employee["department.id"] = employee.department.id;
    }
    
    $("#emp_form").form("load", employee);

    //进行角色的数据回显,无法通过同名匹配,因为查询出来的为多个对象,不能通过employee.roles.id来匹配,需要通过combobox的setValue向里面传入一个对应id的集合
    var empId = employee.id;
    $.ajax({
        url: "/employee/queryRelationsByEmpId.do",
        data: {id: empId},
        async: false,
        success: function (data) {
            $("#emp_roles").combobox("setValues", data);
        }
    });

    $("#emp_dialog").dialog("open");
}
function save() {
    $("#emp_form").form("submit", {
        url: "/employee/saveOrUpdate.do",
        onSubmit: function (param) {
            //注意这里获取combobox的多选值要用getValues,而不是用getValue,后者只能获取单个数据
            var ids = $("#emp_roles").combobox("getValues");
            //设置参数传递到后台的集合中
            $.each(ids, function (index, item) {
                // console.log(item);
                param["roles[" + index + "].id"] = item;
            });
            console.log(param);
        },
        success: function (data) {
            var data = $.parseJSON(data);
            if (data.success) {
                $.messager.alert("温馨提示", data.message, "info", function () {
                    $("#emp_dialog").dialog("close");
                });
            } else {
                $.messager.alert("温馨提示", data.message, "info");
            }
        }
    })
}
function cancel() {
    $("#emp_dialog").dialog("close");
}

function cad() {
    $.messager.alert("温馨提示", '请去员工页面修改信息', "info");
}