import React, { useState, useMemo } from 'react'
import { User, Settings, Wallet, Trophy, Star, Clock, Edit, Camera, Eye, EyeOff, Bell, Shield, Globe, Smartphone, Mail, Lock, CreditCard, TrendingUp, TrendingDown, Download, Upload, Copy, ExternalLink, Gift, Award, Gamepad2, Heart, Share2, MoreHorizontal, ChevronRight, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import ScrollAnimation from '../components/ScrollAnimation'
import AnimatedInput from '../components/AnimatedInput'

interface UserProfile {
  id: number
  username: string
  email: string
  avatar: string
  coverImage: string
  bio: string
  level: number
  experience: number
  nextLevelExp: number
  joinDate: string
  isVerified: boolean
  stats: {
    gamesPlayed: number
    tournamentsWon: number
    nftsOwned: number
    friendsCount: number
    totalEarnings: number
    winRate: number
  }
  achievements: Array<{
    id: number
    name: string
    description: string
    icon: string
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
    unlockedAt: string
  }>
  wallet: {
    address: string
    balance: {
      ETH: number
      MTP: number
      USDT: number
    }
    nfts: number
    transactions: Array<{
      id: string
      type: 'deposit' | 'withdrawal' | 'trade' | 'reward'
      amount: number
      currency: string
      status: 'completed' | 'pending' | 'failed'
      timestamp: string
      description: string
    }>
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
  const [showPrivateInfo, setShowPrivateInfo] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 1,
    username: 'CyberGamer2024',
    email: 'cyber.gamer@metatopia.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
    bio: '专业电竞选手，热爱策略游戏和NFT收藏。在METATOPIA世界中探索无限可能！',
    level: 42,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: '2023-01-15',
    isVerified: true,
    stats: {
      gamesPlayed: 1247,
      tournamentsWon: 23,
      nftsOwned: 156,
      friendsCount: 892,
      totalEarnings: 45.67,
      winRate: 78.5
    },
    achievements: [
      {
        id: 1,
        name: '传奇战士',
        description: '在竞技场中获得100场胜利',
        icon: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=64&h=64&fit=crop',
        rarity: 'Legendary',
        unlockedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'NFT收藏家',
        description: '收集50个不同的NFT',
        icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop',
        rarity: 'Epic',
        unlockedAt: '2024-01-10T15:45:00Z'
      },
      {
        id: 3,
        name: '社交达人',
        description: '添加100个好友',
        icon: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop',
        rarity: 'Rare',
        unlockedAt: '2024-01-05T09:20:00Z'
      },
      {
        id: 4,
        name: '锦标赛冠军',
        description: '赢得第一个锦标赛',
        icon: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=64&h=64&fit=crop',
        rarity: 'Epic',
        unlockedAt: '2023-12-20T18:00:00Z'
      },
      {
        id: 5,
        name: '新手上路',
        description: '完成第一场游戏',
        icon: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=64&h=64&fit=crop',
        rarity: 'Common',
        unlockedAt: '2023-01-15T12:00:00Z'
      },
      {
        id: 6,
        name: '财富积累者',
        description: '累计收益超过10 ETH',
        icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=64&h=64&fit=crop',
        rarity: 'Rare',
        unlockedAt: '2023-11-30T14:30:00Z'
      }
    ],
    wallet: {
      address: '0x742d35Cc6634C0532925a3b8D4C0d2E5d8b25a3b8D4',
      balance: {
        ETH: 12.5678,
        MTP: 25000.0,
        USDT: 5000.25
      },
      nfts: 156,
      transactions: [
        {
          id: 'tx_001',
          type: 'reward',
          amount: 2.5,
          currency: 'ETH',
          status: 'completed',
          timestamp: '2024-01-15T10:30:00Z',
          description: '锦标赛奖励'
        },
        {
          id: 'tx_002',
          type: 'trade',
          amount: -0.8,
          currency: 'ETH',
          status: 'completed',
          timestamp: '2024-01-14T15:45:00Z',
          description: '购买 Cyber Warrior #001'
        },
        {
          id: 'tx_003',
          type: 'deposit',
          amount: 10.0,
          currency: 'ETH',
          status: 'completed',
          timestamp: '2024-01-13T09:20:00Z',
          description: '钱包充值'
        },
        {
          id: 'tx_004',
          type: 'withdrawal',
          amount: -5.0,
          currency: 'ETH',
          status: 'pending',
          timestamp: '2024-01-12T18:00:00Z',
          description: '提现到外部钱包'
        }
      ]
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
    email: userProfile.email,
    bio: userProfile.bio
  })

  const handleSaveProfile = async () => {
    setLoadingAction('save-profile')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUserProfile(prev => ({
        ...prev,
        username: editForm.username,
        email: editForm.email,
        bio: editForm.bio
      }))
      
      setIsEditing(false)
      showToast('个人资料已更新', 'success')
    } catch (error) {
      showToast('更新失败，请重试', 'error')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userProfile.wallet.address)
      showToast('钱包地址已复制', 'success')
    } catch (error) {
      showToast('复制失败', 'error')
    }
  }

  const handleToggleSetting = async (category: string, key: string) => {
    const actionKey = `${category}-${key}`
    setLoadingAction(actionKey)
    
    try {
      // Simulate API call
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
      
      showToast('设置已更新', 'success')
    } catch (error) {
      showToast('更新失败，请重试', 'error')
    } finally {
      setLoadingAction(null)
    }
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-600 text-gray-200'
      case 'Rare': return 'bg-blue-600 text-blue-200'
      case 'Epic': return 'bg-purple-600 text-purple-200'
      case 'Legendary': return 'bg-yellow-600 text-yellow-200'
      default: return 'bg-gray-600 text-gray-200'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Download className="w-4 h-4 text-green-400" />
      case 'withdrawal': return <Upload className="w-4 h-4 text-red-400" />
      case 'trade': return <ExternalLink className="w-4 h-4 text-blue-400" />
      case 'reward': return <Gift className="w-4 h-4 text-yellow-400" />
      default: return <ExternalLink className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const experiencePercentage = (userProfile.experience / userProfile.nextLevelExp) * 100

  return (
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
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
            <img
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4 text-white" />
            </AnimatedButton>
          </div>
          
          {/* Profile Info */}
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.username}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-700 bg-primary-800"
                  />
                  {userProfile.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-neon-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-700 rounded-full p-0"
                  >
                    <Camera className="w-3 h-3 text-gray-400" />
                  </AnimatedButton>
                </div>
                
                {/* User Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl md:text-3xl font-tech font-bold text-white">
                      {userProfile.username}
                    </h1>
                    {userProfile.isVerified && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-neon-500/20 rounded-full">
                        <Star className="w-3 h-3 text-neon-400" />
                        <span className="text-xs text-neon-400 font-medium">已认证</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>等级 {userProfile.level}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>加入于 {formatDate(userProfile.joinDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{userProfile.stats.friendsCount} 好友</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 max-w-md">{userProfile.bio}</p>
                  
                  {/* Experience Bar */}
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>经验值</span>
                      <span>{userProfile.experience} / {userProfile.nextLevelExp}</span>
                    </div>
                    <div className="w-full bg-primary-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${experiencePercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-neon-500 to-accent-400 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <AnimatedButton
                  onClick={() => setIsEditing(!isEditing)}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>编辑资料</span>
                </AnimatedButton>
                <AnimatedButton
                  variant="secondary"
                  size="md"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </AnimatedButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary-900 rounded-xl p-6 w-full max-w-md space-y-4"
            >
              <h2 className="text-xl font-tech font-bold text-white mb-4">编辑个人资料</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">用户名</label>
                  <AnimatedInput
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">邮箱</label>
                  <AnimatedInput
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
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
                <p className="text-gray-400">管理你的数字资产</p>
              </div>
              
              {/* Wallet Address */}
              <div className="card-gaming">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-tech font-bold text-white">钱包地址</h3>
                  <AnimatedButton
                      onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                      variant="ghost"
                      size="sm"
                    >
                      {showPrivateInfo ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                  </AnimatedButton>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary-800 rounded-lg">
                  <code className="flex-1 text-gray-300 font-mono text-sm">
                    {showPrivateInfo ? userProfile.wallet.address : '0x742d35...25a3b8D4'}
                  </code>
                  <AnimatedButton
                    onClick={handleCopyAddress}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </AnimatedButton>
                </div>
              </div>
              
              {/* Balance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(userProfile.wallet.balance).map(([currency, amount]) => (
                  <div key={currency} className="card-gaming text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {showPrivateInfo ? amount.toFixed(4) : '****'}
                    </div>
                    <div className="text-gray-400 mb-4">{currency}</div>
                    <div className="flex space-x-2">
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        className="flex-1 flex items-center justify-center"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        充值
                      </AnimatedButton>
                      <AnimatedButton
                        variant="secondary"
                        size="sm"
                        className="flex-1 flex items-center justify-center"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        提现
                      </AnimatedButton>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Transaction History */}
              <div className="card-gaming">
                <h3 className="text-xl font-tech font-bold text-white mb-4">交易记录</h3>
                <div className="space-y-3">
                  {userProfile.wallet.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center space-x-4 p-3 bg-primary-800 rounded-lg">
                      <div className="p-2 bg-primary-700 rounded-lg">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{tx.description}</div>
                        <div className="text-gray-400 text-sm">{formatTime(tx.timestamp)}</div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "font-bold",
                          tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                        </div>
                        <div className={cn("text-sm", getStatusColor(tx.status))}>
                          {tx.status === 'completed' ? '已完成' : tx.status === 'pending' ? '处理中' : '失败'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
      </div>
    </div>
  )
}

export default Profile