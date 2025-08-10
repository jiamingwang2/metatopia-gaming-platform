import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  WalletState,
  WalletActions,
  WalletContextType,
  WalletBalance,
  WalletAddress,
  Transaction,
  WalletStats,
  CryptoCurrency,
  DepositRequest,
  WithdrawRequest,
  TransactionFilters,
  WalletConfig,
  SecuritySettings,
  CryptoInfo
} from '../types/wallet';

// 钱包操作类型
type WalletAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BALANCES'; payload: WalletBalance[] }
  | { type: 'SET_ADDRESSES'; payload: WalletAddress[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_STATS'; payload: WalletStats }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_ADDRESS'; payload: WalletAddress };

// 初始状态
const initialState: WalletState = {
  balances: [],
  addresses: [],
  transactions: [],
  stats: {
    totalValueUSD: 0,
    totalDeposits: 0,
    totalWithdraws: 0,
    totalTransactions: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  },
  isLoading: false,
  error: null
};

// 钱包配置
const walletConfig: WalletConfig = {
  supportedCurrencies: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      decimals: 8,
      minDeposit: 0.0001,
      minWithdraw: 0.001,
      withdrawFee: 0.0005,
      network: ['Bitcoin'],
      price: 45000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      decimals: 18,
      minDeposit: 0.01,
      minWithdraw: 0.01,
      withdrawFee: 0.005,
      network: ['Ethereum'],
      price: 3000
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      icon: '₮',
      decimals: 6,
      minDeposit: 10,
      minWithdraw: 10,
      withdrawFee: 1,
      network: ['Ethereum', 'Tron', 'BSC'],
      price: 1
    }
  ],
  networks: {
    BTC: ['Bitcoin'],
    ETH: ['Ethereum'],
    USDT: ['Ethereum', 'Tron', 'BSC'],
    BNB: ['BSC'],
    ADA: ['Cardano'],
    DOT: ['Polkadot']
  },
  fees: {
    BTC: 0.0005,
    ETH: 0.005,
    USDT: 1,
    BNB: 0.001,
    ADA: 1,
    DOT: 0.1
  },
  limits: {
    minDeposit: {
      BTC: 0.0001,
      ETH: 0.01,
      USDT: 10,
      BNB: 0.01,
      ADA: 10,
      DOT: 1
    },
    minWithdraw: {
      BTC: 0.001,
      ETH: 0.01,
      USDT: 10,
      BNB: 0.01,
      ADA: 10,
      DOT: 1
    },
    maxWithdraw: {
      BTC: 10,
      ETH: 100,
      USDT: 100000,
      BNB: 1000,
      ADA: 100000,
      DOT: 10000
    }
  }
};

// 安全设置
const securitySettings: SecuritySettings = {
  twoFactorEnabled: false,
  withdrawalWhitelist: [],
  dailyWithdrawLimit: 50000,
  requireConfirmationForLargeAmounts: true,
  largeAmountThreshold: 10000
};

// Reducer函数
function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_BALANCES':
      return { ...state, balances: action.payload };
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.id === action.payload.id ? action.payload : tx
        )
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload]
      };
    default:
      return state;
  }
}

