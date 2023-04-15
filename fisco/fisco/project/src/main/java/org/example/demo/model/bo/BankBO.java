
package org.example.demo.model.bo;

import lombok.Data;

import java.io.Serializable;

@Data
public class BankBO implements Serializable {
    //Customer Info

    //msg.sender
    private String userAddress;
    private String uuid;
    private String hash;
    private String bankAddr;
    private Boolean status;

    //Customer hash Data
    private String custName;
    private String custCountry;
    private String custSex;
    private String custId;
    private String custPhone;
    private String addr;
}
