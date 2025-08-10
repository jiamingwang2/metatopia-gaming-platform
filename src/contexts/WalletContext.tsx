import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WalletState, WalletAction, CryptoCurrency, WalletBalance, WalletTransaction, WalletStats, WalletAddress, DepositRequest, WithdrawRequest, WalletConfig } from '../types/wallet';

// 钱包配置
const walletConfig: WalletConfig = {
  supportedCurrencies: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 8,
      price: 45000,
      icon: '₿',
      network: 'Bitcoin'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      price: 3000,
      icon: 'Ξ',
      network: 'Ethereum'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      price: 1,
      icon: '₮',
      network: 'Ethereum'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      decimals: 18,
      price: 300,
      icon: 'B',
      network: 'BSC'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      decimals: 6,
      price: 0.5,
      icon: 'A',
      network: 'Cardano'
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      decimals: 10,
      price: 7,
      icon: '•',
      network: 'Polkadot'
    }
  ],
  supportedNetworks: [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      chainId: 0,
      rpcUrl: 'https://bitcoin.org',
      explorerUrl: 'https://blockstream.info'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io',
      explorerUrl: 'https://etherscan.io'
    },
    {
      name: 'BSC',
      symbol: 'BNB',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorerUrl: 'https://bscscan.com'
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      chainId: 1815,
      rpcUrl: 'https://cardano-mainnet.blockfrost.io',
      explorerUrl: 'https://cardanoscan.io'
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      chainId: 0,
      rpcUrl: 'https://rpc.polkadot.io',
      explorerUrl: 'https://polkascan.io'
    }
  ],
  fees: {
    deposit: {
      BTC: 0.0001,
      ETH: 0.001,
      USDT: 1,
      BNB: 0.001,
      ADA: 1,
      DOT: 0.01
    },
    withdraw: {
      BTC: 0.0005,
      ETH: 0.005,
      USDT: 5,
      BNB: 0.005,
      ADA: 2,
      DOT: 0.1
    }
  }
};

// 初始状态
const initialState: WalletState = {
  balances: [],
  addresses: [],
  transactions: [],
  stats: {
    totalValueUSD: 0,
    profitLoss: 0,
    profitLossPercentage: 0,
    totalDeposits: 0,
    totalWithdraws: 0
  },
  isLoading: false,
  error: null,
  config: walletConfig
};

// Action Types
type WalletActionType =
  | 'SET_LOADING'
  | 'SET_ERROR'
  | 'SET_BALANCES'
  | 'SET_ADDRESSES'
  | 'SET_TRANSACTIONS'
  | 'SET_STATS'
  | 'ADD_TRANSACTION'
  | 'UPDATE_BALANCE'
  | 'CLEAR_ERROR';

