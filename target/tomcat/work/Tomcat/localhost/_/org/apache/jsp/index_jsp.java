/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.47
 * Generated at: 2017-12-17 10:54:59 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class index_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("<html lang=\"en\">\r\n");
      out.write("<head>\r\n");
      out.write("    <meta charset=\"UTF-8\">\r\n");
      out.write("    <title>主页</title>\r\n");
      out.write("    <!-- 主题 -->\r\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/jquery/jquery-easyui/themes/default/easyui.css\">\r\n");
      out.write("    <!-- 图片插件 -->\r\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/jquery/jquery-easyui/themes/icon.css\">\r\n");
      out.write("    <!-- jQuery -->\r\n");
      out.write("    <script type=\"text/javascript\" src=\"/static/jquery/jquery-easyui/jquery.min.js\"></script>\r\n");
      out.write("    <!-- easyui -->\r\n");
      out.write("    <script type=\"text/javascript\" src=\"/static/jquery/jquery-easyui/jquery.easyui.min.js\"></script>\r\n");
      out.write("    <!-- 使用分页时,引入国家化库,时期便为中文; -->\r\n");
      out.write("    <script type=\"text/javascript\" src=\"/static/jquery/jquery-easyui/locale/easyui-lang-zh_CN.js\"></script>\r\n");
      out.write("\r\n");
      out.write("    <!-- 引用自己的js -->\r\n");
      out.write("    <script type=\"text/javascript\" src=\"/static/js/index.js\"></script>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("<div id=\"btn_layout\" class=\"easyui-layout\" data-options='fit:true' >\r\n");
      out.write("    <div data-options=\"region:'north',height:70\">\r\n");
      out.write("        <h1 style=\"text-align: center\">员工管理系统</h1>\r\n");
      out.write("    </div>\r\n");
      out.write("    <div data-options=\"region:'south',height:50\">\r\n");
      out.write("        <h4 style=\"text-align: center\">版权信息 ： 欒先聖</h4>\r\n");
      out.write("    </div>\r\n");
      out.write("\r\n");
      out.write("    <div data-options=\"region:'west',title:'菜单',width:150\">\r\n");
      out.write("        <!-- 使用手风琴的样式: -->\r\n");
      out.write("        <div class=\"easyui-accordion\" data-options=\"fit:true\">\r\n");
      out.write("            <div title=\"系统管理\">\r\n");
      out.write("                <!-- 菜单列表 -->\r\n");
      out.write("                <ul id=\"menu\"></ul>\r\n");
      out.write("            </div>\r\n");
      out.write("            <div title=\"模块管理\">2</div>\r\n");
      out.write("            <div title=\"其他\">3</div>\r\n");
      out.write("        </div>\r\n");
      out.write("    </div>\r\n");
      out.write("\r\n");
      out.write("    <div data-options=\"region:'center'\" style=\"padding:5px;background:#eee;\">\r\n");
      out.write("        <!-- 选项卡: -->\r\n");
      out.write("        <div id=\"tabs\" class=\"easyui-tabs\" data-options=\"fit:true\">\r\n");
      out.write("            <div title=\"Tab1\" style=\"padding:20px;display:none;\">\r\n");
      out.write("                tab1\r\n");
      out.write("            </div>\r\n");
      out.write("        </div>\r\n");
      out.write("\r\n");
      out.write("    </div>\r\n");
      out.write("</div>\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
