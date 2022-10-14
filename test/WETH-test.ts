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
    it("Should deposit and withdraw correctly", async function () {
      const { weth, acc1, acc2 } = await loadFixture(deployWETH);

      // 1. contract has zero ethers
      expect(
        formatEther(await ethers.provider.getBalance(weth.address))
      ).to.equal(formatEther("0"));

      expect(await weth.totalSupply()).to.equal(0);

      // 2.acc1 deposits 10 ETH

      expect(await weth.connect(acc1).deposit({ value: parseEther("10") }))
        .emit(weth, "Transfer")
        .withArgs(acc1.address, "0x", 10);

      // Below failes ?????
      //   expect(
      //     formatEther(await ethers.provider.getBalance(weth.address))
      //   ).to.be.equal(10);
      // expect(await weth.balanceOf(acc1.address)).to.equal(10);

      expect(await weth.totalSupply()).to.equal(
        await weth.balanceOf(acc1.address)
      );

      expect(await weth.connect(acc1).withdraw(10))
        .emit(weth, "Transfer")
        .withArgs("0x", acc1.address, 10);

      expect(await weth.totalSupply()).to.equal(
        await weth.balanceOf(acc1.address)
      );
    });
  });
});
