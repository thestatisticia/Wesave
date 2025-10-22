const hre = require("hardhat");

async function main() {
  console.log("Deploying WeSave contract to", hre.network.name, "...");

  const WeSave = await hre.ethers.getContractFactory("WeSave");
  const weSave = await WeSave.deploy();
  await weSave.waitForDeployment();

  const address = await weSave.getAddress();
  console.log("WeSave contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
