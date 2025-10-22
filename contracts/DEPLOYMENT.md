# WeSave Smart Contract Deployment Guide

## 📋 Prerequisites

### **Required Software**
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### **Required Accounts**
- Celo Alfajores testnet account
- Private key with testnet CELO tokens
- CeloScan API key (optional, for contract verification)

## 🚀 Installation & Setup

### **1. Install Dependencies**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
npm install dotenv
```

### **2. Environment Configuration**
Create a `.env` file in the project root:
```env
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

### **3. Get Testnet Tokens**
Visit the Celo Alfajores Faucet:
- [Official Faucet](https://faucet.celo.org/alfajores)
- [Chainlink Faucet](https://faucets.chain.link/celo-alfajores-testnet)

## 🔧 Contract Configuration

### **Network Configuration**
The contract is configured for:
- **Celo Alfajores Testnet**: Chain ID 44787
- **Celo Mainnet**: Chain ID 42220
- **Local Development**: Chain ID 1337

### **Contract Parameters**
- **Minimum Goal Amount**: 0.001 ETH
- **Maximum Goal Amount**: 100 ETH
- **Minimum Deposit**: 0.001 ETH
- **Maximum Deposit**: 10 ETH
- **Maximum Goals per User**: 20
- **Withdrawal Fee**: 0.5%
- **Milestone Percentages**: 25%, 50%, 75%, 100%

## 🧪 Testing

### **Run Tests**
```bash
npx hardhat test
```

### **Test Coverage**
```bash
npx hardhat coverage
```

### **Gas Usage Analysis**
```bash
REPORT_GAS=true npx hardhat test
```

## 📦 Compilation

### **Compile Contracts**
```bash
npx hardhat compile
```

### **Clean Build**
```bash
npx hardhat clean
npx hardhat compile
```

## 🚀 Deployment

### **Deploy to Celo Alfajores Testnet**
```bash
npx hardhat run scripts/deploy.js --network alfajores
```

### **Deploy to Celo Mainnet**
```bash
npx hardhat run scripts/deploy.js --network celo
```

### **Deploy to Local Network**
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## ✅ Contract Verification

### **Verify on CeloScan**
```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

### **Verify with Constructor Arguments**
```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> "constructor_arg1" "constructor_arg2"
```

## 🔍 Deployment Verification

### **Check Deployment**
1. Visit [CeloScan](https://alfajores.celoscan.io/) for testnet
2. Search for your contract address
3. Verify contract source code
4. Check contract functions and events

### **Test Contract Functions**
1. Create a test goal
2. Make a deposit
3. Check milestone triggering
4. Test goal completion
5. Verify NFT minting

## 📊 Post-Deployment

### **Contract Interaction**
```javascript
// Example contract interaction
const contract = await ethers.getContractAt("WeSave", contractAddress);

// Create a goal
await contract.createGoal(
  "Test Goal",
  "Test Description",
  ethers.utils.parseEther("1"),
  Math.floor(Date.now() / 1000) + 86400,
  "Test"
);

// Make a deposit
await contract.deposit(1, "Test deposit", {
  value: ethers.utils.parseEther("0.1")
});
```

### **Monitoring**
- Monitor contract events
- Track user interactions
- Monitor gas usage
- Check for any errors or issues

## 🛡️ Security Checklist

### **Pre-Deployment**
- [ ] Code review completed
- [ ] Tests passing
- [ ] Gas optimization verified
- [ ] Security audit completed
- [ ] Documentation updated

### **Post-Deployment**
- [ ] Contract verified on CeloScan
- [ ] Functions tested
- [ ] Events monitoring set up
- [ ] User documentation provided
- [ ] Support channels established

## 🔄 Maintenance

### **Regular Tasks**
- Monitor contract performance
- Update documentation
- Review user feedback
- Security assessments
- Dependency updates

### **Emergency Procedures**
- Contract pause if needed
- Emergency withdrawal procedures
- User communication protocols
- Incident response plan

## 📞 Support

### **Resources**
- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)

### **Community**
- [Celo Discord](https://discord.gg/celo)
- [Celo Forum](https://forum.celo.org/)
- [GitHub Issues](https://github.com/celo-org/celo-monorepo/issues)

This deployment guide ensures a secure and successful deployment of the WeSave smart contract on the Celo blockchain.
