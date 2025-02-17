// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import 'hardhat/console.sol';

contract Greeter {
    string value;

    constructor(string memory _value){
        console.log("Greeting deployed");
        value = _value;
    }

    function getValue() public view returns (string memory){
        return value;
    }

    function setValue(string memory userInput) public {
        console.log("Setting Value from %s to %s",value, userInput);
        value=userInput;
    }
}