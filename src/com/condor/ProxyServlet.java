package com.condor;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import util.SentRequestUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.*;
import java.sql.Connection;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Bens on 2015/9/13.
 */
@WebServlet(name = "ProxyServlet")
public class ProxyServlet extends HttpServlet {
    public static final String domain_name = "https://test-condor.azurewebsites.net/";
    private static Logger log = Logger.getLogger(ProxyServlet.class.getName());

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String api_name = (String) request.getParameter("url");
        log.debug("request url is : " + api_name);
        String param = (String) request.getParameter("param");
        log.debug("request param is :" + param);
        String body = (String) request.getParameter("body");
        log.debug("request body is :" + body);
        StringBuffer param_buffer = new StringBuffer(param);
        String ip_str = SentRequestUtil.getIp(request);
        log.debug("the request ip is :" + ip_str);
        Pattern p = Pattern.compile("<clientIP>");
        Matcher m = p.matcher(param_buffer.toString());
        if (m.find()) {
            param_buffer.insert((m.start() + 10), ip_str);
        }
        param = param_buffer.toString();
        log.debug("the param is : " + param);
        try {
            String url = domain_name + api_name;
            String result = SentRequestUtil.sendPOST(url, param, body);
            String ENCODE = "utf-8";
            response.setCharacterEncoding(ENCODE);
            log.debug("the result is : " + result);
            response.getWriter().write(result);
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        String api_name = (String) request.getParameter("url");
        String param = (String) request.getParameter("param");
        log.debug("request param is : " + param);
        StringBuffer param_buffer = new StringBuffer(param);
        String ip_str = SentRequestUtil.getIp(request);
        log.debug("the request ip is :" + ip_str);
        Pattern p = Pattern.compile("<clientIP>");
        Matcher m = p.matcher(param_buffer.toString());
        if (m.find()) {
            param_buffer.insert((m.start() + 10), ip_str);
        }
        param = param_buffer.toString();
        log.debug("the param is : " + param);
        try {
            String ENCODING = "utf-8";
            String url = domain_name+api_name;
            String result = SentRequestUtil.sendGET(url, param);
            response.setCharacterEncoding(ENCODING);
            log.debug("the result is : " + result);
            response.getWriter().write(result);
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(500);
        }

    }
}
