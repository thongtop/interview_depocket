// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract manage_contract   {
    address public demoToken = 0x2Ee21AE753a632a6F78022Bf254E45506505B609;
    address public director;        //giám đốc
    address public viceDirector;   //Phó giám đốc
    address public accountant;      //kế toán
    uint256 public director_amount_transfer = 1000000000000000000000;      
    uint256 public viceDirector_amount_transfer  = 500000000000000000000; 
    uint256 public availableBalance;
    mapping(address => mapping(address => address)) public order;

    address private _owner;
    
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
    constructor() {
        _owner = _msgSender();
    }
    function owner() public view virtual returns (address) {
        return _owner;
    }
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    modifier onlyDirector() {
        require(director == _msgSender(), "Ownable: caller is not the director");
        _;
    }
    modifier onlyViceDirector() {
        require(viceDirector == _msgSender(), "Ownable: caller is not the vice director");
        _;
    }
    modifier onlyAccountant() {
        require(accountant == _msgSender(), "Ownable: caller is not the vice director");
        _;
    }
    // set wallet chức vụ
    function setTokenAddress(address _tokenContract) external onlyOwner {
        demoToken = _tokenContract;
    }
    function setDirector(address _address) external onlyOwner {
        director = _address;
    }
    function setViceDirector(address _address) external onlyOwner {
        viceDirector = _address;
    }
    function setAccountant(address _address) external onlyOwner {
        accountant = _address;
    }

    function set_director_amount_transfer(uint256 _amount) external onlyOwner {
        director_amount_transfer = _amount;
    }
    function set_viceDirector_amount_transfer(uint256 _amount) external onlyOwner {
        viceDirector_amount_transfer = _amount;
    }
    // --------------------
    function deposit_token(uint256 _amount)  public returns (bool) {
        IERC20 token = IERC20(demoToken);
        availableBalance = availableBalance + _amount;
        return token.transferFrom(msg.sender, address(this), _amount);
    }
    
    // rút all token
    function withdrawAllTokens(address _tokenContract) onlyDirector public returns (bool) {
        IERC20 token = IERC20(_tokenContract);
        availableBalance = 0;
        return token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    // Giám đốc rút tiền
    function Director_transfer(address _to, uint256 _amount) onlyDirector public returns (bool) {
        IERC20 token = IERC20(demoToken);
        //uint256 totalBalance =   token.balanceOf(address(this));
        require(_amount < director_amount_transfer, "The director can only transfer up to 1000");
        require(_amount < availableBalance, "Insufficient available balance");
        availableBalance = availableBalance - _amount;
        return token.transfer(_to, _amount);
    }
    // Phó giám đốc rút tiền
    function viceDirector_transfer(address _to, uint256 _amount) onlyViceDirector public returns (bool) {
        IERC20 token = IERC20(demoToken);
        //uint256 totalBalance =   token.balanceOf(address(this));
        require(_amount < viceDirector_amount_transfer, "The vice director can only transfer up to 500");
        require(_amount < availableBalance, "Insufficient available balance");
        availableBalance = availableBalance - _amount;
        return token.transfer(_to, _amount);
    }

    //Kế toán gửi lệnh rút tiền
    uint256[] public allOrder;
    mapping(uint256 => uint256) private order_amount;
    mapping(uint256 => address) private order_address;
    mapping(uint256 => uint256) private order_check;


    function allOrderLength() public view returns (uint) {
        return allOrder.length;
    }
    function viewOrder(uint256 orderId) public view returns (uint256 _orderId, uint256 _order_amount, address _order_address, uint256 _order_check) {
        _orderId =  orderId;
        _order_amount = order_amount[orderId];
        _order_address = order_address[orderId];
        _order_check = order_check[orderId];
    }
    
    function accountant_create_transfer_order(address _to, uint256 _amount) onlyAccountant public {
        require(_amount < availableBalance, "Insufficient available balance");
        uint256 orderId = allOrder.length;
        allOrder.push(orderId);
        order_amount[orderId] = _amount;
        order_address[orderId] = _to;
        order_check[orderId] = 0;
    }

    function Director_transfer_order_accountant(uint256 orderId) onlyDirector public returns (bool) {
        IERC20 token = IERC20(demoToken);
        require(order_check[orderId]==0, "This request has been approved before");
        order_check[orderId] = 1;
        return token.transfer(order_address[orderId], order_amount[orderId]);
    }

    function Director_transfer_all_order_accountant() onlyDirector public {
        IERC20 token = IERC20(demoToken);
        for (uint i; i < allOrder.length - 1; i++) {
            if (order_check[allOrder[i]] ==0){
                token.transfer(order_address[allOrder[i]], order_amount[allOrder[i]]);
                order_check[allOrder[i]] = 1;
            }
        }
    }
    
}