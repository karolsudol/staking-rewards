import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { formatEther, parseEther } from "ethers/lib/utils";

import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

describe("CONTRACT:WETH", function () {
  async function deployWETH() {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();

    return { owner, acc1, acc2, weth };
  }

  describe("DEPOSIT-WITHDRAW", function () {
    it("Should deposit correctly", async function () {
      const { weth, owner, acc1 } = await loadFixture(deployWETH);

      // 1. contract has zero ethers
      expect(
        formatEther(await ethers.provider.getBalance(weth.address))
      ).to.equal(formatEther("0"));

      // 2.acc1 deposits 10 ETH
      // weth.connect(acc1).deposit({ value: parseEther("1")
    });

    it("Should withdraw correctly", async function () {
      const { weth, owner, acc1 } = await loadFixture(deployWETH);

      const acc1Balance = await weth.balanceOf(acc1.address);
      const totalSupply = await weth.totalSupply();

      // revert
      await expect(weth.connect(acc1).withdraw(1)).to.be.revertedWith(
        "only owner"
      );
    });
  });
});
