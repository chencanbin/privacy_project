package util;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.*;
import java.util.List;
import java.util.Map;

/**
 * Created by Bens on 2015/10/19.
 */
public class SentRequestUtil {
    private static Logger log = Logger.getLogger(SentRequestUtil.class.getName());
    /**
     * send GET request to server
     * @param url
     * @param param
     * @return
     * @throws IOException
     */
    public static String sendGET(String url, String param) throws IOException {
        String result = "";
        StringBuffer param_buffer = new StringBuffer(param);//原字符串
        BufferedReader in = null;
        String ENCODING = "utf-8";
        String encodingParam = URLEncoder.encode(param, ENCODING);
        String urlNameString = url + "?req=" + encodingParam;
        log.debug("the encoding url is :" + urlNameString);
        URL realUrl = new URL(urlNameString);
        URLConnection connection = realUrl.openConnection();
        connection.setRequestProperty("accept", "*/*");
        connection.setRequestProperty("connection", "Keep-Alive");
        connection.connect();
        Map<String, List<String>> map = connection.getHeaderFields();
        for (String key : map.keySet()) {
            log.debug(key + "--->" + map.get(key));
        }
        in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
        String line;
        while ((line = in.readLine()) != null) {
            log.debug(line);
            result += line;
        }
        try {
            if (in != null) {
                in.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * send post request to server
     * @param url
     * @param param
     * @return
     * @throws IOException
     */
    public static String sendPOST(String url, String param,String body) throws IOException {
        String result = "";
        OutputStreamWriter out = null;
        BufferedReader in = null;
        String ENCODING = "utf-8";
        String encodingParam = URLEncoder.encode(param, ENCODING);
        String urlNameString = url + "?req=" + encodingParam;
        log.debug("the encoding url is :" + urlNameString);
        URL realUrl = new URL(urlNameString);
        log.debug("realUrl ................." + realUrl.getHost());
        URLConnection conn = realUrl.openConnection();
        conn.setRequestProperty("accept", "*/*");
        conn.setRequestProperty("connection", "Keep-Alive");
        conn.setRequestProperty("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
        conn.setRequestProperty("content-type", "application/x-www-form-urlencoded");
        conn.setDoOutput(true);
        conn.setDoInput(true);
        out = new OutputStreamWriter(conn.getOutputStream());
        out.write(body);
        out.flush();
        in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        while ((line = in.readLine()) != null) {
            result += line;
        }
        log.debug("the response result is : ===================" + result);
        try {
            if (out != null) {
                out.close();
            }
            if (in != null) {
                in.close();
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return result;
    }

    /**
     * get IP
     * @param request
     * @return
     */
    public static String getIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("x-forwarded-for");
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (ipAddress.equals("127.0.0.1") || ipAddress.equals("0:0:0:0:0:0:0:1")) {
                //根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ipAddress = inet.getHostAddress();
            }
        }
        //对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ipAddress != null && ipAddress.length() > 15) { //"***.***.***.***".length() = 15
            if (ipAddress.indexOf(",") > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
            }
        }
        return ipAddress;
    }
}