// Reducer
const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'SET_BALANCES':
      return {
        ...state,
        balances: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'SET_ADDRESSES':
      return {
        ...state,
        addresses: action.payload
      };
    
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    
    case 'UPDATE_BALANCE':
      return {
        ...state,
        balances: state.balances.map(balance =>
          balance.currency === action.payload.currency
            ? { ...balance, ...action.payload }
            : balance
        )
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Context
interface WalletContextType extends WalletState {
  fetchBalances: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  deposit: (request: DepositRequest) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  withdraw: (request: WithdrawRequest) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  generateAddress: (currency: CryptoCurrency) => Promise<{ success: boolean; address?: string; error?: string }>;
  refreshStats: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // 模拟API调用
  const mockApiCall = <T,>(data: T, delay: number = 1000): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  };

  // 获取余额
  const fetchBalances = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 模拟API调用
      const mockBalances: WalletBalance[] = [
        {
          currency: 'BTC',
          available: 0.5234,
          frozen: 0.0001,
          total: 0.5235
        },
        {
          currency: 'ETH',
          available: 12.8456,
          frozen: 0.1,
          total: 12.9456
        },
        {
          currency: 'USDT',
          available: 5000.25,
          frozen: 100,
          total: 5100.25
        },
        {
          currency: 'BNB',
          available: 25.75,
          frozen: 0,
          total: 25.75
        },
        {
          currency: 'ADA',
          available: 1000.5,
          frozen: 50,
          total: 1050.5
        },
        {
          currency: 'DOT',
          available: 150.25,
          frozen: 10,
          total: 160.25
        }
      ];
      
      const balances = await mockApiCall(mockBalances);
      dispatch({ type: 'SET_BALANCES', payload: balances });
      
      // 同时更新统计信息
      await refreshStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取余额失败' });
    }
  };

  // 获取交易记录
  const fetchTransactions = async () => {
    try {
      const mockTransactions: WalletTransaction[] = [
        {
          id: 'tx_001',
          type: 'deposit',
          currency: 'BTC',
          amount: 0.1,
          fee: 0.0001,
          status: 'completed',
          timestamp: new Date('2024-01-20T10:30:00Z'),
          txHash: '0x1234567890abcdef',
          fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          confirmations: 6,
          description: '充值'
        },
        {
          id: 'tx_002',
          type: 'withdraw',
          currency: 'ETH',
          amount: 2.5,
          fee: 0.005,
          status: 'pending',
          timestamp: new Date('2024-01-19T15:45:00Z'),
          txHash: '0xabcdef1234567890',
          fromAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
          toAddress: '0x8ba1f109551bD432803012645Hac136c',
          confirmations: 2,
          description: '提现'
        }
      ];
      
      const transactions = await mockApiCall(mockTransactions);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '获取交易记录失败' });
    }
  };

  // 充值
  const deposit = async (request: DepositRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 模拟API调用
      await mockApiCall(null, 2000);
      
      const transactionId = `dep_${Date.now()}`;
      const newTransaction: WalletTransaction = {
        id: transactionId,
        type: 'deposit',
        currency: request.currency,
        amount: request.amount,
        fee: walletConfig.fees.deposit[request.currency],
        status: 'pending',
        timestamp: new Date(),
        description: '充值',
        confirmations: 0
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, transactionId };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '充值失败' });
      return { success: false, error: '充值失败' };
    }
  };

  // 提现
  const withdraw = async (request: WithdrawRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 模拟API调用
      await mockApiCall(null, 2000);
      
      const transactionId = `wit_${Date.now()}`;
      const newTransaction: WalletTransaction = {
        id: transactionId,
        type: 'withdraw',
        currency: request.currency,
        amount: request.amount,
        fee: walletConfig.fees.withdraw[request.currency],
        status: 'pending',
        timestamp: new Date(),
        toAddress: request.address,
        description: '提现',
        confirmations: 0
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, transactionId };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '提现失败' });
      return { success: false, error: '提现失败' };
    }
  };

  // 生成地址
  const generateAddress = async (currency: CryptoCurrency) => {
    try {
      // 模拟生成地址
      const mockAddresses = {
        BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ETH: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        USDT: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        BNB: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
        ADA: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn493lzs9erw',
        DOT: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg'
      };
      
      const address = await mockApiCall(mockAddresses[currency]);
      
      const newAddress: WalletAddress = {
        currency,
        address,
        label: `${currency} 地址`,
        isActive: true,
        createdAt: new Date()
      };
      
      dispatch({ type: 'SET_ADDRESSES', payload: [...state.addresses, newAddress] });
      
      return { success: true, address };
    } catch (error) {
      return { success: false, error: '生成地址失败' };
    }
  };

  // 刷新统计信息
  const refreshStats = async () => {
    try {
      // 计算总价值
      const totalValueUSD = state.balances.reduce((total, balance) => {
        const currencyInfo = walletConfig.supportedCurrencies.find(c => c.symbol === balance.currency);
        return total + (balance.total * (currencyInfo?.price || 0));
      }, 0);
      
      const mockStats: WalletStats = {
        totalValueUSD,
        profitLoss: 1250.75,
        profitLossPercentage: 5.2,
        totalDeposits: 45,
        totalWithdraws: 12
      };
      
      dispatch({ type: 'SET_STATS', payload: mockStats });
    } catch (error) {
      console.error('刷新统计信息失败:', error);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchBalances();
    fetchTransactions();
  }, []);

  const value: WalletContextType = {
    ...state,
    fetchBalances,
    fetchTransactions,
    deposit,
    withdraw,
    generateAddress,
    refreshStats
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};