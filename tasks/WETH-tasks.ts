import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();
const WETH_CONTRACT_ADDRESS: string = process.env
  .WETH_CONTRACT_ADDRESS as string;

task("deposit", "deposit eth")
  .addParam("amount", "deposit amount")
  // .addParam("account", "user address")
  .setAction(async (taskArgs: { amount: any; account: any }, hre) => {
    const weth = await hre.ethers.getContractAt("WETH", WETH_CONTRACT_ADDRESS);
    const account = await hre.ethers.getSigners();
    const amount = hre.ethers.utils.parseUnits(taskArgs.amount, 18);

    await weth.connect(account[0]).approve(weth.address, amount);
    console.log("approve completed");
    let result = await weth.connect(account[0]).deposit({ value: amount });
    console.log("deposit completed");
    console.log(result);
  });

// task("withdraw", "withdraws weth")
//   .addParam("amount", "The amount to trasfer")
//   .setAction(async (taskArgs: { account: any; amount: any }, hre) => {
//     const account = taskArgs.account;
//     const contract = await hre.ethers.getContractAt(
//       "WETH",
//       WETH_CONTRACT_ADDRESS
//     );
//     const amount = hre.ethers.utils.parseUnits(
//       taskArgs.amount,
//       await contract.decimals()
//     );
//     const signer = await hre.ethers.getSigners();
//     console.log("amount is", amount);

//     let result = await contract.connect(signer[0]).mint(account, amount);
//     console.log(result);
//   });
