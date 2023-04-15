package org.example.demo.utils;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import cn.hutool.core.date.DateUtil;
import lombok.extern.log4j.Log4j2;


/**
 * @author huangyu@ivinsight.com
 * @Copyright: Copyright (c) 2022
 * @Description:
 * @Company: 智谷星图
 * @Created on 2022-03-22 15:06:55
 */
@Log4j2
public class DateTimeUtil {
    
    /**
     * TODO
     * 获取当前时间戳
     * @return java.math.BigInteger
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public static BigInteger getTimestampNow(){
        return BigInteger.valueOf(DateUtil.current());
    }

    /**
     * TODO
     * Timestamp 转 date字符串
     * @return java.lang.String
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public static String parseTimestampToDateStr(BigInteger timestamp){
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(timestamp.longValue());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String formatStr =formatter.format(calendar.getTime());
            return formatStr;
        }catch (Exception e){
            log.error(e.getMessage());
            return null;
        }

    }
}