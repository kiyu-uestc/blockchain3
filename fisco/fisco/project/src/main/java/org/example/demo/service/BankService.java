package org.example.demo.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSON;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.model.Result;
import org.example.demo.model.bo.BankBO;
import org.example.demo.model.bo.UserBO;
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
public class BankService {

    @Autowired
    WeBASEUtil weBASEUtil;

    /**
     * 获取所有客户列表
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result getAllCustomers(BankBO bo) {
        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"getAllCustomers",new ArrayList());

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
            _object.set("status",_resultJson.getJSONArray(3).getBool(i));
            _resultArray.put(_object);

        }
        return Result.ok(_resultArray.toString());
    }

    /**
     * 添加客户KYC
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result addCustomer(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(UUID.randomUUID());
        funcParam.add(bo.getCustName());
        funcParam.add(bo.getCustCountry());
        funcParam.add(bo.getCustSex());
        funcParam.add(bo.getCustId());
        funcParam.add(bo.getCustPhone());
        funcParam.add(bo.getAddr());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"addCustomer",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }
        return Result.ok(null);
    }

    /**
     * 查看客户KYC信息（仅限创建银行）
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result viewCustomerData(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getUuid());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"viewCustomerData",funcParam);
        JSONArray _resultJson = JSONUtil.parseArray(_result);

        if (_resultJson.getStr(0).contains("error")){
            return Result.fail(1,_resultJson.getStr(0));
        }

        JSONObject _object = new JSONObject();
        _object.set("name",_resultJson.getStr(0));
        _object.set("country",_resultJson.getStr(1));
        _object.set("sex",_resultJson.getStr(2));
        _object.set("id",_resultJson.getStr(3));
        _object.set("phone",_resultJson.getStr(4));
        _object.set("addr",_resultJson.getStr(5));
        return Result.ok(_object.toString());
    }

    /**
     * 修改客户信息
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result modifyCustomer(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getUuid());
        funcParam.add(bo.getCustName());
        funcParam.add(bo.getCustCountry());
        funcParam.add(bo.getCustSex());
        funcParam.add(bo.getCustId());
        funcParam.add(bo.getCustPhone());
        funcParam.add(bo.getAddr());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"modifyCustomer",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }

    /**
     * 更新客户状态
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result updateCustomerStatus(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getUuid());
        funcParam.add(bo.getStatus());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"updateCustomerStatus",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }

    /**
     * 根据客户HASH查询客户KYC信息
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result searchCustomerDataByHash(BankBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getHash());

        String _result = weBASEUtil.funcPost(bo.getUserAddress(),"searchCustomerDataByHash",funcParam);

        if (JSONUtil.isJsonObj(_result)) {
            JSONObject _obj = JSONUtil.parseObj(_result);
            if (_obj.getInt("code") > 0){
                return Result.fail(1,_obj.getStr("errorMessage"));
            }
        }

        JSONArray _resultJson = JSONUtil.parseArray(_result);
        if (_resultJson.getStr(0).contains("error")){
            return Result.fail(1,_resultJson.getStr(0));
        }

        JSONObject _object = new JSONObject();
        _object.set("name",_resultJson.getStr(0));
        _object.set("country",_resultJson.getStr(1));
        _object.set("sex",_resultJson.getStr(2));
        _object.set("id",_resultJson.getStr(3));
        _object.set("phone",_resultJson.getStr(4));
        _object.set("addr",_resultJson.getStr(5));
        return Result.ok(_object.toString());
    }

}
