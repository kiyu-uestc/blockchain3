package org.example.demo.model;

import cn.hutool.json.JSONUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    public static final Integer OK = 0;

    private Integer code;
    private String message;
    private Object data;

    public static Result ok(Object data){
        return new Result(OK, "",data);
    }

    public static Result fail(Integer code, String message){
        return new Result(code, message, null);
    }

    public static Result make(Integer code, String message, Object data){
        return new Result(code, message, data);
    }

    @Override
    public String toString() {
        return JSONUtil.toJsonStr(this);
    }
}
