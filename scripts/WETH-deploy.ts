import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const STAKING_CONTRACT_ADDRESS: string = process.env.STAKING_CONTRACT_ADDRESS!;

async function main() {
  console.log("Deploying WETH contract with the account:", OWNER_ADDRESS);

  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();

  await weth.deployed();
  console.log("WETH contract deployed to:", weth.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
