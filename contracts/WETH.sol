// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20("Wrapped Ether", "WETH") {
    /* ======================= STATE VARS ======================= */
    address public owner;

    /* ======================= EVENTS ======================= */

    /* ======================= MODIFIERS ======================= */

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    /* ======================= PUBLIC STATE CHANGING FUNCS ======================= */

    function deposit() public payable virtual onlyOwner {
        _mint(msg.sender, msg.value);

        emit Transfer(address(0), msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public virtual onlyOwner {
        _burn(msg.sender, amount);

        payable(msg.sender).transfer(amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    receive() external payable virtual {
        deposit();
    }
}
