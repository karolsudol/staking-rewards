import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

async function main() {
  const deployer = OWNER_ADDRESS;
  console.log("Deploying contract with the account:", deployer);

  const TokenERC20 = await ethers.getContractFactory("TokenERC20");
  const erc20 = await TokenERC20.deploy("TokenERC20", "TKN");

  await erc20.deployed();

  console.log("ERC20 deployed to:", erc20.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
