// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
// 定义合约
contract Marriage{
    // 定义结婚证结构体
    struct Certificate {
        address husbandAddress; // 男方地址
        address wifeAddress; // 女方地址
        string husbandName; // 男方姓名
        string wifeName; // 女方姓名
        uint timestamp; // 创建时间戳
        bool isActive; // 是否有效
        bytes32 id;//结婚证编号
    }
    
    //定义公民信息结构体
    struct CitizenInfo{
        address citizenAddress;
        string id;//公民身份证号码
        string name;//公民姓名
        string birthday;//公民的生日
        uint age;//定义公民的年龄
    }

    struct Husband {
        address husbandAddress; // 男方地址
        string husbandName; // 男方姓名
    }

    struct Wife {
        address wifeAddress; // 女方地址
        string wifeName; // 女方姓名
    }

    struct CivilAffairs {
        address civilAffairsAddress; // 民政机关地址
        string civilAffairsid; // 民政机关id
        bool permission; //认证结婚的权限
    }
    // 定义角色枚举
    enum Role {
        Husband, // 男方
        Wife, // 女方
        CivilAffairs // 民政机关
    }
    
    //公民列表，列表里存放每个公民的string id
    string[] public citizenList;
    //男方列表，列表里存放每个男方的address
    address[] public husbandList;
    //女方列表，列表里存放每个女方的address
    address[] public wifeList;
    //结婚证列表，列表里存放每个结婚证的id
    bytes32[] public certificateList;
    // 定义民政机关权限映射
    mapping(Role => mapping(address => bool)) private roles; // 由角色映射到地址映射到权限
    // 由个人地址映射到citizenInfo
    mapping(address => CitizenInfo) private citizenInfos; 
    // 由男方地址映射到男方
    mapping(address => Husband) private husbandInfos;
    // 由女方地址映射到女方
    mapping(address => Wife) private wifeInfos;
    // 定义结婚证映射
    mapping(bytes32 => Certificate) private certificates; // 由结婚证id映射到结婚证,结婚证id由男方地址和女方地址拼接而成

    // 定义创建公民信息事件
    event CitizenInfoCreated(address citizenAddress, string id, string name, string birthday, uint age);
    // 定义创建男方事件
    event HusbandCreated(address husbandAddress, string husbandName);
    // 定义创建女方事件
    event WifeCreated(address wifeAddress, string wifeName);
    // 定义创建结婚证事件
    event CertificateCreated(bytes32 certificateId, address husbandAddress, address wifeAddress);
    // 定义注销结婚证事件
    event CertificateRevoked(bytes32 certificateId, address revoker);
    // 定义民政机关权限检查修饰器
    modifier onlyRole(Role role) {
        require(roles[role][msg.sender], "Permission denied"); // 检查权限，如果权限不足则抛出异常
        _; // 执行函数体
    }
    

    // 定义构造函数
    constructor() {
        // 设置合约创建者为民政机关，授予民政机关所有权限，授予男方和女方无权限
        roles[Role.CivilAffairs][msg.sender] = true;
        roles[Role.Husband][msg.sender] = false;
        roles[Role.Wife][msg.sender] = false;
    }
    
    // 创建公民信息函数
    function createCitizenInfo(address citizenAddress, string memory id, string memory name, string memory birthday, uint age) public onlyRole(Role.CivilAffairs) {
        // 检查公民信息是否已经存在
        require(citizenInfos[citizenAddress].citizenAddress == address(0), "CitizenInfo already exists");
        // 创建公民信息
        citizenInfos[citizenAddress] = CitizenInfo(citizenAddress, id, name, birthday, age);
        // 将公民信息的id添加到公民列表
        citizenList.push(id);
        // 触发创建公民信息事件
        emit CitizenInfoCreated(citizenAddress, id, name, birthday, age);
    }

    // 根据公民信息注册男方
    function createHusband(address husbandAddress) public{
        // 检查公民信息是否已经存在
        require(citizenInfos[husbandAddress].citizenAddress != address(0), "CitizenInfo not exists");
        // 检查年龄是否大于22岁，否则提示"年龄不足"
        require(citizenInfos[husbandAddress].age >= 22, "Age is not enough");
        // 创建男方,将信息存入男方结构体
        husbandInfos[husbandAddress] = Husband(husbandAddress, citizenInfos[husbandAddress].name);
        // 将男方地址添加到男方列表
        husbandList.push(husbandAddress);
        // 触发创建男方事件
        emit HusbandCreated(husbandAddress, citizenInfos[husbandAddress].name);
    }

    // 根据公民信息注册女方
    function createWife(address wifeAddress) public{
        // 检查公民信息是否已经存在
        require(citizenInfos[wifeAddress].citizenAddress != address(0), "CitizenInfo not exists");
        // 检查年龄是否大于20岁，否则提示"年龄不足"
        require(citizenInfos[wifeAddress].age >= 20, "Age is not enough");
        // 创建女方,将信息存入女方结构体
        wifeInfos[wifeAddress] = Wife(wifeAddress, citizenInfos[wifeAddress].name);
        // 将女方地址添加到女方列表
        wifeList.push(wifeAddress);
        // 触发创建女方事件
        emit WifeCreated(wifeAddress, citizenInfos[wifeAddress].name);
    }

    // 定义创建结婚证函数
    function createCertificate(address civilAffairsAddress, address husbandAddress, string memory husbandName, address wifeAddress, string memory wifeName) public onlyRole(Role.CivilAffairs) {
        // 根据民政局地址检查是否有权限
        require(roles[Role.CivilAffairs][civilAffairsAddress], "Permission denied");
        // 合并男方地址和女方地址，生成结婚证id，男方地址在前
        bytes32 certificateId = keccak256(abi.encodePacked(husbandAddress, wifeAddress));
        // 检查结婚证是否已经存在
        require(certificates[certificateId].timestamp == 0, "Certificate already exists");
        // 创建结婚证
        certificates[certificateId] = Certificate(husbandAddress, wifeAddress, husbandName, wifeName, block.timestamp, true, certificateId);
        // 将结婚证id添加到结婚证列表
        certificateList.push(certificateId);
        // 发布创建结婚证事件
        emit CertificateCreated(certificateId, husbandAddress, wifeAddress);
    }
    
    // 定义查询结婚证函数
    function getCertificate(bytes32 certificateId) public view returns (address husbandAddress, string memory husbandName, address wifeAddress, string memory wifeName, uint timestamp, bool isActive) {
        // 获取结婚证信息
        Certificate storage certificate = certificates[certificateId];
        // 检查结婚证是否有效
        require(certificate.isActive, "Certificate is invalid"); 
        // 返回结婚证信息
        return
        (
            certificate.husbandAddress,
            certificate.husbandName,
            certificate.wifeAddress,
            certificate.wifeName,
            certificate.timestamp,
            certificate.isActive
        );
    }

    // 定义注销结婚证函数
    function revokeCertificate(address civilAffairsAddress, bytes32 certificateId) public onlyRole(Role.CivilAffairs) {
        // 根据民政局地址检查是否有权限
        require(roles[Role.CivilAffairs][civilAffairsAddress], "Permission denied");
        // 获取结婚证信息
        Certificate storage certificate = certificates[certificateId];
        // 检查结婚证是否有效
        require(certificate.isActive, "Certificate is invalid");
        // 将结婚证设置为无效
        certificate.isActive = false;
        // 将结婚证id从结婚证列表中删除
        for (uint i = 0; i < certificateList.length; i++) {
            if (certificateList[i] == certificateId) {
                delete certificateList[i];
                break;
            }
        }
        // 发布注销结婚证事件
        emit CertificateRevoked(certificateId, msg.sender);
    }
}