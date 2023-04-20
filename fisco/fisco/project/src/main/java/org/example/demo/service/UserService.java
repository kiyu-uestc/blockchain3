package org.example.demo.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.model.Result;
import org.example.demo.model.bo.BankBO;
import org.example.demo.model.bo.LoginBO;
import org.example.demo.model.bo.UserBO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.demo.utils.WeBASEUtil;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
public class UserService {

    @Autowired
    WeBASEUtil weBASEUtil;


    /**
     * TODO
     * 登录
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result login(@RequestBody LoginBO loginBO) {
        if (StrUtil.isEmpty(loginBO.getAddress())) {
            return Result.fail(1,"登录信息有误，请重试"); 
        }

        List funcParam = new ArrayList();  
        funcParam.add(loginBO.getAddress());

        String _result = weBASEUtil.funcPost("getBank",funcParam);
        JSONArray _resultJson = JSONUtil.parseArray(_result);
        
        if (_resultJson.getStr(0).contains("error")){
            return Result.fail(1,_resultJson.getStr(0));
        }

        if (StrUtil.isEmpty(_resultJson.get(0).toString())){
            return Result.fail(1,"登录失败，请重试");
        }
        return Result.ok(_resultJson);
    }

    /**
     * 获取所有银行
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result getAllBanks() {
        String _result = weBASEUtil.funcPost("getAllBanks",new ArrayList());
        JSONArray _resultJson = new JSONArray();
        if (JSONUtil.isJsonObj(_result)){
            JSONObject _obj = JSONUtil.parseObj(_result);
            if (_obj.getInt("code") > 0){
                return Result.fail(1,_obj.getStr("errorMessage"));
            }
        }else{
            _resultJson = JSONUtil.parseArray(_result);
            if (StrUtil.isEmpty(_resultJson.get(0).toString())){
                return Result.fail(1,"获取内容失败，请重试");
            }
        }

        JSONArray _resultArray = new JSONArray();
        for (int i=0;i<_resultJson.getJSONArray(0).size();i++){
            JSONObject _object = new JSONObject();
            _object.set("name",_resultJson.getJSONArray(0).getStr(i));
            _object.set("address",_resultJson.getJSONArray(1).getStr(i));
            _object.set("addCustPrivilege",_resultJson.getJSONArray(2).getBool(i));
            _object.set("kycPrivilege",_resultJson.getJSONArray(3).getBool(i));
            _object.set("status",_resultJson.getJSONArray(4).getBool(i));
            _resultArray.put(_object);

        }
        return Result.ok(_resultArray.toString());
    }

    /**
     * 添加银行
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result addBank(UserBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getName());
        funcParam.add(bo.getBankAddress());
        funcParam.add(bo.getAddCustomerPrivilege());
        funcParam.add(bo.getKycPrivilege());

        String _result = weBASEUtil.funcPost("addBank",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }

    /**
     * 更新银行状态
     * @param bo
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result updateBankStatus(UserBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getBankAddress());
        funcParam.add(bo.getStatus());

        String _result = weBASEUtil.funcPost("updateBankStatus",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }

    /**
     * 检查银行信息（用于登录）
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result getBank(UserBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getBankAddress());

        String _result = weBASEUtil.funcPost("getBank",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }

    /**
     * 修改银行信息
     * @return org.example.demo.model.Result
     * @author huangyu@ivinsight.com
     * @date 2022/4/6
     */
    public Result modifyBank(UserBO bo) {
        List funcParam = new ArrayList();
        funcParam.add(bo.getBankAddress());
        funcParam.add(bo.getAddCustomerPrivilege());
        funcParam.add(bo.getKycPrivilege());

        String _result = weBASEUtil.funcPost("modifyBank",funcParam);
        JSONObject _resultJson = JSONUtil.parseObj(_result);
        if (_resultJson.getBool("statusOK") == false){
            return Result.fail(1,_resultJson.getStr("message"));
        }

        return Result.ok(null);
    }
}
