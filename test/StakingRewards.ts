import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CONTRACT: ***StakingRewards tests***", function () {
  async function deployStakingRewards() {
    const [owner, acc1, acc2] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("ERC20token");
    const stakingToken = await ERC20.deploy();
    const rewardToken = await ERC20.deploy();

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

    it("Should revert staking if insufficient funds", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );

      // minted only 10
      await stakingToken.connect(acc1).approve(staking.address, 10 * 100);
      await expect(staking.connect(acc1).stake(10 * 100)).to.be.revertedWith(
        "funds insufficient"
      );
    });

    it("Should unstake correctly", async function () {
      const { staking, acc1, stakingToken } = await loadFixture(
        deployStakingRewards
      );
      // 1.stake 10 for 1 week as min
      await stakingToken.connect(acc1).approve(staking.address, 20);
      await staking.connect(acc1).stake(10);

      await ethers.provider.send("evm_increaseTime", [604800 * 10099999]);

      const tx = staking.connect(acc1).unstake(5);
      await expect(tx).to.emit(staking, "Unstake").withArgs(acc1.address, 5);

      const new_stake = await staking.getStakeholderStake(acc1.address);
      expect(new_stake).to.be.equal(5);
    });

    // it('Should revert unstaking LP tokens', async function () {

    //     await stakingToken.connect(addr1).approve(staking.address, 20);
    //     await staking.connect(addr1).stake(10);

    //     const tx = staking.connect(addr1).unstake(5);
    //     await expect(tx).to.be.revertedWith("Stake is still freezed");

    //     await ethers.provider.send("evm_increaseTime", [1500]);
    //     const tx1 = staking.connect(addr1).unstake(15);
    //     await expect(tx1).to.be.revertedWith("Claimed amount exceeds the stake");

    // });
  });

  // describe("Deployment", function () {
  //   it("Should set the right unlockTime", async function () {
  //     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.unlockTime()).to.equal(unlockTime);
  //   });

  //   it("Should set the right owner", async function () {
  //     const { lock, owner } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.owner()).to.equal(owner.address);
  //   });

  //   it("Should receive and store the funds to lock", async function () {
  //     const { lock, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     expect(await ethers.provider.getBalance(lock.address)).to.equal(
  //       lockedAmount
  //     );
  //   });

  //   it("Should fail if the unlockTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const Lock = await ethers.getContractFactory("Lock");
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unlock time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  // describe("Events", function () {
  //   it("Should emit an event on withdrawals", async function () {
  //     const { lock, unlockTime, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw())
  //       .to.emit(lock, "Withdrawal")
  //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //   });
  // });

  // describe("Transfers", function () {
  //   it("Should transfer the funds to the owner", async function () {
  //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw()).to.changeEtherBalances(
  //       [owner, lock],
  //       [lockedAmount, -lockedAmount]
  //     );
  //   });
  // });
  // });
});