// 创建Context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// 模拟API调用
const mockApiDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Provider组件
export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // 模拟获取余额
  const fetchBalances = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(800);
      const mockBalances: WalletBalance[] = [
        {
          currency: 'BTC',
          available: 0.5234,
          frozen: 0.0123,
          total: 0.5357
        },
        {
          currency: 'ETH',
          available: 2.8945,
          frozen: 0.1055,
          total: 3.0000
        },
        {
          currency: 'USDT',
          available: 15420.50,
          frozen: 579.50,
          total: 16000.00
        }
      ];
      dispatch({ type: 'SET_BALANCES', payload: mockBalances });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取余额失败' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 刷新单个币种余额
  const refreshBalance = async (currency: CryptoCurrency): Promise<void> => {
    // 实现单个币种余额刷新逻辑
    await fetchBalances();
  };

  // 生成钱包地址
  const generateAddress = async (currency: CryptoCurrency, network: string): Promise<WalletAddress> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(1200);
      const newAddress: WalletAddress = {
        id: `addr_${Date.now()}`,
        currency,
        address: `${currency.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
        network,
        isDefault: state.addresses.filter(addr => addr.currency === currency).length === 0,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_ADDRESS', payload: newAddress });
      return newAddress;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '生成地址失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 获取地址列表
  const getAddresses = async (currency?: CryptoCurrency): Promise<WalletAddress[]> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(600);
      const mockAddresses: WalletAddress[] = [
        {
          id: 'addr_1',
          currency: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          network: 'Bitcoin',
          isDefault: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'addr_2',
          currency: 'ETH',
          address: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
          network: 'Ethereum',
          isDefault: true,
          createdAt: '2024-01-15T10:35:00Z'
        }
      ];
      const filteredAddresses = currency 
        ? mockAddresses.filter(addr => addr.currency === currency)
        : mockAddresses;
      dispatch({ type: 'SET_ADDRESSES', payload: filteredAddresses });
      return filteredAddresses;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取地址失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 设置默认地址
  const setDefaultAddress = async (addressId: string): Promise<void> => {
    // 实现设置默认地址逻辑
    await mockApiDelay(500);
  };

  // 充值
  const deposit = async (request: DepositRequest): Promise<Transaction> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(1000);
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'deposit',
        currency: request.currency,
        amount: request.amount,
        fee: 0,
        status: 'pending',
        network: request.network,
        confirmations: 0,
        requiredConfirmations: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: request.note
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      return transaction;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '充值失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 提现
  const withdraw = async (request: WithdrawRequest): Promise<Transaction> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(1500);
      const fee = walletConfig.fees[request.currency];
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'withdraw',
        currency: request.currency,
        amount: request.amount,
        fee,
        status: 'pending',
        toAddress: request.toAddress,
        network: request.network,
        confirmations: 0,
        requiredConfirmations: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: request.note
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      return transaction;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '提现失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 获取交易记录
  const getTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(800);
      const mockTransactions: Transaction[] = [
        {
          id: 'tx_1',
          type: 'deposit',
          currency: 'BTC',
          amount: 0.1,
          fee: 0,
          status: 'confirmed',
          network: 'Bitcoin',
          confirmations: 6,
          requiredConfirmations: 6,
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:30:00Z'
        },
        {
          id: 'tx_2',
          type: 'withdraw',
          currency: 'ETH',
          amount: 1.5,
          fee: 0.005,
          status: 'confirmed',
          toAddress: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
          network: 'Ethereum',
          confirmations: 12,
          requiredConfirmations: 12,
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:45:00Z'
        }
      ];
      dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
      return mockTransactions;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取交易记录失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 获取单个交易
  const getTransaction = async (txId: string): Promise<Transaction> => {
    const transaction = state.transactions.find(tx => tx.id === txId);
    if (!transaction) {
      throw new Error('交易不存在');
    }
    return transaction;
  };

  // 获取统计信息
  const getStats = async (): Promise<WalletStats> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await mockApiDelay(600);
      const stats: WalletStats = {
        totalValueUSD: 78420.50,
        totalDeposits: 25,
        totalWithdraws: 12,
        totalTransactions: 37,
        profitLoss: 12450.30,
        profitLossPercentage: 18.85
      };
      dispatch({ type: 'SET_STATS', payload: stats });
      return stats;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取统计信息失败' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 验证地址
  const validateAddress = (address: string, currency: CryptoCurrency): boolean => {
    // 简单的地址验证逻辑
    const patterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^0x[a-fA-F0-9]{40}$|^T[A-Za-z1-9]{33}$/,
      BNB: /^0x[a-fA-F0-9]{40}$/,
      ADA: /^addr1[a-z0-9]{58}$/,
      DOT: /^1[a-zA-Z0-9]{47}$/
    };
    return patterns[currency]?.test(address) || false;
  };

  // 估算手续费
  const estimateFee = async (currency: CryptoCurrency, amount: number): Promise<number> => {
    await mockApiDelay(300);
    return walletConfig.fees[currency];
  };

  // 初始化数据
  useEffect(() => {
    fetchBalances();
    getAddresses();
    getTransactions();
    getStats();
  }, []);

  const value: WalletContextType = {
    ...state,
    config: walletConfig,
    security: securitySettings,
    fetchBalances,
    refreshBalance,
    generateAddress,
    getAddresses,
    setDefaultAddress,
    deposit,
    withdraw,
    getTransactions,
    getTransaction,
    getStats,
    validateAddress,
    estimateFee
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook for using wallet context
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export default WalletContext;