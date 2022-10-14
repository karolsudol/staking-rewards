// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20("Wrapped Ether", "WETH") {
    address public owner;

    function deposit() public payable virtual {
        _mint(msg.sender, msg.value);

        emit Transfer(address(0), msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public virtual {
        _burn(msg.sender, amount);

        payable(msg.sender).transfer(amount);
        emit Transfer(msg.sender, address(0), amount);
    }
}
