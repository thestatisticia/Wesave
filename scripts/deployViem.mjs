import { readFileSync } from 'fs';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

const pk = process.env.PRIVATE_KEY;
if (!pk) {
  console.error('Missing PRIVATE_KEY in .env');
  process.exit(1);
}

const account = privateKeyToAccount('0x' + pk.replace(/^0x/, ''));

const artifactPath = './artifacts/contracts/WeSave.sol/WeSave.json';
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
const abi = artifact.abi;
const bytecode = artifact.bytecode;

const walletClient = createWalletClient({
  account,
  chain: celoAlfajores,
  transport: http('https://alfajores-forno.celo-testnet.org')
});

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http('https://alfajores-forno.celo-testnet.org')
});

async function main() {
  console.log('Deploying WeSave to Celo Alfajores...');
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [],
  });
  console.log('Deployment tx hash:', hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Deployed at:', receipt.contractAddress);
  console.log('Set VITE_CONTRACT_ADDRESS to this value for frontend.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
