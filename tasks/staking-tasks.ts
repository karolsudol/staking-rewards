import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const STAKING_CONTRACT_ADDRESS: string = process.env
  .STAKING_REWARD_CONTRACT_ADDRESS as string;
const LP_TOKEN_ADDRESS: string = process.env.REWARD_TOKEN_ADDRESS as string;

task("stake", "Stakes tokens")
  .addParam("account", "staker's account")
  .addParam("amount", "un-staking amount")
  .setAction(async (taskArgs: { amount: any; account: any }, hre) => {
    const staking = await hre.ethers.getContractAt(
      "StakingRewards",
      STAKING_CONTRACT_ADDRESS
    );
    const lptoken = await hre.ethers.getContractAt(
      "TokenERC20",
      LP_TOKEN_ADDRESS
    );
    const account = await hre.ethers.getSigners();
    const amount = hre.ethers.utils.parseUnits(taskArgs.amount, 18);

    await lptoken.connect(account[0]).approve(staking.address, amount);
    console.log("approve completed");
    let result = await staking.connect(account[0]).stake(amount);
    console.log(result);
  });

task("unstake", "unstakes tokens")
  .addParam("account", "staker's account")
  .addParam("amount", "un-staking amount")
  .setAction(async (taskArgs: { amount: any; account: any }, hre) => {
    const amount = hre.ethers.utils.parseUnits(taskArgs.amount, 18);
    const account = taskArgs.account;
    const staking = await hre.ethers.getContractAt(
      "StakingRewards",
      STAKING_CONTRACT_ADDRESS
    );

    let result = await staking.connect(account[0]).unstake(amount);
    console.log(result);
  });

task("claim", "claims rewards")
  .addParam("account", "staker's account")
  .setAction(async (taskArgs: { account: any }, hre) => {
    const account = taskArgs.account;
    const staking = await hre.ethers.getContractAt(
      "StakingRewards",
      STAKING_CONTRACT_ADDRESS
    );

    let result = await staking.connect(account[0]).claim();
    console.log(result);
  });

task("check-staking-balance", "Returns the amount of staken tokens")
  .addParam("account", "staker's address")
  .setAction(async (taskArgs: { account: any }, hre) => {
    const account = taskArgs.account;
    const staking = await hre.ethers.getContractAt(
      "StakingRewards",
      STAKING_CONTRACT_ADDRESS
    );
    const balance = await staking.getStake(account);
    const balance_formatted = hre.ethers.utils.formatUnits(balance, 18);
    console.log(balance_formatted);
  });
