const hre = require("hardhat");

async function main() {
  const INITIAL_SUPPLY = 10_000_000; // 10 million KPNG tokens
  
  console.log("Deploying KampungCoin contract...");
  
  const KampungCoin = await hre.ethers.getContractFactory("KampungCoin");
  const kampungCoin = await KampungCoin.deploy(INITIAL_SUPPLY);
  
  await kampungCoin.waitForDeployment();
  
  const contractAddress = await kampungCoin.getAddress();
  
  console.log(`KampungCoin deployed to: ${contractAddress}`);
  console.log(`Initial supply: ${INITIAL_SUPPLY} KPNG`);
  console.log(`Max supply: 100,000,000 KPNG`);
  console.log(`Deployer address: ${(await hre.ethers.provider.getSigner()).address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
