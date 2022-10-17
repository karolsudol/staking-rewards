import { ethers } from "hardhat";

async function main() {
  console.log("Deploying WETH contract ...");

  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();

  await weth.deployed();
  console.log("WETH contract deployed to:", weth.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
