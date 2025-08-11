import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, AlertTriangle, Info, Calculator } from 'lucide-react';
import { Project } from '../services/projectApi';
import { investmentApiService } from '../services/investmentApi';
import { userApiService } from '../services/userApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface InvestmentModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ project, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [investmentType, setInvestmentType] = useState<'seed' | 'private' | 'public' | 'ido'>('public');
  const [currency, setCurrency] = useState('USDT');
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [estimatedTokens, setEstimatedTokens] = useState(0);

  useEffect(() => {
    loadUserBalance();
    loadTokenPrice();
  }, [currency]);

  useEffect(() => {
    calculateTokens();
  }, [amount, tokenPrice]);

  const loadUserBalance = async () => {
    try {
      const balances = await userApiService.getWalletBalances();
      const balance = balances.find(b => b.currency === currency);
      setUserBalance(balance?.available || 0);
    } catch (error) {
      console.error('Failed to load user balance:', error);
    }
  };

  const loadTokenPrice = () => {
    // 根据投资类型设置不同的代币价格
    const basePrice = project.token_info?.initial_price || 0.1;
    const multipliers = {
      seed: 0.5,    // 种子轮50%折扣
      private: 0.7, // 私募轮30%折扣
      public: 1.0,  // 公募轮原价
      ido: 1.2      // IDO轮20%溢价
    };
    setTokenPrice(basePrice * multipliers[investmentType]);
  };

  const calculateTokens = () => {
    const investAmount = parseFloat(amount) || 0;
    if (investAmount > 0 && tokenPrice > 0) {
      setEstimatedTokens(investAmount / tokenPrice);
    } else {
      setEstimatedTokens(0);
    }
  };

  const handleInvest = async () => {
    const investAmount = parseFloat(amount);
    
    if (!amount || investAmount <= 0) {
      toast.error('请输入有效的投资金额');
      return;
    }

    if (investAmount < project.min_investment) {
      toast.error(`最小投资金额为 $${project.min_investment.toLocaleString()}`);
      return;
    }

    if (project.max_investment && investAmount > project.max_investment) {
      toast.error(`最大投资金额为 $${project.max_investment.toLocaleString()}`);
      return;
    }

    if (investAmount > userBalance) {
      toast.error('余额不足');
      return;
    }

    setIsLoading(true);
    try {
      await investmentApiService.createInvestment({
        project_id: project.id,
        amount: investAmount,
        investment_type: investmentType,
        currency
      });
      
      toast.success('投资申请已提交，等待确认');
      onSuccess();
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('投资申请失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const setMaxAmount = () => {
    const maxInvestable = Math.min(
      userBalance,
      project.max_investment || userBalance,
      project.funding_goal - project.funding_raised
    );
    setAmount(maxInvestable.toString());
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const getInvestmentTypeInfo = (type: string) => {
    const info = {
      seed: { name: '种子轮', discount: '50%折扣', color: 'text-green-400' },
      private: { name: '私募轮', discount: '30%折扣', color: 'text-blue-400' },
      public: { name: '公募轮', discount: '原价', color: 'text-purple-400' },
      ido: { name: 'IDO轮', discount: '20%溢价', color: 'text-orange-400' }
    };
    return info[type as keyof typeof info] || info.public;
  };

  const investAmount = parseFloat(amount) || 0;
  const remainingFunding = project.funding_goal - project.funding_raised;
  const typeInfo = getInvestmentTypeInfo(investmentType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-primary-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img
                  src={project.logo_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cryptocurrency%20project%20logo%20modern%20design&image_size=square'}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <p className="text-gray-400 text-sm">{project.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-primary-700/50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">融资目标</div>
              <div className="text-lg font-bold text-white">
                ${project.funding_goal.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">已筹集</div>
              <div className="text-lg font-bold text-green-400">
                ${project.funding_raised.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">剩余额度</div>
              <div className="text-lg font-bold text-blue-400">
                ${remainingFunding.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <div className="space-y-6">
            {/* Investment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                投资轮次
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {project.investment_types?.map((type) => {
                  const info = getInvestmentTypeInfo(type);
                  return (
                    <button
                      key={type}
                      onClick={() => setInvestmentType(type)}
                      className={cn(
                        'p-3 rounded-lg border transition-all text-center',
                        investmentType === type
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      )}
                    >
                      <div className="font-medium text-sm">{info.name}</div>
                      <div className={cn('text-xs', info.color)}>{info.discount}</div>
                    </button>
                  );
                }) || [
                  <button
                    key="public"
                    onClick={() => setInvestmentType('public')}
                    className="p-3 rounded-lg border border-blue-500 bg-blue-500/20 text-blue-400 text-center"
                  >
                    <div className="font-medium text-sm">公募轮</div>
                    <div className="text-xs text-purple-400">原价</div>
                  </button>
                ]}
              </div>
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                投资币种
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
              </select>
              <div className="text-xs text-gray-400 mt-1">
                可用余额: {formatAmount(userBalance)} {currency}
              </div>
            </div>

            {/* Investment Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  投资金额
                </label>
                <button
                  onClick={setMaxAmount}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  最大金额
                </button>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="请输入投资金额"
                  className="w-full pl-10 pr-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>最小投资: ${project.min_investment.toLocaleString()}</span>
                {project.max_investment && (
                  <span>最大投资: ${project.max_investment.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Token Calculation */}
            {investAmount > 0 && (
              <div className="bg-primary-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">投资计算</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">代币价格:</span>
                    <span className="text-white">${formatAmount(tokenPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">预计获得:</span>
                    <span className="text-green-400 font-medium">
                      {formatAmount(estimatedTokens)} {project.token_info?.symbol || 'TOKEN'}
                    </span>
                  </div>
                  {project.token_info?.listing_price && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">上市价格:</span>
                      <span className="text-blue-400">${formatAmount(project.token_info.listing_price)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-300">
                  <p className="font-medium mb-1">投资风险提示:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 加密货币投资存在高风险，可能导致本金损失</li>
                    <li>• 项目代币价格可能大幅波动</li>
                    <li>• 投资前请仔细阅读项目白皮书</li>
                    <li>• 请根据自身风险承受能力谨慎投资</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleInvest}
                disabled={isLoading || !amount || investAmount <= 0 || investAmount > userBalance}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>确认投资</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentModal;