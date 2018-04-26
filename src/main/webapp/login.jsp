<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>狼码客户关系管理系统</title>
<link rel="stylesheet" href="/static/css/style.css">
<script type="text/javascript" src="/static/jquery/jquery-easyui/jquery.min.js"></script>
<script>
    function login() {
        $.post("/login.do",$("form").serialize(),function (data) {
            var data = JSON.parse(data);
           if(data.success){
                window.parent.location.href="/index.jsp"
            }else{
                alert(data.errorMge);
            }
        })
    }
</script>
</head>
<body>
  <section class="container">
    <div class="login">
      <h1>用户登录</h1>
      <form method="post">
        <p><input type="text" name="username" value="admin" placeholder="账号"></p>
        <p><input type="password" name="password" value="1" placeholder="密码"></p>
        <p class="submit">
        	<input type="button" value="登录" onclick="login()">
        	<input type="button" value="重置">
        </p>
      </form>
    </div>
  </section>
<div style="text-align:center;" class="login-help">
	<p>Copyright ©2017 狼码教育科技有限公司</p>
</div>
</html>