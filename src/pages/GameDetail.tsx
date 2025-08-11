import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Users, Download, Play, Heart, Share2, Calendar, Monitor, HardDrive, Cpu, Trophy, Shield, Gamepad2, Clock, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'

interface Game {
  id: number
  title: string
  description: string
  category: string
  genre: string[]
  rating: number
  players: number
  downloads: string
  price: string
  image: string
  screenshots: string[]
  developer: string
  releaseDate: string
  features: string[]
  systemRequirements: {
    minimum: string[]
    recommended: string[]
  }
  tags: string[]
  isNew: boolean
  isFeatured: boolean
  isPopular: boolean
  detailedDescription?: string
  gameplayVideo?: string
  achievements?: { name: string; description: string; icon: string }[]
  reviews?: { user: string; rating: number; comment: string; date: string }[]
}

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedScreenshot, setSelectedScreenshot] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'reviews'>('overview')

  // Mock game data
  const mockGames: Game[] = [
    {
      id: 1,
      title: 'Cyber Warriors',
      description: '在未来世界中体验激烈的机甲战斗，驾驶高科技战甲征服战场。',
      detailedDescription: `《Cyber Warriors》是一款设定在2087年的未来世界的动作射击游戏。在这个世界中，人类已经掌握了先进的机甲技术，玩家将扮演一名精英机甲驾驶员，在各种危险的战场上执行任务。

游戏采用了最新的3D引擎技术，为玩家呈现了一个充满科技感的未来世界。从繁华的赛博朋克城市到荒凉的外星殖民地，每个场景都经过精心设计，充满了细节和氛围。

战斗系统结合了快节奏的射击和策略性的机甲定制。玩家可以根据任务需求和个人喜好，自由搭配武器、护甲和特殊装备，打造属于自己的专属机甲。`,
      category: 'action',
      genre: ['动作', '射击', '科幻'],
      rating: 4.8,
      players: 125000,
      downloads: '2.5M',
      price: '¥198',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&h=450&fit=crop'
      ],
      developer: 'Future Games Studio',
      releaseDate: '2024-01-15',
      features: [
        '沉浸式单人战役模式',
        '多人在线对战',
        '自定义机甲系统',
        '动态天气系统',
        '实时光线追踪',
        '支持VR设备',
        '跨平台游戏',
        '定期内容更新'
      ],
      systemRequirements: {
        minimum: [
          'Windows 10 64位',
          'Intel i5-8400 / AMD Ryzen 5 2600',
          '8 GB RAM',
          'NVIDIA GTX 1060 / AMD RX 580',
          'DirectX 12',
          '50 GB 可用空间'
        ],
        recommended: [
          'Windows 11 64位',
          'Intel i7-10700K / AMD Ryzen 7 3700X',
          '16 GB RAM',
          'NVIDIA RTX 3070 / AMD RX 6700 XT',
          'DirectX 12',
          '50 GB SSD 空间'
        ]
      },
      tags: ['机甲', '未来', '多人', '竞技'],
      isNew: true,
      isFeatured: true,
      isPopular: true,
      achievements: [
        { name: '新手驾驶员', description: '完成第一次机甲战斗', icon: '🎖️' },
        { name: '精英战士', description: '在排位赛中达到钻石段位', icon: '💎' },
        { name: '机甲大师', description: '解锁所有机甲装备', icon: '🏆' },
        { name: '百战百胜', description: '连续获得100场胜利', icon: '👑' }
      ],
      reviews: [
        { user: 'GameMaster2024', rating: 5, comment: '画面效果令人震撼，机甲战斗非常爽快！', date: '2024-01-20' },
        { user: 'CyberFan', rating: 4, comment: '游戏性很棒，但是学习曲线有点陡峭。', date: '2024-01-18' },
        { user: 'MechWarrior', rating: 5, comment: '这就是我一直在等待的机甲游戏！', date: '2024-01-16' }
      ]
    }
  ]

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        const gameData = mockGames.find(g => g.id === parseInt(id || '0'))
        if (gameData) {
          setGame(gameData)
        } else {
          showToast.error('游戏不存在')
          navigate('/game-center')
        }
      } catch (error) {
        showToast.error('加载游戏信息失败')
        navigate('/game-center')
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id, navigate])

  const handlePlayGame = async () => {
    if (!game) return
    
    setIsPlaying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (game.price === 'Free') {
        showToast.success(`正在启动 ${game.title}...`)
      } else {
        showToast.info(`即将跳转到 ${game.title} 购买页面`)
      }
    } catch (error) {
      showToast.error('启动游戏失败，请稍后重试')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleFavorite = () => {
    if (!game) return
    setIsFavorite(!isFavorite)
    showToast.success(isFavorite ? `已取消收藏 ${game.title}` : `已收藏 ${game.title}`)
  }

  const handleShare = () => {
    if (!game) return
    showToast.info(`分享 ${game.title} 到社交媒体`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载游戏信息中...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-primary-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-tech font-bold text-gray-400 mb-2">游戏不存在</h2>
          <button onClick={() => navigate('/game-center')} className="btn-primary">
            返回游戏中心
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/game-center')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回游戏中心</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Media */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Screenshot */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={game.screenshots[selectedScreenshot]}
                alt={`${game.title} Screenshot ${selectedScreenshot + 1}`}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayGame}
                  disabled={isPlaying}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                    isPlaying
                      ? "bg-gray-500/90 cursor-not-allowed"
                      : "bg-neon-500/90 hover:bg-neon-400/90 hover:scale-110"
                  )}
                >
                  {isPlaying ? (
                    <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-10 h-10 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Screenshot Thumbnails */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {game.screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScreenshot(index)}
                  className={cn(
                    "flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    selectedScreenshot === index
                      ? "border-neon-500 scale-105"
                      : "border-transparent hover:border-gray-600"
                  )}
                >
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Game Details Tabs */}
            <div className="card-gaming">
              <div className="flex border-b border-primary-700 mb-6">
                {[
                  { id: 'overview', label: '游戏概述' },
                  { id: 'requirements', label: '系统要求' },
                  { id: 'reviews', label: '用户评价' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-6 py-3 font-medium transition-colors relative",
                      activeTab === tab.id
                        ? "text-neon-500 border-b-2 border-neon-500"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-tech font-bold text-white mb-3">游戏介绍</h3>
                      <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                        {game.detailedDescription || game.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-tech font-bold text-white mb-3">游戏特色</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {game.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-neon-500 rounded-full" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {game.achievements && (
                      <div>
                        <h3 className="text-lg font-tech font-bold text-white mb-3">成就系统</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {game.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-primary-800 rounded-lg">
                              <span className="text-2xl">{achievement.icon}</span>
                              <div>
                                <h4 className="text-white font-medium">{achievement.name}</h4>
                                <p className="text-gray-400 text-sm">{achievement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'requirements' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-tech font-bold text-white mb-4 flex items-center space-x-2">
                          <Monitor className="w-5 h-5 text-neon-500" />
                          <span>最低配置</span>
                        </h3>
                        <div className="space-y-3">
                          {game.systemRequirements.minimum.map((req, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span className="text-gray-300">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-tech font-bold text-white mb-4 flex items-center space-x-2">
                          <Cpu className="w-5 h-5 text-neon-500" />
                          <span>推荐配置</span>
                        </h3>
                        <div className="space-y-3">
                          {game.systemRequirements.recommended.map((req, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-neon-500 rounded-full" />
                              <span className="text-gray-300">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {game.reviews ? (
                      game.reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-primary-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-neon-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {review.user.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-white font-medium">{review.user}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-4 h-4",
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400 text-sm">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">暂无用户评价</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Game Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Game Header */}
            <div className="card-gaming space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-gaming font-bold text-white mb-2">{game.title}</h1>
                  <p className="text-neon-500 font-medium">{game.developer}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, index) => (
                  <span key={index} className="bg-primary-800 text-gray-300 text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold mb-2",
                  game.price === 'Free' ? 'text-neon-500' : 'text-orange-500'
                )}>
                  {game.price}
                </div>
                <button
                  onClick={handlePlayGame}
                  disabled={isPlaying}
                  className={cn(
                    "w-full btn-primary transition-all duration-300",
                    isPlaying && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isPlaying ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>处理中...</span>
                    </div>
                  ) : (
                    game.price === 'Free' ? '立即游玩' : '购买游戏'
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleFavorite}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors",
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-primary-800 hover:bg-primary-700 text-gray-400 hover:text-white"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                  <span>{isFavorite ? '已收藏' : '收藏'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-primary-800 hover:bg-primary-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* Game Stats */}
            <div className="card-gaming space-y-4">
              <h3 className="text-lg font-tech font-bold text-white">游戏统计</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>评分</span>
                  </div>
                  <span className="text-white font-medium">{game.rating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>在线玩家</span>
                  </div>
                  <span className="text-white font-medium">{(game.players / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>下载量</span>
                  </div>
                  <span className="text-white font-medium">{game.downloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>发布日期</span>
                  </div>
                  <span className="text-white font-medium">{new Date(game.releaseDate).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>

            {/* Genre */}
            <div className="card-gaming space-y-4">
              <h3 className="text-lg font-tech font-bold text-white">游戏类型</h3>
              <div className="flex flex-wrap gap-2">
                {game.genre.map((genre, index) => (
                  <span key={index} className="bg-neon-500/20 text-neon-400 text-sm px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GameDetail