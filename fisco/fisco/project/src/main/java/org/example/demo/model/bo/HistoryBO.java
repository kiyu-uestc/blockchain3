
package org.example.demo.model.bo;

import lombok.Data;

import java.io.Serializable;

@Data
public class HistoryBO implements Serializable {
    //msg.sender
    private String userAddress;
    private String uuid;
    private String hash;
    private String bankAddr;
    private String createTime;
}
