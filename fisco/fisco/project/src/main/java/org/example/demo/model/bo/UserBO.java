
package org.example.demo.model.bo;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserBO implements Serializable {

    private String name;
    private String bankAddress;
    private Boolean addCustomerPrivilege;
    private Boolean kycPrivilege;
    private Boolean status;
}
