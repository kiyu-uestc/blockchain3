package org.example.demo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.log4j.Log4j2;
import org.example.demo.model.Result;
import org.example.demo.model.bo.UserBO;
import org.example.demo.model.bo.LoginBO;
import org.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

@Api(value = "用户管理接口", tags = {"用户管理 Api"})
@Log4j2
@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${project.admin-address}")
    String adminAddress;

    @ApiOperation(value = "登录接口", notes = "登录接口")
    @PostMapping(path = "/login")
    public Result Login(@RequestBody LoginBO bo) {
        if ("admin".equals(bo.getLoginType()))
            if (adminAddress.equals(bo.getAddress()))
                return Result.ok(null);
            else
                return Result.fail(1, "地址错误");
        else
            return userService.login(bo);
    }

    @ApiOperation(value = "获取所有银行列表", notes = "获取所有银行列表")
    @PostMapping(path = "/getAllBanks")
    public Result getAllBanks() {
        return userService.getAllBanks();
    }

    @ApiOperation(value = "添加银行用户", notes = "添加银行用户")
    @PostMapping(path = "/addBank")
    public Result addBank(@RequestBody UserBO bo) {
        return userService.addBank(bo);
    }

    @ApiOperation(value = "更新银行用户状态", notes = "更新银行用户状态")
    @PostMapping(path = "/updateBankStatus")
    public Result updateBankStatus(@RequestBody UserBO bo) {
        return userService.updateBankStatus(bo);
    }

    @ApiOperation(value = "获取银行信息", notes = "主要用户登录")
    @PostMapping(path = "/getBank")
    public Result getBank(@RequestBody UserBO bo) {
        return userService.getBank(bo);
    }

    @ApiOperation(value = "修改银行信息", notes = "修改银行信息")
    @PostMapping(path = "/modifyBank")
    public Result modifyBank(@RequestBody UserBO bo) {
        return userService.modifyBank(bo);
    }
}
