// Contract configuration
import artifact from '../../artifacts/contracts/WeSave.sol/WeSave.json';

export const CONTRACT_CONFIG = {
  address: '0x3304c9729f62e2421751bd33902049700c683296',
  abi: artifact.abi
};

export const GOAL_STATUS = {
  ACTIVE: 0,
  COMPLETED: 1,
  EXPIRED: 2,
  DELETED: 3
};

export const TRANSACTION_TYPE = {
  DEPOSIT: 0,
  WITHDRAWAL: 1
};
