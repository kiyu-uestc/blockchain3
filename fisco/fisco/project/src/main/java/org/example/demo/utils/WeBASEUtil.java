package org.example.demo.utils;

import cn.hutool.http.Header;
import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.*;

@Log4j2
@Service
public class WeBASEUtil {

    @Value("${project.webaseurl.base}")
    String webaseUrl;

    @Value("${project.contract.address}")
    String contractAddress;

    @Value("${project.contract.name}")
    String contractName;

    @Value("${project.admin-address}")
    String adminAddress;

    @Value("${project.contract.abi}")
    String abi;


    public static final Integer GROUP_ID = 1;

    public static final String URL_TRANS = "trans/handle";
    public static final String URL_DECODE = "tool/decode";

    /**
     * 其他用户调用post
     * @param userAddress
     * @param funcName
     * @param funcParam
     * @return 请求结果
     */
    public String funcPost(String userAddress, String funcName, List funcParam) {
        JSONArray abiJSON = JSONUtil.parseArray(abi);
        Map data = new HashMap<>();
        data.put("groupId", GROUP_ID);
        data.put("contractPath", "/");
        data.put("contractAbi", abiJSON);
        data.put("useAes", false);
        data.put("useCns", false);
        data.put("cnsName", "");
        data.put("version", "");
        data.put("user", userAddress);
        data.put("contractName", contractName);
        data.put("contractAddress", contractAddress);
        data.put("funcName", funcName);
        data.put("funcParam", funcParam);
        String dataString = JSONUtil.toJsonStr(data);

        return this.baseHttpClient(webaseUrl+URL_TRANS,dataString,"POST");
    }

    /**
     * main user 调用post
     * @return java.lang.String
     * @author huangyu@ivinsight.com
     * @date 2022/3/30
     */
    public String funcPost(String funcName, List funcParam) {
        JSONArray abiJSON = JSONUtil.parseArray(abi);
        Map data = new HashMap<>();
        data.put("groupId", GROUP_ID);
        data.put("contractPath", "/");
        data.put("contractAbi", abiJSON);
        data.put("useAes", false);
        data.put("useCns", false);
        data.put("cnsName", "");
        data.put("version", "");
        data.put("user", adminAddress);
        data.put("contractName", contractName);
        data.put("contractAddress", contractAddress);
        data.put("funcName", funcName);
        data.put("funcParam", funcParam);
        String dataString = JSONUtil.toJsonStr(data);

        return this.baseHttpClient(webaseUrl+URL_TRANS,dataString,"POST");
    }

    /**
     * 基础http方法
     * @return java.lang.String
     * @author huangyu@ivinsight.com
     * @date 2022/3/30
     */
    public String baseHttpClient(String url, String bodyMap, String type) {
        log.info("url:{}",url);
        log.info("body:{}",bodyMap);
        String resultJson;
        switch(type)
        {
            case "GET" :
                resultJson = HttpRequest.get(url)
                        .header(Header.CONTENT_TYPE, "application/json;charset=UTF-8")
                        .body(bodyMap)
                        .execute().body();
                break;
            case "DELETE" :
                resultJson = HttpRequest.delete(url)
                        .header(Header.CONTENT_TYPE, "application/json;charset=UTF-8")
                        .body(bodyMap)
                        .execute().body();
                break;
            case "PUT" :
                resultJson = HttpRequest.put(url)
                        .header(Header.CONTENT_TYPE, "application/json;charset=UTF-8")
                        .body(bodyMap)
                        .execute().body();
                break;
            default :
                resultJson = HttpRequest.post(url)
                        .header(Header.CONTENT_TYPE, "application/json;charset=UTF-8")
                        .body(bodyMap)
                        .execute().body();
        }

        log.info("http response:{}",resultJson);
        return resultJson;
    }

}
