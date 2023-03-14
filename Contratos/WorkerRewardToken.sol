pragma solidity ^0.8.17; // SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract WorkerRewardToken is ERC20 {
    constructor() ERC20("WorkerRewardToken", "WRT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}

   