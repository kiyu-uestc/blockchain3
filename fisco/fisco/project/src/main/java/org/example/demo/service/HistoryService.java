package org.example.demo.service;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.model.Result;
import org.example.demo.model.bo.BankBO;
import org.example.demo.utils.DateTimeUtil;
import org.example.demo.utils.WeBASEUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @author huangyu@ivinsight.com
 * @Copyright: Copyright (c) 2022
 * @Description:
 * @Company: 智谷星图
 * @Created on 2022-03-22 12:58:38
 */

@Service
@NoArgsConstructor
@Data
public class HistoryService {

    @Autowired
    WeBASEUtil weBASEUtil;

    /**
     * 获取KYC变更历史信息
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result getAllKycHistories(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getUuid());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"getAllKycHistories",funcParam);

        JSONArray _resultJson = JSONUtil.parseArray(_result);
        if (_resultJson.getStr(0).contains("error")){
            return Result.fail(1,_resultJson.getStr(0));
        }
        JSONArray _resultArray = new JSONArray();
        for (int i=0;i<_resultJson.getJSONArray(0).size();i++){
            JSONObject _object = new JSONObject();
            _object.set("uuid",_resultJson.getJSONArray(0).getStr(i));
            _object.set("hash",_resultJson.getJSONArray(1).getStr(i));
            _object.set("bankAddr",_resultJson.getJSONArray(2).getStr(i));
            _object.set("createdTime", DateTimeUtil.parseTimestampToDateStr(_resultJson.getJSONArray(3).getBigInteger(i)));
            _resultArray.put(_object);

        }
        return Result.ok(_resultArray.toString());
    }
}
