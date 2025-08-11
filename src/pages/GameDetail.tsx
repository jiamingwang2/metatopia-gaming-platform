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
  const [activeTab, setActiveTab] = useState('overview')

  // Mock game data
  const mockGame: Game = {
    id: 1,
    title: 'Cyber Warriors',
    description: '在未来世界中体验激烈的机甲战斗',
    category: '动作游戏',
    genre: ['射击', 'PvP', '科幻'],
    rating: 4.8,
    players: 125000,
    downloads: '2.5M',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop'
    ],
    developer: 'Future Games Studio',
    releaseDate: '2024-01-15',
    features: [
      '多人在线对战',
      '自定义机甲',
      '战术团队合作',
      '排位竞技系统',
      '丰富的武器系统'
    ],
    systemRequirements: {
      minimum: [
        'Windows 10 64位',
        'Intel i5-8400 / AMD Ryzen 5 2600',
        '8 GB RAM',
        'GTX 1060 / RX 580',
        '50 GB 可用空间'
      ],
      recommended: [
        'Windows 11 64位',
        'Intel i7-10700K / AMD Ryzen 7 3700X',
        '16 GB RAM',
        'RTX 3070 / RX 6700 XT',
        '50 GB SSD 空间'
      ]
    },
    tags: ['多人', '竞技', '机甲', '射击', '科幻'],
    isNew: true,
    isFeatured: true,
    isPopular: true,
    detailedDescription: 'Cyber Warriors 是一款设定在2087年的未来世界的多人在线战斗游戏。玩家将驾驶高度定制化的机甲，在各种未来战场上与其他玩家展开激烈对战。游戏采用先进的物理引擎，提供真实的机甲操控体验和爆炸效果。',
    gameplayVideo: 'https://example.com/gameplay-video.mp4',
    achievements: [
      { name: '新手上路', description: '完成第一场对战', icon: '🎯' },
      { name: '机甲大师', description: '获得100场胜利', icon: '🏆' },
      { name: '团队合作', description: '与队友配合获得胜利', icon: '🤝' },
      { name: '无敌战士', description: '连续获得10场胜利', icon: '⚡' }
    ],
    reviews: [
      {
        user: '游戏达人',
        rating: 5,
        comment: '画面精美，操作流畅，机甲设计很棒！',
        date: '2024-01-20'
      },
      {
        user: '科幻迷',
        rating: 4,
        comment: '很好的科幻题材游戏，就是有时候匹配时间有点长。',
        date: '2024-01-18'
      },
      {
        user: '竞技玩家',
        rating: 5,
        comment: '排位系统很公平，技能平衡做得不错。',
        date: '2024-01-16'
      }
    ]
  }

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (id === '1') {
          setGame(mockGame)
        } else {
          showToast('游戏不存在', 'error')
          navigate('/game-center')
        }
      } catch (error) {
        showToast('加载游戏详情失败', 'error')
        navigate('/game-center')
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [id, navigate])

  const handlePlayGame = async () => {
    if (!game) return
    
    setIsPlaying(true)
    try {
      // Simulate game launch
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (game.price === 'Free') {
        showToast('游戏启动中...', 'success')
      } else {
        showToast('请先购买游戏', 'warning')
      }
    } catch (error) {
      showToast('启动游戏失败', 'error')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    showToast(isFavorite ? '已取消收藏' : '已添加到收藏', 'success')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game?.title,
        text: game?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('链接已复制到剪贴板', 'success')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载游戏详情中...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">游戏不存在</p>
          <button
            onClick={() => navigate('/game-center')}
            className="btn-primary"
          >
            返回游戏中心
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/game-center')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回游戏中心</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media & Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Game Media */}
            <div className="card-gaming">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={game.screenshots[selectedScreenshot]}
                  alt={`${game.title} screenshot ${selectedScreenshot + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="w-16 h-16 bg-neon-500 rounded-full flex items-center justify-center hover:bg-neon-400 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
              </div>
              
              {/* Screenshot Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {game.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScreenshot(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-colors",
                      selectedScreenshot === index ? "border-neon-500" : "border-transparent"
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
            </div>

            {/* Game Details Tabs */}
            <div className="card-gaming">
              <div className="flex space-x-1 mb-6 bg-primary-800 rounded-lg p-1">
                {[
                  { id: 'overview', label: '游戏概述', icon: Gamepad2 },
                  { id: 'requirements', label: '系统要求', icon: Monitor },
                  { id: 'reviews', label: '用户评价', icon: Star }
                ].map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors",
                        activeTab === tab.id
                          ? "bg-neon-500 text-white"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Game Description */}
                    <div>
                      <h3 className="text-lg font-tech font-bold text-white mb-3">游戏介绍</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {game.detailedDescription || game.description}
                      </p>
                    </div>

                    {/* Game Features */}
                    <div>
                      <h3 className="text-lg font-tech font-bold text-white mb-3 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-neon-500" />
                        <span>游戏特色</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {game.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-primary-800 rounded-lg">
                            <div className="w-2 h-2 bg-neon-500 rounded-full" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    {game.achievements && (
                      <div>
                        <h3 className="text-lg font-tech font-bold text-white mb-3 flex items-center space-x-2">
                          <Trophy className="w-5 h-5 text-neon-500" />
                          <span>成就系统</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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