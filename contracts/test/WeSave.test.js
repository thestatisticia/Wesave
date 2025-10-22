const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeSave Contract", function () {
  let weSave;
  let owner;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();
    
    const WeSave = await ethers.getContractFactory("WeSave");
    weSave = await WeSave.deploy();
    await weSave.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await weSave.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await weSave.name()).to.equal("WeSave Milestone");
      expect(await weSave.symbol()).to.equal("WSM");
    });
  });

  describe("Goal Creation", function () {
    it("Should create a goal successfully", async function () {
      const goalName = "Test Goal";
      const goalDescription = "Test Description";
      const targetAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const category = "Test";

      await expect(
        weSave.connect(user1).createGoal(
          goalName,
          goalDescription,
          targetAmount,
          deadline,
          category
        )
      ).to.emit(weSave, "GoalCreated");

      const goal = await weSave.getGoal(1);
      expect(goal.owner).to.equal(user1.address);
      expect(goal.name).to.equal(goalName);
      expect(goal.targetAmount).to.equal(targetAmount);
      expect(goal.status).to.equal(0); // Active
    });

    it("Should reject goal creation with invalid parameters", async function () {
      const targetAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      // Empty name
      await expect(
        weSave.connect(user1).createGoal(
          "",
          "Description",
          targetAmount,
          deadline,
          "Category"
        )
      ).to.be.revertedWith("Invalid name length");

      // Past deadline
      await expect(
        weSave.connect(user1).createGoal(
          "Goal",
          "Description",
          targetAmount,
          Math.floor(Date.now() / 1000) - 86400,
          "Category"
        )
      ).to.be.revertedWith("Deadline must be in the future");

      // Invalid target amount
      await expect(
        weSave.connect(user1).createGoal(
          "Goal",
          "Description",
          ethers.utils.parseEther("0.0001"), // Too small
          deadline,
          "Category"
        )
      ).to.be.revertedWith("Invalid target amount");
    });
  });

  describe("Deposits", function () {
    let goalId;
    const targetAmount = ethers.utils.parseEther("1");
    const depositAmount = ethers.utils.parseEther("0.1");

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await weSave.connect(user1).createGoal(
        "Test Goal",
        "Test Description",
        targetAmount,
        deadline,
        "Test"
      );
      goalId = 1;
    });

    it("Should allow deposits to active goals", async function () {
      await expect(
        weSave.connect(user1).deposit(goalId, "Test deposit", {
          value: depositAmount
        })
      ).to.emit(weSave, "DepositMade");

      const goal = await weSave.getGoal(goalId);
      expect(goal.currentAmount).to.equal(depositAmount);
    });

    it("Should reject deposits from non-owners", async function () {
      await expect(
        weSave.connect(user2).deposit(goalId, "Test deposit", {
          value: depositAmount
        })
      ).to.be.revertedWith("Not goal owner");
    });

    it("Should reject deposits that exceed target amount", async function () {
      const excessAmount = targetAmount.add(ethers.utils.parseEther("0.1"));
      
      await expect(
        weSave.connect(user1).deposit(goalId, "Test deposit", {
          value: excessAmount
        })
      ).to.be.revertedWith("Deposit would exceed target amount");
    });
  });

  describe("Milestones", function () {
    let goalId;
    const targetAmount = ethers.utils.parseEther("1");

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await weSave.connect(user1).createGoal(
        "Test Goal",
        "Test Description",
        targetAmount,
        deadline,
        "Test"
      );
      goalId = 1;
    });

    it("Should trigger milestone when 25% is reached", async function () {
      const quarterAmount = targetAmount.div(4);
      
      await expect(
        weSave.connect(user1).deposit(goalId, "Quarter deposit", {
          value: quarterAmount
        })
      ).to.emit(weSave, "MilestoneReached");

      const milestones = await weSave.getGoalMilestones(goalId);
      expect(milestones[0].reached).to.be.true;
    });

    it("Should mint NFT for milestone", async function () {
      const quarterAmount = targetAmount.div(4);
      
      await weSave.connect(user1).deposit(goalId, "Quarter deposit", {
        value: quarterAmount
      });

      const balance = await weSave.balanceOf(user1.address);
      expect(balance).to.equal(1);
    });
  });

  describe("Goal Completion", function () {
    let goalId;
    const targetAmount = ethers.utils.parseEther("1");

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await weSave.connect(user1).createGoal(
        "Test Goal",
        "Test Description",
        targetAmount,
        deadline,
        "Test"
      );
      goalId = 1;
    });

    it("Should complete goal when target is reached", async function () {
      await expect(
        weSave.connect(user1).deposit(goalId, "Full deposit", {
          value: targetAmount
        })
      ).to.emit(weSave, "GoalCompleted");

      const goal = await weSave.getGoal(goalId);
      expect(goal.status).to.equal(1); // Completed
    });
  });

  describe("Withdrawals", function () {
    let goalId;
    const targetAmount = ethers.utils.parseEther("1");
    const depositAmount = ethers.utils.parseEther("0.5");
    const withdrawalAmount = ethers.utils.parseEther("0.2");

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await weSave.connect(user1).createGoal(
        "Test Goal",
        "Test Description",
        targetAmount,
        deadline,
        "Test"
      );
      goalId = 1;
      
      await weSave.connect(user1).deposit(goalId, "Initial deposit", {
        value: depositAmount
      });
    });

    it("Should allow withdrawals with fee", async function () {
      const initialBalance = await user1.getBalance();
      
      await expect(
        weSave.connect(user1).withdraw(goalId, withdrawalAmount, "Test withdrawal")
      ).to.emit(weSave, "WithdrawalMade");

      const goal = await weSave.getGoal(goalId);
      expect(goal.currentAmount).to.equal(depositAmount.sub(withdrawalAmount));
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const excessAmount = depositAmount.add(ethers.utils.parseEther("0.1"));
      
      await expect(
        weSave.connect(user1).withdraw(goalId, excessAmount, "Test withdrawal")
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Goal Deletion", function () {
    let goalId;
    const targetAmount = ethers.utils.parseEther("1");
    const depositAmount = ethers.utils.parseEther("0.3");

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await weSave.connect(user1).createGoal(
        "Test Goal",
        "Test Description",
        targetAmount,
        deadline,
        "Test"
      );
      goalId = 1;
      
      await weSave.connect(user1).deposit(goalId, "Initial deposit", {
        value: depositAmount
      });
    });

    it("Should delete goal and refund balance", async function () {
      const initialBalance = await user1.getBalance();
      
      await expect(
        weSave.connect(user1).deleteGoal(goalId)
      ).to.emit(weSave, "GoalDeleted");

      const goal = await weSave.getGoal(goalId);
      expect(goal.status).to.equal(2); // Cancelled
    });
  });

  describe("Pause/Unpause", function () {
    it("Should pause and unpause contract", async function () {
      await weSave.pause();
      expect(await weSave.paused()).to.be.true;

      await weSave.unpause();
      expect(await weSave.paused()).to.be.false;
    });

    it("Should reject operations when paused", async function () {
      await weSave.pause();
      
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await expect(
        weSave.connect(user1).createGoal(
          "Test Goal",
          "Test Description",
          ethers.utils.parseEther("1"),
          deadline,
          "Test"
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Access Control", function () {
    it("Should reject non-owner pause operations", async function () {
      await expect(
        weSave.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should reject non-owner emergency withdrawals", async function () {
      await expect(
        weSave.connect(user1).emergencyWithdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
