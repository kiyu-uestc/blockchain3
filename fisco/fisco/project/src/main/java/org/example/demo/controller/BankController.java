package org.example.demo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.log4j.Log4j2;
import org.example.demo.model.Result;
import org.example.demo.model.bo.BankBO;
import org.example.demo.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author huangyu@ivinsight.com
 * @Copyright: Copyright (c) 2022
 * @Description:
 * @Company: 智谷星图
 * @Created on 2022-03-22 12:57:37
 */


@Api(value = "KYC业务操作", tags = {"银行业务 Api"})
@Log4j2
@RestController
@RequestMapping(path = "/bank")
public class BankController {

    @Autowired
    private BankService bankService;

    @ApiOperation(value = "获取所有客户列表", notes = "获取所有客户列表")
    @PostMapping(path = "/getAllCustomers")
    public Result getAllCustomers(@RequestBody BankBO bo) {
        return bankService.getAllCustomers(bo);
    }

    @ApiOperation(value = "添加客户KYC", notes = "添加客户KYC")
    @PostMapping(path = "/addCustomer")
    public Result addCustomer(@RequestBody BankBO bo) {
        return bankService.addCustomer(bo);
    }

    @ApiOperation(value = "查看客户KYC信息", notes = "查看客户KYC信息")
    @PostMapping(path = "/viewCustomerData")
    public Result viewCustomerData(@RequestBody BankBO bo) {
        return bankService.viewCustomerData(bo);
    }

    @ApiOperation(value = "修改客户信息", notes = "修改客户信息")
    @PostMapping(path = "/modifyCustomer")
    public Result modifyCustomer(@RequestBody BankBO bo) {
        return bankService.modifyCustomer(bo);
    }

    @ApiOperation(value = "更新客户信息", notes = "更新客户信息")
    @PostMapping(path = "/updateCustomerStatus")
    public Result updateCustomerStatus(@RequestBody BankBO bo) {
        return bankService.updateCustomerStatus(bo);
    }

    @ApiOperation(value = "根据HASH查找客户KYC资料", notes = "根据HASH查找客户KYC资料")
    @PostMapping(path = "/searchCustomerDataByHash")
    public Result searchCustomerDataByHash(@RequestBody BankBO bo) {
        return bankService.searchCustomerDataByHash(bo);
    }
}
