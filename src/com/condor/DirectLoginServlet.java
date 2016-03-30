package com.condor;

import util.DateUtil;
import util.SentRequestUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Bens on 2015/10/19.
 */
public class DirectLoginServlet extends HttpServlet {
    private static final String url = ProxyServlet.domain_name + "api/manage/checkDepartmentExistence";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String utcTimeStr = DateUtil.getUTCTimeStr();
        String uri = req.getRequestURI();
        String department_name = uri.substring(1, uri.length()).split("/")[1];
        if (department_name != null) {
            String parm = String.format("<request><timestamp>%s</timestamp><departmentName>%s</departmentName></request>", utcTimeStr, department_name);
            int result = Integer.parseInt(SentRequestUtil.sendGET(url, parm));
            System.out.println(result);
            if( result == 0) {
                String company_title = department_name.toUpperCase();
                req.setAttribute("department_name", department_name);
                req.setAttribute("department_title", company_title);
                req.getRequestDispatcher("/login.jsp").forward(req, resp);
            }else {
                req.getRequestDispatcher("/view/error/404.html").forward(req, resp);
            }
        }else {
            req.getRequestDispatcher("/view/error/404.html").forward(req, resp);
        }


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }

    public static void main(String[] args) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        System.out.println(sdf.format(new Date()));
    }

}
