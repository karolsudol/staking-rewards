// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    /* ======================= STATE VARS ======================= */

    uint256 public immutable _rewardRate = 1;
    uint256 public immutable _minStakingTime = 1 weeks;

    IERC20 public immutable stakingToken;
    ERC20 public immutable rewardsToken;

    uint256 public rewardRate;
    uint256 public minStakingTime;
    uint256 public rewardStartAt;

    address public owner;

    struct Staker {
        uint256 stake;
        uint256 lastStakedAt;
        uint256 reward;
    }

    mapping(address => Staker) public stakers;

    /* ======================= CONSTRUCTOR ======================= */

    constructor(address _stakingToken, address _rewardsToken) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = ERC20(_rewardsToken);
        rewardRate = _rewardRate;
        minStakingTime = _minStakingTime;
        rewardStartAt = _minStakingTime;
    }

    /* ======================= Events ======================= */

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);

    /* ======================= MODIFIERS ======================= */

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier verifyStakingTime() {
        require(
            stakers[msg.sender].lastStakedAt + minStakingTime * 1 weeks <
                block.timestamp,
            "stake in progress"
        );
        _;
    }

    modifier updateReward(address staker) {
        require(
            stakers[staker].lastStakedAt + minStakingTime * 1 weeks <
                block.timestamp,
            "stake in progress"
        );
        stakers[staker].reward = _calculateReward(msg.sender);
        rewardsToken.increaseAllowance(staker, stakers[staker].reward);
        _;
    }

    /* ======================= PUBLIC VIEW FUNCTIONS ======================= */

    function getStake(address staker) external view returns (uint256) {
        return stakers[staker].stake;
    }

    function getRewards(address staker) external view returns (uint256) {
        return stakers[staker].reward;
    }

    /* ======================= PUBLIC STATE CHANGING FUNCTIONS ======================= */
    function claim() external updateReward(msg.sender) returns (bool) {
        uint256 reward = stakers[msg.sender].reward;
        rewardsToken.transfer(msg.sender, reward);
        stakers[msg.sender].reward = 0;
        rewardsToken.decreaseAllowance(msg.sender, reward);

        return true;
    }

    function stake(uint256 amount) external returns (bool) {
        require(
            stakingToken.balanceOf(msg.sender) >= amount,
            "funds insufficient"
        );

        stakers[msg.sender].stake += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakers[msg.sender].lastStakedAt = block.timestamp;

        emit Stake(msg.sender, amount);
        return true;
    }

    function unstake(uint256 amount) external verifyStakingTime returns (bool) {
        require(
            stakers[msg.sender].stake >= amount,
            "Claimed amount exceeds the stake"
        );
        stakingToken.transfer(msg.sender, amount);
        stakers[msg.sender].stake -= amount;
        emit Unstake(msg.sender, amount);

        return true;
    }

    /* ======================= PRIVATE FUNCTIONS ======================= */

    function _calculateReward(address staker) internal returns (uint256) {
        uint256 coefficient = (block.timestamp - stakers[staker].lastStakedAt) /
            (rewardStartAt * 1 weeks);

        for (uint256 i = 0; i < coefficient; i++) {
            stakers[staker].reward +=
                (stakers[staker].stake * rewardRate * 100) /
                10000;
        }
        return stakers[staker].reward;
    }
}
