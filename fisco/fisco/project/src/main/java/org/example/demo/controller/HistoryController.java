package org.example.demo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.log4j.Log4j2;
import org.example.demo.model.Result;
import org.example.demo.model.bo.BankBO;
import org.example.demo.service.BankService;
import org.example.demo.service.HistoryService;
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

@Api(value = "KYC信息变更接口", tags = {"银行业务 Api"})
@Log4j2
@RestController
@RequestMapping(path = "/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @ApiOperation(value = "KYC信息变更历史列表", notes = "KYC信息变更历史列表")
    @PostMapping(path = "/getAllKycHistories")
    public Result getAllKycHistories(@RequestBody BankBO bo) {
        return historyService.getAllKycHistories(bo);
    }
}
