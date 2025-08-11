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
  
  // Mock user data - in real app, this would come from API/context
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 1,
    username: 'MetaGamer2024',
    email: 'metagamer@example.com',
    avatar: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    bio: '专业游戏玩家，热爱区块链游戏和NFT收藏。在Metatopia平台上已经获得了多项成就，致力于探索GameFi的无限可能。',
    level: 42,
    experience: 8750,
    nextLevelExp: 10000,
    joinDate: '2023-01-15',
    isVerified: true,
    stats: {
      gamesPlayed: 1247,
      tournamentsWon: 89,
      nftsOwned: 156,
      friendsCount: 342,
      totalEarnings: 12.5,
      winRate: 73.2
    },
    achievements: [
      {
        id: 1,
        name: '传奇玩家',
        description: '达到40级并保持高胜率',
        icon: '/api/placeholder/64/64',
        rarity: 'Legendary',
        unlockedAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'NFT收藏家',
        description: '收集超过100个NFT',
        icon: '/api/placeholder/64/64',
        rarity: 'Epic',
        unlockedAt: '2024-01-10'
      },
      {
        id: 3,
        name: '锦标赛冠军',
        description: '赢得50场锦标赛',
        icon: '/api/placeholder/64/64',
        rarity: 'Rare',
        unlockedAt: '2024-01-05'
      },
      {
        id: 4,
        name: '社交达人',
        description: '拥有超过300个好友',
        icon: '/api/placeholder/64/64',
        rarity: 'Common',
        unlockedAt: '2023-12-20'
      }
    ],
    wallet: {
      address: '0x742d35Cc6634C0532925a3b8D4C0d3E3f8b25a3b8D4',
      balance: {
        ETH: 2.5847,
        MTP: 15420.75,
        USDT: 8934.20
      },
      nfts: 156,
      transactions: [
        {
          id: 'tx1',
          type: 'reward',
          amount: 150.5,
          currency: 'MTP',
          status: 'completed',
          timestamp: '2024-01-15T10:30:00Z',
          description: '锦标赛奖励'
        },
        {
          id: 'tx2',
          type: 'trade',
          amount: -0.1,
          currency: 'ETH',
          status: 'completed',
          timestamp: '2024-01-14T15:45:00Z',
          description: 'NFT购买'
        },
        {
          id: 'tx3',
          type: 'deposit',
          amount: 1000,
          currency: 'USDT',
          status: 'pending',
          timestamp: '2024-01-14T09:20:00Z',
          description: '账户充值'
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

  // Calculate experience percentage
  const experiencePercentage = useMemo(() => {
    return (userProfile.experience / userProfile.nextLevelExp) * 100
  }, [userProfile.experience, userProfile.nextLevelExp])

  // Handle profile edit
  const handleEditProfile = async () => {
    setLoadingAction('edit-profile')
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
      showToast('个人资料更新成功！', 'success')
    } catch (error) {
      showToast('更新失败，请重试', 'error')
    } finally {
      setLoadingAction(null)
    }
  }

  // Handle copy wallet address
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userProfile.wallet.address)
      showToast('钱包地址已复制到剪贴板', 'success')
    } catch (error) {
      showToast('复制失败', 'error')
    }
  }

  // Handle settings toggle
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
      showToast('设置更新失败', 'error')
    } finally {
      setLoadingAction(null)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get achievement rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
      case 'Epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'Rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  // Get transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Download className="w-4 h-4 text-green-400" />
      case 'withdrawal': return <Upload className="w-4 h-4 text-red-400" />
      case 'trade': return <ExternalLink className="w-4 h-4 text-blue-400" />
      case 'reward': return <Gift className="w-4 h-4 text-yellow-400" />
      default: return <CreditCard className="w-4 h-4 text-gray-400" />
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-neon-500/20 to-purple-500/20 overflow-hidden">
        <img
          src={userProfile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent" />
        
        {/* Edit Cover Button */}
        <AnimatedButton
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm"
        >
          <Camera className="w-4 h-4 mr-2" />
          编辑封面
        </AnimatedButton>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.username}
              className="w-32 h-32 rounded-full border-4 border-neon-500 shadow-lg shadow-neon-500/25"
            />
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 w-8 h-8 p-0 bg-neon-500 hover:bg-neon-400 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </AnimatedButton>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-tech font-bold text-white">
                {userProfile.username}
              </h1>
              {userProfile.isVerified && (
                <div className="p-1 bg-neon-500 rounded-full">
                  <Star className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-400">
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                等级 {userProfile.level}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                加入于 {formatDate(userProfile.joinDate)}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {userProfile.stats.friendsCount} 好友
              </span>
            </div>
            
            <p className="text-gray-300 max-w-2xl">
              {userProfile.bio}
            </p>
            
            {/* Experience Bar */}
            <div className="max-w-md">
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
              variant="primary"
              className="flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              编辑资料
            </AnimatedButton>
            <AnimatedButton variant="secondary">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </AnimatedButton>
          </div>
        </div>

        {/* Edit Profile Modal */}
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
              className="bg-primary-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-tech font-bold text-white mb-4">编辑个人资料</h2>
              
              <div className="space-y-4">
                <AnimatedInput
                  label="用户名"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="输入用户名"
                />
                
                <AnimatedInput
                  label="邮箱"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="输入邮箱地址"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    个人简介
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="介绍一下你自己..."
                    rows={4}
                    className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <AnimatedButton
                  onClick={handleEditProfile}
                  disabled={loadingAction === 'edit-profile'}
                  variant="primary"
                  className="flex-1"
                >
                  {loadingAction === 'edit-profile' ? '保存中...' : '保存更改'}
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  取消
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: '游戏场次', value: userProfile.stats.gamesPlayed, icon: Gamepad2 },
            { label: '锦标赛胜利', value: userProfile.stats.tournamentsWon, icon: Trophy },
            { label: 'NFT收藏', value: userProfile.stats.nftsOwned, icon: Award },
            { label: '好友数量', value: userProfile.stats.friendsCount, icon: Heart },
            { label: '总收益', value: `${userProfile.stats.totalEarnings} ETH`, icon: TrendingUp },
            { label: '胜率', value: `${userProfile.stats.winRate}%`, icon: Star }
          ].map((stat, index) => (
            <ScrollAnimation key={stat.label} delay={index * 0.1}>
              <AnimatedCard className="text-center space-y-2">
                <stat.icon className="w-6 h-6 text-neon-500 mx-auto" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </AnimatedCard>
            </ScrollAnimation>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-primary-800 rounded-lg p-1">
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
                "flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all",
                activeTab === tab.id
                  ? 'bg-neon-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-primary-700'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
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
              
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: 'achievement',
                    title: '获得新成就：传奇玩家',
                    description: '达到40级并保持高胜率',
                    timestamp: '2024-01-15T10:30:00Z',
                    icon: Trophy
                  },
                  {
                    id: 2,
                    type: 'tournament',
                    title: '赢得锦标赛：星际争霸杯',
                    description: '获得150.5 MTP奖励',
                    timestamp: '2024-01-14T20:15:00Z',
                    icon: Award
                  },
                  {
                    id: 3,
                    type: 'nft',
                    title: '购买NFT：稀有武器包',
                    description: '花费0.1 ETH购买限量版武器',
                    timestamp: '2024-01-14T15:45:00Z',
                    icon: Gift
                  },
                  {
                    id: 4,
                    type: 'friend',
                    title: '新增好友：CryptoWarrior',
                    description: '在锦标赛中结识的新朋友',
                    timestamp: '2024-01-13T18:20:00Z',
                    icon: Heart
                  }
                ].map((activity, index) => (
                  <ScrollAnimation key={activity.id} delay={index * 0.1}>
                    <div className="card-gaming flex items-center space-x-4">
                      <div className="p-3 bg-neon-500/20 rounded-lg">
                        <activity.icon className="w-6 h-6 text-neon-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <p className="text-gray-400 text-sm">{activity.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(activity.timestamp)}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
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