// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Library.sol";

contract FoodTraceability {
    address adminAddr;  // 管理员地址
    
    struct Producer {
        bytes32 id;  // 生产商唯一标识
        bytes32 name;  // 生产商名称
        address addr;  // 生产商地址
        bool produceprivilege; // 生产商生产权限
        bool status; // 生产商状态
    }
    struct Distributor {
        bytes32 id;  // 分销商唯一标识
        bytes32 name;  // 分销商名称
        address addr;  // 分销商地址
        bool purchaseprivilege; // 分销商采购权限
        bool status; // 分销商状态
    }
    struct Retailer {
        bytes32 id;  // 零售商唯一标识
        bytes32 name;  // 零售商名称
        address addr;  // 零售商地址
    }
    struct Customer {
        bytes32 id;  // 顾客唯一标识
        bytes32 name;  // 顾客名称
        address addr;  // 顾客地址
    }
    struct Production {
        bytes32 name;  // 产品名称
        bytes32 id;  // 产品唯一标识
        bytes32 price;  // 产品价格
        bytes32 quantity;  // 产品数量
        bytes32 productiondate;  // 产品生产日期
        bytes32 productionaddr;  // 产品生产地址
    }
    struct purchase {
        bytes32 hash; //采购哈希值
    }
    struct purchaseData {
        bytes32 id;  // 商品名称
        bytes32 price; // 采购价格
        bytes32 quantity; // 采购数量
        bytes32 date; // 采购日期
        bytes32 addr; // 采购地址
        address from; // 采购来源地址
        address to; // 采购目的地址
    }
    
    constructor() public {
        adminAddr = msg.sender; // 初始化管理员地址
    }

    string[] Producers; // 生产商列表
    string[] Distributors; // 分销商列表
    string[] Retailers; // 零售商列表
    string[] Customers; // 顾客列表
    string[] Productions; // 产品列表

    mapping (bytes32 => purchaseData) purchaseDataMap; // 采购数据映射 
    mapping (address => Producer) ProducersMap;        // 生产商映射
    mapping (address => Distributor) DistributorsMap;  // 分销商映射
    mapping (address => Retailer) RetailersMap;        // 零售商映射
    mapping (address => Customer) CustomersMap;        // 顾客映射
    mapping (bytes32 => Production) ProductionsMap;    // 产品映射
    mapping (bytes32 => purchase) purchaseMap;         // 采购信息映射
    mapping (bytes32 => address) ProducerAddrMap;//根据产品id获取生产商地址的映射
    
    event ProducerCreated(bytes32); // 生产商创建事件
    event DistributorCreated(bytes32 indexed distributorId); // 分销商创建事件
    event RetailerCreated(bytes32 indexed retailerId); // 零售商创建事件
    event CustomerCreated(bytes32 indexed customerId); // 顾客创建事件
    event ProductCreated(bytes32 indexed productId); // 产品创建事件
    event ProductPurchased(bytes32 indexed productId); // 产品采购事件

    
    function createProducer(bytes32 _id, bytes32 _name, address _addr, bool _produceprivilege, bool _status) public { // 创建生产商
        ProducersMap[_addr] = Producer(_id, _name, _addr, _produceprivilege, _status);  // 将生产商信息添加到生产商映射中
        Producers.push(_id); // 将生产商名称添加到生产商列表中
        emit ProducerCreated(_id); // 触发生产商创建事件
    }
    
    function createDistributor(bytes32 _id, bytes32 _name, address _addr, bool _purchaseprivilege, bool _status) public { // 创建分销商
        DistributorsMap[_addr] = Distributor(_id, _name, _addr, _purchaseprivilege, _status); 
        Distributors.push(_id); // 将分销商名称添加到分销商列表中
        emit DistributorCreated(_id); // 触发分销商创建事件
    }

    function createRetailer(bytes32 _id, bytes32 _name, address _addr) public { // 创建零售商
        RetailersMap[_addr] = Retailer(_id, _name, _addr); 
        Retailers.push(_id); // 将零售商名称添加到零售商列表中
        emit RetailerCreated(_id); // 触发零售商创建事件
    }

    function createCustomer(bytes32 _id, bytes32 _name, address _addr) public { // 创建顾客
        CustomersMap[_addr] = Customer(_id, _name, _addr); // 将顾客信息添加到顾客映射中
        Customers.push(_id); // 将顾客名称添加到顾客列表中
        emit CustomerCreated(_id); // 触发顾客创建事件
    }

    function createProduct(bytes32 _name, bytes32 _id, bytes32 _price, bytes32 _quantity, bytes32 _productiondate, bytes32 _productionaddr) public { // 创建产品
        //要求生产商具有生产权限
        require(ProducersMap[msg.sender].produceprivilege == true, "Producer does not have the privilege to produce.");
        //将产品信息添加到产品映射中
        ProductionsMap[_id] = Production(_name, _id, _price, _quantity, _productiondate, _productionaddr);
        Productions.push(_id); // 将产品名称添加到产品列表中 
        emit ProductCreated(_id); // 触发产品创建事件
    }

    function dis_purchase_Product(bytes32 _id, bytes32 _price, bytes32 _quantity, bytes32 _date, bytes32 _addr) public { // 采购产品
        //要求分销商具有采购权限
        require(DistributorsMap[msg.sender].purchaseprivilege == true, "Distributor does not have the privilege to purchase.");
        //要求产品存在
        require(ProductionsMap[_id].id != 0, "Product does not exist.");
        //获取生产商地址
        address _producerAddr = ProducerAddrMap[_id];
        //生成hash值赋值给_hash
        bytes32 _hash = keccak256(abi.encodePacked(_id, _price, _quantity, _date, _addr, msg.sender, _producerAddr));
        //将采购信息添加到采购信息映射中
        purchaseMap[_id] = purchase(_hash); 
        //将采购数据添加到采购数据映射中
        purchaseDataMap[_hash] = purchaseData(_id, _price, _quantity, _date, _addr, msg.sender, _producerAddr);
        emit ProductPurchased(_id); // 触发产品采购事件
    }

    function ret_purchase_Product(bytes32 _id, bytes32 _price, bytes32 _quantity, bytes32 _date, bytes32 _addr) public { // 采购产品
        //要求产品存在
        require(ProductionsMap[_id].id != 0, "Product does not exist.");
        //获取分销商地址
        address _distributorAddr = purchaseDataMap[purchaseMap[_id].hash].distributorAddr;
        //生成hash值赋值给_hash
        bytes32 _hash = keccak256(abi.encodePacked(_id, _price, _quantity, _date, _addr, msg.sender, _distributorAddr));
        //将采购信息添加到采购信息映射中
        purchaseMap[_id] = purchase(_hash); 
        //将采购数据添加到采购数据映射中
        purchaseDataMap[_hash] = purchaseData(_id, _price, _quantity, _date, _addr, msg.sender, _distributorAddr);
        emit ProductPurchased(_id); // 触发产品采购事件
    }

    function cus_purchase_Product(bytes32 _id, bytes32 _price, bytes32 _quantity, bytes32 _date, bytes32 _addr) public { // 采购产品
        //要求产品存在
        require(ProductionsMap[_id].id != 0, "Product does not exist.");
        //获取零售商地址
        address _retailerAddr = purchaseDataMap[purchaseMap[_id].hash].retailerAddr;
        //生成hash值赋值给_hash
        bytes32 _hash = keccak256(abi.encodePacked(_id, _price, _quantity, _date, _addr, msg.sender, _retailerAddr));
        //将采购信息添加到采购信息映射中
        purchaseMap[_id] = purchase(_hash); 
        //将采购数据添加到采购数据映射中
        purchaseDataMap[_hash] = purchaseData(_id, _price, _quantity, _date, _addr, msg.sender, _retailerAddr);
        emit ProductPurchased(_id); // 触发产品采购事件
    }

    //溯源查询功能：通过输入商品唯一信息，可以查询商品的所有流转记录
    function queryPurchase(bytes32 _id) public view returns (bytes32, bytes32, bytes32, bytes32, bytes32, bytes32, bytes32) {
        //要求产品存在
        require(ProductionsMap[_id].id != 0, "Product does not exist.");
        //获取采购数据
        purchaseData memory _purchaseData = purchaseDataMap[purchaseMap[_id].hash];
        //返回采购数据
        return (_purchaseData.id, _purchaseData.price, _purchaseData.quantity, _purchaseData.date, _purchaseData.addr, _purchaseData.customerAddr, _purchaseData.distributorAddr);
    }
}    