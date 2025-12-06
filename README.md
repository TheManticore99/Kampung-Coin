# Kampung Coin (KPNG) 🪙

Kampung Coin is an ERC-20 compliant cryptocurrency token built on the Ethereum blockchain. This is a learning project ("project iseng-iseng") to explore smart contract development and blockchain technology.

## 🌟 Features

- **ERC-20 Standard**: Full compliance with the ERC-20 token standard
- **Burnable**: Token holders can burn (destroy) their tokens
- **Mintable**: Contract owner can mint new tokens (up to max supply)
- **Ownership Control**: Built-in ownership management using OpenZeppelin's Ownable
- **Maximum Supply**: Capped at 100 million KPNG tokens
- **Security**: Built using industry-standard OpenZeppelin contracts

## 📋 Token Details

- **Name**: Kampung Coin
- **Symbol**: KPNG
- **Decimals**: 18
- **Initial Supply**: 10,000,000 KPNG
- **Maximum Supply**: 100,000,000 KPNG
- **Compiler Version**: Solidity ^0.8.20

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheManticore99/Kampung-Coin.git
cd Kampung-Coin
```

2. Install dependencies:
```bash
npm install
```

### Compilation

Compile the smart contract:
```bash
npm run compile
```

Or using solcjs directly:
```bash
npx solcjs --bin --abi --include-path node_modules/ --base-path . contracts/KampungCoin.sol
```

### Testing

Run the test suite:
```bash
npm test
```

### Deployment

Deploy to a local Hardhat network:
```bash
# In one terminal, start a local node
npm run node

# In another terminal, deploy the contract
npm run deploy:localhost
```

Deploy to a specific network:
```bash
npm run deploy -- --network <network-name>
```

## 📁 Project Structure

```
Kampung-Coin/
├── contracts/
│   └── KampungCoin.sol       # Main token contract
├── scripts/
│   └── deploy.js              # Deployment script
├── test/
│   └── KampungCoin.test.js    # Comprehensive test suite
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🔒 Smart Contract Functions

### Public Functions

- `transfer(address to, uint256 amount)`: Transfer tokens to another address
- `approve(address spender, uint256 amount)`: Approve an address to spend tokens
- `transferFrom(address from, address to, uint256 amount)`: Transfer tokens on behalf of another address
- `burn(uint256 amount)`: Burn (destroy) your tokens
- `burnFrom(address account, uint256 amount)`: Burn tokens from an approved address

### Owner-Only Functions

- `mint(address to, uint256 amount)`: Mint new tokens (up to max supply)
- `transferOwnership(address newOwner)`: Transfer contract ownership

### View Functions

- `balanceOf(address account)`: Get token balance of an address
- `totalSupply()`: Get total supply of tokens
- `allowance(address owner, address spender)`: Get approved amount
- `name()`: Get token name
- `symbol()`: Get token symbol
- `decimals()`: Get token decimals
- `maxSupply()`: Get maximum supply
- `MAX_SUPPLY()`: Maximum supply constant

## 🧪 Test Coverage

The project includes comprehensive tests covering:
- ✅ Deployment and initialization
- ✅ Token transfers
- ✅ Minting functionality
- ✅ Burning mechanism
- ✅ Ownership management
- ✅ ERC-20 standard compliance
- ✅ Edge cases and error handling

## 🔐 Security Considerations

This contract implements several security best practices:
- Uses OpenZeppelin's audited contract libraries
- Implements access control through ownership
- Has a maximum supply cap to prevent unlimited inflation
- Includes comprehensive test coverage
- Uses Solidity 0.8.20 with built-in overflow protection

**Note**: This is a learning project. For production use, consider:
- Professional security audit
- Multi-signature wallet for ownership
- Timelock mechanisms for critical functions
- Additional testing on testnets

## 🛠️ Technology Stack

- **Solidity**: Smart contract programming language
- **Hardhat**: Ethereum development environment
- **OpenZeppelin**: Secure smart contract library
- **Ethers.js**: Ethereum library for JavaScript
- **Chai**: Testing framework

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are always welcome! Feel free to:
- Open an issue for bugs or suggestions
- Submit a pull request with improvements
- Share your thoughts on the implementation

## 📧 Contact

Project Creator: TheManticore99

---

**Disclaimer**: This is a learning/hobby project ("project iseng-iseng"). Use at your own risk. Not financial advice.
