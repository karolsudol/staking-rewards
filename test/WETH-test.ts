import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

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

      const acc1Balance = await weth.balanceOf(acc1.address);
      const totalSupply = await weth.totalSupply();

      // revert
      await expect(
        weth.connect(acc1).deposit({ value: ethers.utils.parseEther("1.0") })
      ).to.be.revertedWith("only owner");
    });

    it("Should withdraw correctly", async function () {
      const { weth, owner, acc1 } = await loadFixture(deployWETH);

      const acc1Balance = await weth.balanceOf(acc1.address);
      const totalSupply = await weth.totalSupply();

      // revert
      await expect(
        weth.connect(acc1).deposit({ value: ethers.utils.parseEther("1.0") })
      ).to.be.revertedWith("only owner");
    });
  });
});
