import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  Trophy, 
  Star, 
  Gamepad2, 
  TrendingUp, 
  Award,
  Wallet,
  ChevronRight,
  Edit3,
  Camera,
  Copy,
  Check,
  Shield,
  Bell,
  Lock,
  X
} from 'lucide-react'
import { cn } from '../lib/utils'
import { AnimatedButton } from '../components/ui/AnimatedButton'
import { AnimatedCard } from '../components/ui/AnimatedCard'
import { ScrollAnimation } from '../components/ui/ScrollAnimation'
import { BalanceManager } from '../components/wallet/BalanceManager'
import { TransactionHistory } from '../components/wallet/TransactionHistory'
import { DepositModal } from '../components/wallet/DepositModal'
import { WithdrawModal } from '../components/wallet/WithdrawModal'
import { WalletProvider } from '../contexts/WalletContext'
import { useLoading } from '../hooks/useLoading'

// 用户资料类型定义
interface UserProfile {
  id: string
  username: string
  email: string
  avatar: string
  coverImage: string
  bio: string
  level: number
  experience: number
  experienceToNext: number
  joinDate: string
  stats: {
    gamesPlayed: number
    tournamentsWon: number
    nftsOwned: number
    friendsCount: number
    totalEarnings: number
    winRate: number
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlockedAt: string
  }>
  wallet: {
    address: string
    balance: {
      ETH: number
      USDT: number
      BTC: number
    }
  }
  settings: {
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private'
      showOnlineStatus: boolean
      showGameStats: boolean
      allowFriendRequests: boolean
    }
    notifications: {
      gameInvites: boolean
      tournamentUpdates: boolean
      friendActivity: boolean
      marketingEmails: boolean
      pushNotifications: boolean
    }
    security: {
      twoFactorEnabled: boolean
      loginAlerts: boolean
      deviceManagement: boolean
    }
  }
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'achievements' | 'settings'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const { isLoading, loadingAction, startLoading, stopLoading } = useLoading()
  
  // 模拟用户数据
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    username: 'CyberWarrior',
    email: 'warrior@metatopia.com',
    avatar: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    bio: '专业电竞选手，区块链游戏爱好者，METATOPIA平台资深玩家。',
    level: 42,
    experience: 8750,
    experienceToNext: 1250,
    joinDate: '2023-01-15',
    stats: {
      gamesPlayed: 1247,
      tournamentsWon: 23,
      nftsOwned: 156,
      friendsCount: 89,
      totalEarnings: 12.5,
      winRate: 78
    },
    achievements: [
      {
        id: '1',
        name: '传奇战士',
        description: '在竞技场中获得100场胜利',
        icon: '/api/placeholder/64/64',
        rarity: 'legendary',
        unlockedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'NFT收藏家',
        description: '收集50个不同的NFT',
        icon: '/api/placeholder/64/64',
        rarity: 'epic',
        unlockedAt: '2024-01-10'
      },
      {
        id: '3',
        name: '锦标赛冠军',
        description: '赢得首个锦标赛冠军',
        icon: '/api/placeholder/64/64',
        rarity: 'rare',
        unlockedAt: '2024-01-05'
      }
    ],
    wallet: {
      address: '0x1234...5678',
      balance: {
        ETH: 2.5,
        USDT: 1000,
        BTC: 0.1
      }
    },
    settings: {
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        showGameStats: true,
        allowFriendRequests: true
      },
      notifications: {
        gameInvites: true,
        tournamentUpdates: true,
        friendActivity: false,
        marketingEmails: false,
        pushNotifications: true
      },
      security: {
        twoFactorEnabled: true,
        loginAlerts: true,
        deviceManagement: false
      }
    }
  })
  
  const [editForm, setEditForm] = useState({
    username: userProfile.username,
    bio: userProfile.bio
  })

  // 处理个人资料编辑
  const handleEditProfile = () => {
    setEditForm({
      username: userProfile.username,
      bio: userProfile.bio
    })
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    startLoading('save-profile')
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setUserProfile(prev => ({
      ...prev,
      username: editForm.username,
      bio: editForm.bio
    }))
    
    setIsEditing(false)
    stopLoading()
  }

  // 复制钱包地址
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userProfile.wallet.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  // 处理设置切换
  const handleToggleSetting = async (category: string, key: string) => {
    startLoading(`${category}-${key}`)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUserProfile(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: {
          ...prev.settings[category as keyof typeof prev.settings],
          [key]: !prev.settings[category as keyof typeof prev.settings][key as keyof any]
        }
      }
    }))
    
    stopLoading()
  }

  // 处理钱包操作
  const handleDeposit = (currency: string) => {
    setSelectedCurrency(currency)
    setShowDepositModal(true)
  }

  const handleWithdraw = (currency: string) => {
    setSelectedCurrency(currency)
    setShowWithdrawModal(true)
  }

  const handleCloseModals = () => {
    setShowDepositModal(false)
    setShowWithdrawModal(false)
    setSelectedCurrency(null)
  }

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  return (
    <WalletProvider>
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
            <img
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Edit Cover Button */}
            <AnimatedButton
              onClick={() => {}}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4" />
            </AnimatedButton>
          </div>
          
          {/* Profile Info */}
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.username}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-800 bg-primary-800"
                />
                <AnimatedButton
                  onClick={() => {}}
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-neon-500 p-0"
                >
                  <Camera className="w-4 h-4" />
                </AnimatedButton>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-tech font-bold text-white">
                    {userProfile.username}
                  </h1>
                  <span className="px-3 py-1 bg-neon-500 text-black text-sm font-bold rounded-full">
                    Lv.{userProfile.level}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-3 max-w-md">{userProfile.bio}</p>
                
                {/* Experience Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>经验值</span>
                    <span>{userProfile.experience}/{userProfile.experience + userProfile.experienceToNext}</span>
                  </div>
                  <div className="w-full bg-primary-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-neon-500 to-accent-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(userProfile.experience / (userProfile.experience + userProfile.experienceToNext)) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <AnimatedButton
                    onClick={handleEditProfile}
                    variant="primary"
                    size="md"
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>编辑资料</span>
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onClick={handleCopyAddress}
                    variant="secondary"
                    size="md"
                    className="flex items-center space-x-2"
                  >
                    {copiedAddress ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedAddress ? '已复制' : '复制地址'}</span>
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-primary-800 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-tech font-bold text-white">编辑资料</h2>
                  <AnimatedButton
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </AnimatedButton>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">用户名</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="输入用户名..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">个人简介</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="输入个人简介..."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <AnimatedButton
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    取消
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleSaveProfile}
                    disabled={loadingAction === 'save-profile'}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    {loadingAction === 'save-profile' ? '保存中...' : '保存'}
                  </AnimatedButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: '游戏场次', value: userProfile.stats.gamesPlayed, icon: Gamepad2, color: 'text-blue-400' },
            { label: '锦标赛胜利', value: userProfile.stats.tournamentsWon, icon: Trophy, color: 'text-yellow-400' },
            { label: 'NFT收藏', value: userProfile.stats.nftsOwned, icon: Star, color: 'text-purple-400' },
            { label: '好友数量', value: userProfile.stats.friendsCount, icon: User, color: 'text-green-400' },
            { label: '总收益', value: `${userProfile.stats.totalEarnings} ETH`, icon: TrendingUp, color: 'text-orange-400' },
            { label: '胜率', value: `${userProfile.stats.winRate}%`, icon: Award, color: 'text-red-400' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <AnimatedCard className="text-center">
                  <Icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </AnimatedCard>
              </ScrollAnimation>
            )
          })}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-primary-800 rounded-lg p-1">
            {[
              { id: 'overview', label: '概览', icon: User },
              { id: 'wallet', label: '钱包', icon: Wallet },
              { id: 'achievements', label: '成就', icon: Trophy },
              { id: 'settings', label: '设置', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <AnimatedButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </AnimatedButton>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">个人概览</h2>
                <p className="text-gray-400">查看你的游戏历程和成就</p>
              </div>
              
              {/* Recent Activity */}
              <div className="card-gaming">
                <h3 className="text-xl font-tech font-bold text-white mb-4">最近活动</h3>
                <div className="space-y-4">
                  {[
                    { type: 'tournament', title: '赢得METATOPIA冠军杯', time: '2小时前', icon: Trophy, color: 'text-yellow-400' },
                    { type: 'nft', title: '购买了 Cyber Warrior #001', time: '1天前', icon: Star, color: 'text-purple-400' },
                    { type: 'friend', title: '添加了新好友 DragonSlayer', time: '2天前', icon: User, color: 'text-green-400' },
                    { type: 'achievement', title: '解锁成就：传奇战士', time: '5天前', icon: Award, color: 'text-orange-400' }
                  ].map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-primary-800 rounded-lg">
                        <Icon className={cn("w-5 h-5", activity.color)} />
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-gray-400 text-sm">{activity.time}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">数字钱包</h2>
                <p className="text-gray-400">管理你的数字资产和交易</p>
              </div>
              
              {/* 余额管理组件 */}
              <BalanceManager 
                showActions={true}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
              
              {/* 交易记录组件 */}
              <TransactionHistory />
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">成就系统</h2>
                <p className="text-gray-400">展示你的游戏成就和荣誉</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.achievements.map((achievement, index) => (
                  <ScrollAnimation key={achievement.id} delay={index * 0.1}>
                    <AnimatedCard className="text-center space-y-4">
                      <img
                        src={achievement.icon}
                        alt={achievement.name}
                        className="w-16 h-16 mx-auto rounded-full"
                      />
                      <div>
                        <h3 className="text-white font-tech font-bold text-lg mb-2">
                          {achievement.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            getRarityColor(achievement.rarity)
                          )}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          解锁于 {formatDate(achievement.unlockedAt)}
                        </div>
                      </div>
                    </AnimatedCard>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">账户设置</h2>
                <p className="text-gray-400">管理你的隐私和安全设置</p>
              </div>
              
              {/* Privacy Settings */}
              <div className="card-gaming">
                <h3 className="text-xl font-tech font-bold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  隐私设置
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'profileVisibility', label: '个人资料可见性', type: 'select', options: [
                      { value: 'public', label: '公开' },
                      { value: 'friends', label: '仅好友' },
                      { value: 'private', label: '私密' }
                    ]},
                    { key: 'showOnlineStatus', label: '显示在线状态', type: 'toggle' },
                    { key: 'showGameStats', label: '显示游戏统计', type: 'toggle' },
                    { key: 'allowFriendRequests', label: '允许好友请求', type: 'toggle' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 bg-primary-800 rounded-lg">
                      <span className="text-white">{setting.label}</span>
                      {setting.type === 'toggle' ? (
                        <AnimatedButton
                          onClick={() => handleToggleSetting('privacy', setting.key)}
                          disabled={loadingAction === `privacy-${setting.key}`}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "relative w-12 h-6 rounded-full transition-colors p-0",
                            userProfile.settings.privacy[setting.key as keyof typeof userProfile.settings.privacy]
                              ? 'bg-neon-500'
                              : 'bg-gray-600'
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                            userProfile.settings.privacy[setting.key as keyof typeof userProfile.settings.privacy]
                              ? 'translate-x-7'
                              : 'translate-x-1'
                          )} />
                        </AnimatedButton>
                      ) : (
                        <select
                          value={userProfile.settings.privacy.profileVisibility}
                          onChange={(e) => {
                            setUserProfile(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                privacy: {
                                  ...prev.settings.privacy,
                                  profileVisibility: e.target.value as any
                                }
                              }
                            }))
                          }}
                          className="bg-primary-700 border border-primary-600 rounded px-3 py-1 text-white text-sm"
                        >
                          {setting.options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notification Settings */}
              <div className="card-gaming">
                <h3 className="text-xl font-tech font-bold text-white mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  通知设置
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'gameInvites', label: '游戏邀请' },
                    { key: 'tournamentUpdates', label: '锦标赛更新' },
                    { key: 'friendActivity', label: '好友动态' },
                    { key: 'marketingEmails', label: '营销邮件' },
                    { key: 'pushNotifications', label: '推送通知' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 bg-primary-800 rounded-lg">
                      <span className="text-white">{setting.label}</span>
                      <AnimatedButton
                        onClick={() => handleToggleSetting('notifications', setting.key)}
                        disabled={loadingAction === `notifications-${setting.key}`}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors p-0",
                          userProfile.settings.notifications[setting.key as keyof typeof userProfile.settings.notifications]
                            ? 'bg-neon-500'
                            : 'bg-gray-600'
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                          userProfile.settings.notifications[setting.key as keyof typeof userProfile.settings.notifications]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        )} />
                      </AnimatedButton>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Security Settings */}
              <div className="card-gaming">
                <h3 className="text-xl font-tech font-bold text-white mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  安全设置
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'twoFactorEnabled', label: '双重认证', description: '为账户添加额外安全层' },
                    { key: 'loginAlerts', label: '登录提醒', description: '新设备登录时发送通知' },
                    { key: 'deviceManagement', label: '设备管理', description: '管理已授权的设备' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 bg-primary-800 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{setting.label}</div>
                        <div className="text-gray-400 text-sm">{setting.description}</div>
                      </div>
                      <AnimatedButton
                        onClick={() => handleToggleSetting('security', setting.key)}
                        disabled={loadingAction === `security-${setting.key}`}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors p-0",
                          userProfile.settings.security[setting.key as keyof typeof userProfile.settings.security]
                            ? 'bg-neon-500'
                            : 'bg-gray-600'
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                          userProfile.settings.security[setting.key as keyof typeof userProfile.settings.security]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        )} />
                      </AnimatedButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* 充值模态框 */}
        {showDepositModal && selectedCurrency && (
          <DepositModal
            isOpen={showDepositModal}
            onClose={handleCloseModals}
            initialCurrency={selectedCurrency}
          />
        )}
        
        {/* 提现模态框 */}
        {showWithdrawModal && selectedCurrency && (
          <WithdrawModal
            isOpen={showWithdrawModal}
            onClose={handleCloseModals}
            initialCurrency={selectedCurrency}
          />
        )}
      </div>
    </div>
    </WalletProvider>
  )
}

export default Profile