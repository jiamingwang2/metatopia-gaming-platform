import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Star, Users, DollarSign, Clock, Filter, Grid, List, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'

interface Game {
  id: number
  title: string
  category: string
  rating: number
  players: string
  earnings: string
  change: number
  image: string
  description: string
  tags: string[]
  playTime: string
}

const PopularGames: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('热度')
  const [loadingGameId, setLoadingGameId] = useState<number | null>(null)

  // 处理游戏卡片点击
  const handleGameClick = (gameId: number, gameName: string) => {
    console.log(`查看游戏详情: ${gameName} (ID: ${gameId})`)
    showToast.info(`即将进入 ${gameName} 详情页面`)
  }

  // 处理游戏启动
  const handlePlayGame = async (e: React.MouseEvent, gameId: number, gameName: string) => {
    e.stopPropagation()
    setLoadingGameId(gameId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showToast.success(`正在启动 ${gameName}...`)
    } catch (error) {
      showToast.error('游戏启动失败，请稍后重试')
    } finally {
      setLoadingGameId(null)
    }
  }

  const categories = ['全部', 'RPG', '策略', 'MMORPG', '射击', '卡牌', '模拟']
  const sortOptions = ['热度', '收益', '评分', '玩家数']

  const popularGames: Game[] = [
    {
      id: 1,
      title: 'Cyber Warriors',
      category: 'RPG',
      rating: 4.8,
      players: '2.5M',
      earnings: '$125/月',
      change: 15.2,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20cyberpunk%20warrior%20game%20cover%20art%20with%20neon%20lights%20and%20digital%20effects&image_size=landscape_4_3',
      description: '在赛博朋克世界中战斗，获得NFT装备和代币奖励',
      tags: ['PvP', 'NFT', 'Play-to-Earn'],
      playTime: '平均2小时/天'
    },
    {
      id: 2,
      title: 'Space Miners',
      category: '策略',
      rating: 4.6,
      players: '1.8M',
      earnings: '$89/月',
      change: 8.7,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=space%20mining%20game%20with%20spaceships%20and%20asteroids%20in%20deep%20space&image_size=landscape_4_3',
      description: '在太空中挖掘稀有矿物，建立你的采矿帝国',
      tags: ['策略', '建造', '经济'],
      playTime: '平均1.5小时/天'
    },
    {
      id: 3,
      title: 'Dragon Realm',
      category: 'MMORPG',
      rating: 4.9,
      players: '3.2M',
      earnings: '$200/月',
      change: 22.1,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20dragon%20realm%20game%20with%20magical%20creatures%20and%20epic%20landscapes&image_size=landscape_4_3',
      description: '史诗级奇幻MMORPG，与龙共舞，征服魔法世界',
      tags: ['MMORPG', '公会', '副本'],
      playTime: '平均3小时/天'
    },
    {
      id: 4,
      title: 'Mech Arena',
      category: '射击',
      rating: 4.7,
      players: '2.1M',
      earnings: '$156/月',
      change: -3.2,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=giant%20mech%20robots%20fighting%20in%20futuristic%20arena%20with%20explosions&image_size=landscape_4_3',
      description: '驾驶巨型机甲在竞技场中战斗，赢取丰厚奖励',
      tags: ['PvP', '竞技', '机甲'],
      playTime: '平均1小时/天'
    },
    {
      id: 5,
      title: 'Mystic Cards',
      category: '卡牌',
      rating: 4.5,
      players: '1.5M',
      earnings: '$67/月',
      change: 12.8,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=magical%20trading%20card%20game%20with%20mystical%20creatures%20and%20spells&image_size=landscape_4_3',
      description: '收集神秘卡牌，构建最强套牌，参与锦标赛',
      tags: ['卡牌', '收集', '锦标赛'],
      playTime: '平均45分钟/天'
    },
    {
      id: 6,
      title: 'City Builder',
      category: '模拟',
      rating: 4.4,
      players: '1.2M',
      earnings: '$78/月',
      change: 5.9,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20city%20building%20simulation%20game%20with%20skyscrapers%20and%20technology&image_size=landscape_4_3',
      description: '建造未来城市，管理资源，发展经济',
      tags: ['建造', '管理', '经济'],
      playTime: '平均2.5小时/天'
    }
  ]

  const filteredGames = popularGames.filter(game => 
    selectedCategory === '全部' || game.category === selectedCategory
  )

  return (
    <section className="py-16 bg-primary-900/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-responsive-lg font-gaming font-bold text-white mb-4">
            <span className="text-gradient">热门游戏</span>
            排行榜
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            发现最受欢迎的GameFi项目，查看实时数据和收益趋势
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between mb-8 space-y-4 lg:space-y-0"
        >
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    selectedCategory === category
                      ? "bg-neon-500 text-white"
                      : "bg-primary-800 text-gray-300 hover:bg-primary-700 hover:text-white"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-primary-800 border border-neon-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-500"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-primary-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded transition-colors duration-300",
                  viewMode === 'grid' ? "bg-neon-500 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded transition-colors duration-300",
                  viewMode === 'list' ? "bg-neon-500 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Games Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
          )}
        >
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "card-gaming group cursor-pointer hover:scale-105 transition-all duration-300",
                viewMode === 'list' && "flex items-center space-x-6 p-4"
              )}
              onClick={() => handleGameClick(game.id, game.title)}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-neon-500 to-esports-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>

                  {/* Game Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handlePlayGame(e, game.id, game.title)}
                        disabled={loadingGameId === game.id}
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                          loadingGameId === game.id
                            ? "bg-gray-500/90 cursor-not-allowed"
                            : "bg-neon-500/90 hover:bg-neon-400/90 hover:scale-110"
                        )}
                      >
                        {loadingGameId === game.id ? (
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </button>
                    </div>
                    
                    {/* Change Indicator */}
                    <div className={cn(
                      "absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold",
                      game.change > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {game.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{Math.abs(game.change)}%</span>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-tech font-bold text-white">{game.title}</h3>
                      <span className="text-neon-500 text-sm font-medium">{game.category}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm">{game.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {game.tags.map((tag) => (
                        <span key={tag} className="bg-primary-800 text-gray-300 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{game.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{game.players}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <DollarSign className="w-4 h-4 text-neon-500" />
                        <span className="text-neon-500 font-medium">{game.earnings}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{game.playTime}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <>
                  {/* Rank */}
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-500 to-esports-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* Game Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-tech font-bold text-white truncate">{game.title}</h3>
                      <span className="text-neon-500 text-sm font-medium">{game.category}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2 truncate">{game.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{game.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{game.players}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-neon-500" />
                        <span className="text-neon-500 font-medium">{game.earnings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Change Indicator */}
                  <div className={cn(
                    "flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0",
                    game.change > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {game.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(game.change)}%</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => showToast.info('即将加载更多游戏')}
            className="btn-secondary hover:scale-105 transition-transform duration-300"
          >
            加载更多游戏
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default PopularGames