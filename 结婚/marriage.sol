pragma solidity ^0.8.0;

contract MarriageCertificate {
    address public husband; // 婚姻男方
    address public wife; // 婚姻女方
    address public civilAffairs; // 婚姻登记机关
    string public certificate; // 婚姻登记证书

    // 婚姻登记证书构造函数, 初始化婚姻男方, 婚姻女方, 婚姻登记机关
    constructor(address _husband, address _wife, address _civilAffairs) { 
        husband = _husband;
        wife = _wife;
        civilAffairs = _civilAffairs;
    }
    
    function signCertificate(string memory _certificate) public {
        require(msg.sender == husband || msg.sender == wife, "Only husband or wife can sign the certificate.");
        certificate = _certificate;
    }

    function getCertificate() public view returns (string memory) {
        require(msg.sender == husband || msg.sender == wife || msg.sender == civilAffairs, "Only husband, wife, or civil affairs department can view the certificate.");
        return certificate;
    }

    function revokeCertificate() public {
        require(msg.sender == husband || msg.sender == wife, "Only husband or wife can revoke the certificate.");
        certificate = "";
    }

    function approveRevokeCertificate() public {
        require(msg.sender == civilAffairs, "Only civil affairs department can approve the revoke of the certificate.");
        certificate = "";
    }
}
