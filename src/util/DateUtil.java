package util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * Created by Bens on 2015/10/20.
 */
public class DateUtil {

    private static DateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'") ;

    /**
     * 得到UTC时间，类型为字符串，格式为"yyyy-MM-dd'T'HH:mm:ss'Z'"<br />
     * 如果获取失败，返回null
     * @return
     */
    public static String getUTCTimeStr() {
        StringBuffer UTCTimeBuffer = new StringBuffer();
        // 1、取得本地时间：
        Calendar cal = Calendar.getInstance() ;
        // 2、取得时间偏移量：
        int zoneOffset = cal.get(java.util.Calendar.ZONE_OFFSET);
        // 3、取得夏令时差：
        int dstOffset = cal.get(java.util.Calendar.DST_OFFSET);
        // 4、从本地时间里扣除这些差量，即可以取得UTC时间：
        cal.add(java.util.Calendar.MILLISECOND, -(zoneOffset + dstOffset));
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH)+1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        int minute = cal.get(Calendar.MINUTE);
        int second = cal.get(Calendar.SECOND);
        String s_day = Integer.toString(day);
        String s_month = Integer.toString(month);
        String s_hour = Integer.toString(hour);
        String s_minute = Integer.toString(minute);
        String s_second = Integer.toString(second);

        if (day < 10) {
            s_day = "0" + s_day;
        }
        if (month < 10) {
            s_month = "0" + s_month;
        }
        if (hour < 10) {
            s_hour = "0" + s_hour;
        }

        if (minute < 10) {
            s_minute = "0" + s_minute;
        }

        if (second < 10) {
            s_second = "0" + s_second;
        }
        UTCTimeBuffer.append(year).append("-").append(s_month).append("-").append(s_day) ;
        UTCTimeBuffer.append("T").append(s_hour).append(":").append(s_minute).append(":").append(s_second).append("Z") ;
        try{
            format.parse(UTCTimeBuffer.toString()) ;
            return UTCTimeBuffer.toString() ;
        }catch(ParseException e)
        {
            e.printStackTrace() ;
        }
        return null ;
    }

    public static void main(String[] args) {
        System.out.println(getUTCTimeStr());
    }
}
