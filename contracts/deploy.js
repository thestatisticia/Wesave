const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying WeSave contract...");

  // Get the contract factory
  const WeSave = await ethers.getContractFactory("WeSave");

  // Deploy the contract
  const weSave = await WeSave.deploy();

  // Wait for deployment to finish
  await weSave.deployed();

  console.log("WeSave contract deployed to:", weSave.address);
  console.log("Transaction hash:", weSave.deployTransaction.hash);
  
  // Verify contract on blockchain explorer (if needed)
  console.log("\nTo verify the contract, run:");
  console.log(`npx hardhat verify --network alfajores ${weSave.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
