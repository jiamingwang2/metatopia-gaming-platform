// 加密货币类型
export type CryptoCurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'ADA' | 'DOT';

// 交易类型
export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'trade';

// 交易状态
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

// 网络类型
export type NetworkType = 'mainnet' | 'testnet';

// 加密货币信息
export interface CryptoInfo {
  symbol: CryptoCurrency;
  name: string;
  icon: string;
  decimals: number;
  minDeposit: number;
  minWithdraw: number;
  withdrawFee: number;
  network: string[];
  price: number; // USD价格
}

// 钱包余额
export interface WalletBalance {
  currency: CryptoCurrency;
  available: number; // 可用余额
  frozen: number; // 冻结余额
  total: number; // 总余额
}

// 钱包地址
export interface WalletAddress {
  id: string;
  currency: CryptoCurrency;
  address: string;
  network: string;
  label?: string;
  isDefault: boolean;
  createdAt: string;
}

// 交易记录
export interface Transaction {
  id: string;
  type: TransactionType;
  currency: CryptoCurrency;
  amount: number;
  fee: number;
  status: TransactionStatus;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  network: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  updatedAt: string;
  note?: string;
}

// 充值请求
export interface DepositRequest {
  currency: CryptoCurrency;
  network: string;
  amount: number;
  note?: string;
}

// 提现请求
export interface WithdrawRequest {
  currency: CryptoCurrency;
  network: string;
  toAddress: string;
  amount: number;
  note?: string;
  twoFactorCode?: string;
}

// 钱包统计
export interface WalletStats {
  totalValueUSD: number;
  totalDeposits: number;
  totalWithdraws: number;
  totalTransactions: number;
  profitLoss: number;
  profitLossPercentage: number;
}

// 钱包状态
export interface WalletState {
  balances: WalletBalance[];
  addresses: WalletAddress[];
  transactions: Transaction[];
  stats: WalletStats;
  isLoading: boolean;
  error: string | null;
}

// 钱包操作接口
export interface WalletActions {
  getBalances: () => Promise<WalletBalance[]>;
  getAddresses: () => Promise<WalletAddress[]>;
  getTransactions: (filters?: TransactionFilters) => Promise<Transaction[]>;
  generateAddress: (currency: CryptoCurrency, network: string) => Promise<WalletAddress>;
  deposit: (request: DepositRequest) => Promise<Transaction>;
  withdraw: (request: WithdrawRequest) => Promise<Transaction>;
  getTransactionStatus: (txId: string) => Promise<Transaction>;
  refreshBalances: () => Promise<void>;
}

// 钱包上下文类型
export interface WalletContextType {
  state: WalletState;
  actions: WalletActions;
}

// 交易过滤器
export interface TransactionFilters {
  currency?: CryptoCurrency;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// 钱包配置
export interface WalletConfig {
  supportedCurrencies: CryptoInfo[];
  networks: Record<CryptoCurrency, string[]>;
  fees: Record<CryptoCurrency, number>;
  confirmations: Record<CryptoCurrency, number>;
  apiEndpoints: {
    balance: string;
    transactions: string;
    deposit: string;
    withdraw: string;
    addresses: string;
  };
}

// 安全设置
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  withdrawalWhitelist: string[];
  dailyWithdrawLimit: Record<CryptoCurrency, number>;
  sessionTimeout: number;
  ipWhitelist: string[];
}