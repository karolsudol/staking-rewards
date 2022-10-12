// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    /* ======================= STATE VARS ======================= */
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    uint256 public rawardRate;
    uint256 public minStakeTime;
    uint256 public startAt;
    uint256 public finishAt;
    uint256 public duration;

    address public owner;

    struct Staker {
        uint256 stake;
        uint256 updatedAt;
        uint256 reward;
    }

    mapping(address => Staker) public stakers;

    /* ======================= CONSTRUCTOR ======================= */

    constructor(address _stakingToken, address _rewardsToken) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = ERC20(_rewardsToken);
        rewardRate = 20;
        minStakeTimeMins = 10;
        rewardStartsAt = 20;
    }

    /* ======================= Events ======================= */

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);

    /* ======================= MODIFIERS ======================= */

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier checkStakingTime() {
        require(
            stakers[msg.sender].lastStakedAt + minStakeTimeMins * 1 minutes <
                block.timestamp,
            "stake in progress"
        );
        _;
    }

    modifier updateReward(address staker) {
        require(
            stakers[staker].lastStakeTime + rewardStartsAt * 1 minutes <
                block.timestamp,
            "Rewards are not available yet"
        );
        stakeholders[stakeholder].rewardsAvailable = _calculateReward(
            msg.sender
        );
        _approveRewards(
            stakeholder,
            stakeholders[stakeholder].rewardsAvailable
        );
        _;
    }
}
