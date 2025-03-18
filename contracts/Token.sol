// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{

    // string public name = "BlackChain";
    // string public symbol = "BLK";
    // uint256 public decimals = 18;
    // uint public totalSupply = 1_000_000_000;
    //mapping(address => uint) balances;
    // mapping(address => mapping(address => uint)) allowances;
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value)

    constructor(uint initialSupply, string memory name, string memory symbol) ERC20(name, symbol){
        _mint(msg.sender, initialSupply);
        //balances[msg.sender] = initalSupply
        // name=name;
        // symbol=symbol;
        // totalSupply = initialSupply;
    }

    // function _transfer(address from, address to, uint256 value) internal {
    //     balances[from] -= _value;
    //     balances[to] += _value;
    //     emit Transfer(from, to, _value);
    // }

    // function transfer(address _to, uint256 _value) public returns (bool){
    //     require(balances[msg.sender] > _value, "Not enough to transfer");
            // _transfer(msg.sender, _to, value);
    //     return true;
    // }

    // function approve(address _spender, uint value) public returns(bool){
    //     allowances[msg.sender][_spender] = value;
    //     emit Approval(msg.sender, _spender, value);
    //     return true;
    // }


    // function transferFrom(address from, address to, uint256 value) public returns (bool){
    //     require(value < allowances[from][msg.sender]);
    //     require(value <= balances[from]);
    //     allowances[from][msg.sender] -= value;
    //     _transfer(from, to, value);
    // }


    
}