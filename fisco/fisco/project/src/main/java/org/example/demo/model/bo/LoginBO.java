package org.example.demo.model.bo;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginBO implements Serializable {

    private String loginType;
    private String address;
}
