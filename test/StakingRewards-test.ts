import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const weekInSeconds = 7 * 24 * 60 * 60;

describe("Tests for StakingRewards Contract as:", function () {
  async function deployStakingRewards() {
    const [owner, acc1, acc2] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("TokenERC20");
    const stakingToken = await ERC20.deploy("stakingToken", "LP");
    const rewardToken = await ERC20.deploy("rewardToken", "RT");

    // const WETH = await ethers.getContractFactory("WETH");
    // const stakingToken = await WETH.deploy(owner.address);
    // const rewardToken = await WETH.deploy(owner.address);

    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    const staking = await StakingRewards.deploy(
      stakingToken.address,
      rewardToken.address
    );

    await stakingToken.mint(acc1.address, 100);
    await rewardToken.mint(staking.address, 10 * 100);

    return { staking, owner, acc1, acc2, stakingToken, rewardToken };
  }

  describe("STAKING", function () {
    it("Should revert staking correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );
      // minted only 10 but required approval 10 x 100
      await stakingToken.connect(acc1).approve(staking.address, 10 * 100);
      await expect(staking.connect(acc1).stake(10 * 100)).to.be.revertedWith(
        "funds insufficient"
      );
    });

    it("Should stake correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );

      // 1. acc1 has not staked yet
      expect(await staking.getStake(acc1.address)).to.be.equal(0);

      // 2. acc1 approve to spend and then stakes 10 => emits event
      await stakingToken.connect(acc1).approve(staking.address, 10);
      await expect(staking.connect(acc1).stake(10))
        .to.emit(staking, "Stake")
        .withArgs(acc1.address, 10);

      expect(await staking.getStake(acc1.address)).to.be.equal(10);
    });

    it("Should revert un-staking correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );

      // 1. stake 10
      await stakingToken.connect(acc1).approve(staking.address, 10);
      await staking.connect(acc1).stake(10);

      // 2. week has not passed
      await expect(staking.connect(acc1).unstake(5)).to.be.revertedWith(
        "stake in progress"
      );

      // 3. week passed but wants to unstake more than it has
      await ethers.provider.send("evm_increaseTime", [weekInSeconds + 60]);
      await expect(staking.connect(acc1).unstake(15)).to.be.revertedWith(
        "funds insufficient"
      );
    });

    it("Should un-stake correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );
      // 1.stake 10 for 1 week as min
      await stakingToken.connect(acc1).approve(staking.address, 10);
      await staking.connect(acc1).stake(10);

      await ethers.provider.send("evm_increaseTime", [weekInSeconds + 60]);

      // 2. Unstake after one week and 1 min
      await expect(staking.connect(acc1).unstake(5))
        .to.emit(staking, "Unstake")
        .withArgs(acc1.address, 5);

      expect(await staking.getStake(acc1.address)).to.be.equal(5);
    });
  });

  describe("CLAIMING", function () {
    it("Should revert claiming rewards correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );
      // staked with min 1 week
      await stakingToken.connect(acc1).approve(staking.address, 10);
      await staking.connect(acc1).stake(10);
      await expect(staking.connect(acc1).claim()).to.be.revertedWith(
        "stake in progress"
      );
    });

    it("Should claim rewards correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );

      // staked 10 with min 1 week
      await stakingToken.connect(acc1).approve(staking.address, 10);
      await staking.connect(acc1).stake(10);

      // 2 weeks passed
      await ethers.provider.send("evm_increaseTime", [
        weekInSeconds + weekInSeconds + 60,
      ]);

      staking.connect(acc1).claim();
      expect(await staking.getRewards(acc1.address)).to.be.equal(0);
    });
  });
});
