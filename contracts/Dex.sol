// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract DEX {
    mapping(address => mapping(address => uint)) associatedTokens;
    address owner;
    address public feeAccount; //account to collect fees
    uint256 public fee;
    mapping(uint => _Order) public orders;
    mapping(uint => bool) public orderCancelled;
    uint256 public orderId; //total number of contracts

    struct _Order {
        uint id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timestamp; //order created
        bool orderMade;
        bool orderFilled;
    }

    event TokenDeposited(address indexed owner, address indexed spender, uint256 amount, uint256 balance);
    event TokenWithdraw(address indexed owner, address indexed token, uint256 amount, uint256 balance);
    event OrderToken(address indexed tokenGet, uint256 numGet, address indexed tokenGive, uint256 numGive, address indexed owner, uint256 id, uint256 timestamp, bool orderMade, bool orderFilled);
    event CancelOrder(_Order order, uint256 id);
    event Trade(uint256 id, address indexed user, address creator, address indexed tokenGet, uint256 amountGet, address indexed tokenGive, uint256 amountGive, uint256 timestamp);
    constructor(address _feeAccount, uint256 _fee){
        owner = msg.sender;
        feeAccount = _feeAccount;
        fee = _fee;
    }

    modifier ownerHasTokens(IERC20 token) {
        require(associatedTokens[address(token)][msg.sender] > 0, "No tokens associated with this user");
        _;
    }

    function depositTokens(IERC20 _token, uint256 amount) external {
        
        require(_token.balanceOf(msg.sender) >= amount, "You do not have enough coins to approve on the exchange");
        require(amount > 0, "you must approve more than 500 tokens on this exchange");
        uint allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= amount, "You are trying to deposit more tokens than you have allowed");
        bool sent = _token.transferFrom(msg.sender, address(this), amount);
        require(sent, "Transaction Failed");
        associatedTokens[address(_token)][msg.sender] += amount;
        emit TokenDeposited(msg.sender, address(this), amount, balanceOf(address(_token), msg.sender));

    }

    function balanceOf(address token, address user) public view returns(uint256){
        return associatedTokens[token][user];
    }

    function withdrawTokens(IERC20 token, uint amount) external ownerHasTokens(token){
        uint tokenBalance = associatedTokens[address(token)][msg.sender];
        require(amount <= tokenBalance, "Not enough tokens to withdraw");
        associatedTokens[address(token)][msg.sender] -= amount;
        token.transfer(msg.sender, amount);
        emit TokenWithdraw(msg.sender, address(token), amount, balanceOf(address(token), msg.sender));

    }


    // Make and cancel order
    // give token to spend, get token to receive
    function makeOrder(IERC20 tokenGet,IERC20 tokenGive, uint256 numSen, uint256 numReceive) external payable {
        require(balanceOf(address(tokenGive), msg.sender) >= numSen, "Not enough tokens sent");
        orderId++;
        uint time = block.timestamp;
        orders[orderId] = _Order(orderId, msg.sender, address(tokenGet), numReceive, address(tokenGive), numSen, time, true, false);
        emit OrderToken(address(tokenGet), numSen, address(tokenGive), numReceive, msg.sender, orderId, time, true, false);

    }

    function cancelToken(uint id) external {
        require(orders[id].orderMade, "No order recorded, reverting");
        require(address(orders[id].user) == msg.sender, "You do not own this order");
        // _Order storage order = orders[id];
        orders[id].orderMade = false;
        orderCancelled[id] = true;
        emit CancelOrder(orders[id], id);
    }

    function fillOrder(uint256 id) public {
        //Swapping Tokens
        require(orders[id].orderMade, "No order recorded, reverting");
        require(!orders[id].orderFilled, "Order is already Filled");
        require(!orderCancelled[id], "Order is already cancelled");
        _Order storage order = orders[id];
        uint256 order_time = block.timestamp;
        trade(order.id, order.user, order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order_time);
        order.orderFilled = true;

        
    }

    function trade(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp) internal {

        uint256 _fee = (amountGet *fee)/100;

        //msg sender is the one who fills, user creates the order 
        //msg.sender gets charged the fee
        //tokenGet is the token that the user who made the orger is getting and owned by msg,sender

        associatedTokens[tokenGet][msg.sender] -= (amountGet + _fee);
        associatedTokens[tokenGet][user] += amountGet;
        associatedTokens[tokenGet][feeAccount] += _fee;
        associatedTokens[tokenGive][user] -= amountGive;
        associatedTokens[tokenGive][msg.sender] += amountGive;

        emit Trade(id, msg.sender, user, tokenGet, amountGet, tokenGive, amountGive, timestamp);

    }


}