# Deployment Guide for Kampung Coin

This guide will walk you through deploying the Kampung Coin smart contract to various Ethereum networks.

## Prerequisites

1. Node.js and npm installed
2. MetaMask or another Ethereum wallet
3. ETH for gas fees (on mainnet or testnet)
4. Infura/Alchemy account (for remote deployment)

## Local Deployment (Testing)

### Step 1: Start Local Node

```bash
npm run node
```

This starts a local Hardhat network on `localhost:8545`.

### Step 2: Deploy to Local Network

In a new terminal:

```bash
npm run deploy:localhost
```

You should see output like:
```
Deploying KampungCoin contract...
KampungCoin deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Initial supply: 10000000 KPNG
Max supply: 100,000,000 KPNG
```

## Testnet Deployment

### Step 1: Get Testnet ETH

1. **Goerli**: https://goerlifaucet.com/
2. **Sepolia**: https://sepoliafaucet.com/

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add:
```env
PRIVATE_KEY=your_wallet_private_key_here
INFURA_API_KEY=your_infura_api_key
```

**⚠️ WARNING**: Never commit `.env` file with real private keys!

### Step 3: Update Hardhat Config

Add network configuration to `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### Step 4: Deploy to Testnet

```bash
# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

## Mainnet Deployment

**⚠️ IMPORTANT**: Deploying to mainnet costs real ETH. Make sure you:
1. Have thoroughly tested on testnet
2. Have enough ETH for gas fees
3. Have audited the contract (for production use)
4. Understand the risks

### Steps

1. Add mainnet configuration to `hardhat.config.js`:
```javascript
mainnet: {
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  accounts: [process.env.PRIVATE_KEY],
  gasPrice: 20000000000, // 20 gwei, adjust as needed
}
```

2. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

3. **VERIFY** the deployment:
   - Check the contract address on Etherscan
   - Verify the bytecode matches
   - Test basic functions (view only)

## Post-Deployment

### Verify Contract on Etherscan

1. Get Etherscan API key from https://etherscan.io/apis

2. Add to `.env`:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Verify contract:
```bash
npx hardhat verify --network <network-name> <contract-address> <initial-supply>

# Example for Goerli
npx hardhat verify --network goerli 0x123...abc 10000000
```

### Interact with Deployed Contract

Using Hardhat console:
```bash
npx hardhat console --network <network-name>
```

Then in the console:
```javascript
const KampungCoin = await ethers.getContractFactory("KampungCoin");
const kampungCoin = await KampungCoin.attach("0x..."); // Your contract address
const balance = await kampungCoin.balanceOf("0x..."); // Your address
console.log("Balance:", ethers.formatEther(balance));
```

## Troubleshooting

### Gas Price Too Low
If transaction is stuck, increase `gasPrice` in network config.

### Insufficient Funds
Make sure you have enough ETH for gas fees.

### Nonce Issues
If nonce gets out of sync, reset MetaMask account or use:
```bash
npx hardhat clean
```

### Compilation Errors
If you get compiler download errors (blocked domains), use:
```bash
npx solcjs --bin --abi --include-path node_modules/ --base-path . contracts/KampungCoin.sol
```

## Security Checklist

Before mainnet deployment:

- [ ] Contract audited by professionals
- [ ] Tested on multiple testnets
- [ ] All tests passing
- [ ] Gas costs optimized
- [ ] Owner key secured (hardware wallet recommended)
- [ ] Emergency procedures documented
- [ ] Team members notified
- [ ] Monitoring system in place

## Additional Resources

- [Hardhat Deployment Guide](https://hardhat.org/guides/deploying.html)
- [OpenZeppelin Defender](https://defender.openzeppelin.com/) - For automated operations
- [Tenderly](https://tenderly.co/) - For monitoring and debugging

## Support

If you encounter issues, please:
1. Check this guide first
2. Search existing GitHub issues
3. Open a new issue with details
