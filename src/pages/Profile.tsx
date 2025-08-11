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
    username: 'CyberWarrior2024',
    email: 'warrior@metatopia.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
    bio: '专业电竞玩家，专注于FPS和MOBA游戏。热爱竞技，追求极致操作。',
    level: 42,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: '2023-01-15',
    isVerified: true,
    stats: {
      gamesPlayed: 1247,
      tournamentsWon: 23,
      nftsOwned: 156,
      friendsCount: 89,
      totalEarnings: 12450.75,
      winRate: 73.2
    },
    achievements: [
      {
        id: 1,
        name: '传奇战士',
        description: '在竞技模式中获得100场胜利',
        icon: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=64&h=64&fit=crop',
        rarity: 'Legendary',
        unlockedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'NFT大师',
        description: '收集超过100个NFT',
        icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop',
        rarity: 'Epic',
        unlockedAt: '2024-01-10T14:20:00Z'
      },
      {
        id: 3,
        name: '社交达人',
        description: '添加50个好友',
        icon: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop',
        rarity: 'Rare',
        unlockedAt: '2024-01-05T09:15:00Z'
      },
      {
        id: 4,
        name: '首次胜利',
        description: '赢得你的第一场比赛',
        icon: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=64&h=64&fit=crop',
        rarity: 'Common',
        unlockedAt: '2023-01-16T16:45:00Z'
      },
      {
        id: 5,
        name: '锦标赛冠军',
        description: '赢得官方锦标赛冠军',
        icon: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=64&h=64&fit=crop',
        rarity: 'Legendary',
        unlockedAt: '2024-01-20T18:30:00Z'
      },
      {
        id: 6,
        name: '连胜王者',
        description: '获得20连胜',
        icon: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop',
        rarity: 'Epic',
        unlockedAt: '2024-01-12T12:00:00Z'
      }
    ],
    wallet: {
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      balance: {
        ETH: 2.5,
        MTP: 15000,
        USDT: 1250.50
      },
      nfts: 156,
      transactions: [
        {
          id: 'tx_001',
          type: 'reward',
          amount: 500,
          currency: 'MTP',
          status: 'completed',
          timestamp: '2024-01-20T10:30:00Z',
          description: '锦标赛奖励'
        },
        {
          id: 'tx_002',
          type: 'trade',
          amount: -0.1,
          currency: 'ETH',
          status: 'completed',
          timestamp: '2024-01-19T15:45:00Z',
          description: 'NFT购买'
        },
        {
          id: 'tx_003',
          type: 'deposit',
          amount: 1000,
          currency: 'USDT',
          status: 'completed',
          timestamp: '2024-01-18T09:20:00Z',
          description: '账户充值'
        },
        {
          id: 'tx_004',
          type: 'withdrawal',
          amount: -200,
          currency: 'MTP',
          status: 'pending',
          timestamp: '2024-01-17T14:10:00Z',
          description: '提现到钱包'
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

  // Edit form state
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
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500 text-white'
      case 'Rare': return 'bg-blue-500 text-white'
      case 'Epic': return 'bg-purple-500 text-white'
      case 'Legendary': return 'bg-yellow-500 text-black'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Download className="w-4 h-4 text-green-400" />
      case 'withdrawal': return <Upload className="w-4 h-4 text-red-400" />
      case 'trade': return <TrendingUp className="w-4 h-4 text-blue-400" />
      case 'reward': return <Gift className="w-4 h-4 text-yellow-400" />
      default: return <CreditCard className="w-4 h-4 text-gray-400" />
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
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="relative h-64 rounded-xl overflow-hidden">
            <img
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              编辑封面
            </AnimatedButton>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-20 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.username}
                  className="w-32 h-32 rounded-full border-4 border-primary-800 bg-primary-800"
                />
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2 w-8 h-8 p-0 bg-neon-500 hover:bg-neon-600 text-black rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </AnimatedButton>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-tech font-bold">{userProfile.username}</h1>
                  {userProfile.isVerified && (
                    <div className="bg-neon-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      认证
                    </div>
                  )}
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Lv.{userProfile.level}
                  </div>
                </div>
                <p className="text-gray-300 mb-3 max-w-2xl">{userProfile.bio}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    加入于 {formatDate(userProfile.joinDate)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {userProfile.stats.friendsCount} 好友
                  </div>
                </div>
                
                {/* Experience Bar */}
                <div className="mt-4 max-w-md">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>经验值</span>
                    <span>{userProfile.experience} / {userProfile.nextLevelExp}</span>
                  </div>
                  <div className="w-full bg-primary-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-neon-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${experiencePercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <AnimatedButton
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-neon-500 text-neon-500 hover:bg-neon-500 hover:text-black"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑资料
                </AnimatedButton>
                <AnimatedButton
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-tech font-bold text-white mb-4">编辑个人资料</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                  <AnimatedInput
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
                  <AnimatedInput
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="介绍一下你自己..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <AnimatedButton
                  onClick={() => setIsEditing(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  取消
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleSaveProfile}
                  disabled={loadingAction === 'save-profile'}
                  className="flex-1 bg-neon-500 hover:bg-neon-600 text-black"
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
            { label: '好友数量', value: userProfile.stats.friendsCount, icon: Heart, color: 'text-pink-400' },
            { label: '总收益', value: `$${userProfile.stats.totalEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
            { label: '胜率', value: `${userProfile.stats.winRate}%`, icon: Award, color: 'text-orange-400' }
          ].map((stat, index) => (
            <ScrollAnimation key={stat.label} delay={index * 0.1}>
              <AnimatedCard className="text-center p-4">
                <stat.icon className={cn("w-8 h-8 mx-auto mb-2", stat.color)} />
                <div className="text-2xl font-tech font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </AnimatedCard>
            </ScrollAnimation>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-primary-800 p-1 rounded-lg">
            {[
              { id: 'overview', label: '概览', icon: User },
              { id: 'wallet', label: '钱包', icon: Wallet },
              { id: 'achievements', label: '成就', icon: Trophy },
              { id: 'settings', label: '设置', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 font-medium",
                  activeTab === tab.id
                    ? "bg-neon-500 text-black"
                    : "text-gray-400 hover:text-white hover:bg-primary-700"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">最近活动</h2>
                <p className="text-gray-400">查看你的游戏历程和成就</p>
              </div>
              
              <div className="grid gap-4">
                {[
                  {
                    type: 'tournament',
                    title: '赢得春季锦标赛冠军',
                    description: '在Cyber Warriors春季锦标赛中获得第一名',
                    time: '2小时前',
                    icon: Trophy,
                    color: 'text-yellow-400'
                  },
                  {
                    type: 'nft',
                    title: '购买稀有NFT',
                    description: '获得传奇级别的"龙之剑"NFT',
                    time: '1天前',
                    icon: Star,
                    color: 'text-purple-400'
                  },
                  {
                    type: 'friend',
                    title: '添加新好友',
                    description: '与ProGamer123成为好友',
                    time: '2天前',
                    icon: Heart,
                    color: 'text-pink-400'
                  },
                  {
                    type: 'achievement',
                    title: '解锁新成就',
                    description: '获得"连胜王者"成就徽章',
                    time: '3天前',
                    icon: Award,
                    color: 'text-orange-400'
                  }
                ].map((activity, index) => (
                  <ScrollAnimation key={index} delay={index * 0.1}>
                    <AnimatedCard className="flex items-center space-x-4 p-4">
                      <div className={cn("w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center", activity.color)}>
                        <activity.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <p className="text-gray-400 text-sm">{activity.description}</p>
                      </div>
                      <div className="text-gray-500 text-sm">{activity.time}</div>
                    </AnimatedCard>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">我的钱包</h2>
                <p className="text-gray-400">管理你的数字资产和交易记录</p>
              </div>
              
              {/* Wallet Address */}
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-tech font-bold text-white">钱包地址</h3>
                  <AnimatedButton
                    onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {showPrivateInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </AnimatedButton>
                </div>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 bg-primary-700 px-3 py-2 rounded text-white font-mono text-sm">
                    {showPrivateInfo ? userProfile.wallet.address : '0x742d35...925a3b8D4'}
                  </code>
                  <AnimatedButton
                    onClick={handleCopyAddress}
                    variant="ghost"
                    size="sm"
                    className="text-neon-500 hover:text-neon-400"
                  >
                    <Copy className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </AnimatedCard>

              {/* Balance */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { currency: 'ETH', amount: userProfile.wallet.balance.ETH, color: 'text-blue-400' },
                  { currency: 'MTP', amount: userProfile.wallet.balance.MTP, color: 'text-neon-400' },
                  { currency: 'USDT', amount: userProfile.wallet.balance.USDT, color: 'text-green-400' }
                ].map((balance) => (
                  <AnimatedCard key={balance.currency} className="p-6 text-center">
                    <div className={cn("text-3xl font-tech font-bold mb-2", balance.color)}>
                      {showPrivateInfo ? balance.amount.toLocaleString() : '***'}
                    </div>
                    <div className="text-gray-400">{balance.currency}</div>
                  </AnimatedCard>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <AnimatedButton className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  充值
                </AnimatedButton>
                <AnimatedButton className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  提现
                </AnimatedButton>
              </div>

              {/* Transaction History */}
              <AnimatedCard className="p-6">
                <h3 className="text-xl font-tech font-bold text-white mb-4">交易记录</h3>
                <div className="space-y-3">
                  {userProfile.wallet.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <div className="text-white font-medium">{tx.description}</div>
                          <div className="text-gray-400 text-sm">{formatDateTime(tx.timestamp)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "font-mono font-bold",
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
              </AnimatedCard>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">我的成就</h2>
                <p className="text-gray-400">展示你在游戏中获得的荣誉和成就</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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