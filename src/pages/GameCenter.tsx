import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, Users, Download, Play, Gamepad2, Zap, Trophy, Heart } from 'lucide-react'
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
  developer: string
  releaseDate: string
  isNew: boolean
  isFeatured: boolean
  isPopular: boolean
}

const GameCenter: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [loadingGameId, setLoadingGameId] = useState<number | null>(null)

  // 游戏数据
  const games: Game[] = [
    {
      id: 1,
      title: 'Cyber Warriors',
      description: '未来科幻背景的多人在线战术射击游戏，体验极致的赛博朋克战斗',
      category: 'action',
      genre: ['射击', 'PvP', '科幻'],
      rating: 4.8,
      players: 125000,
      downloads: '2.5M',
      price: 'Free',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20warrior%20game%20cover%20with%20futuristic%20soldier%20and%20neon%20city&image_size=portrait_4_3',
      developer: 'Neon Studios',
      releaseDate: '2024-01-10',
      isNew: false,
      isFeatured: true,
      isPopular: true
    },
    {
      id: 2,
      title: 'Dragon Realm',
      description: '史诗级奇幻MMORPG，探索广阔的魔法世界，体验传奇冒险',
      category: 'rpg',
      genre: ['MMORPG', '奇幻', '冒险'],
      rating: 4.6,
      players: 89000,
      downloads: '1.8M',
      price: '$29.99',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20dragon%20realm%20game%20cover%20with%20epic%20dragon%20and%20magical%20landscape&image_size=portrait_4_3',
      developer: 'Mystic Games',
      releaseDate: '2023-11-15',
      isNew: false,
      isFeatured: true,
      isPopular: true
    },
    {
      id: 3,
      title: 'Space Miners',
      description: '太空采矿模拟游戏，建造你的星际帝国，探索无限宇宙',
      category: 'strategy',
      genre: ['模拟', '策略', '建造'],
      rating: 4.4,
      players: 45000,
      downloads: '800K',
      price: '$19.99',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=space%20mining%20game%20cover%20with%20futuristic%20mining%20ships%20and%20asteroids&image_size=portrait_4_3',
      developer: 'Cosmic Interactive',
      releaseDate: '2024-01-05',
      isNew: true,
      isFeatured: false,
      isPopular: false
    },
    {
      id: 4,
      title: 'Mech Arena',
      description: '机甲格斗竞技游戏，驾驶巨型机甲进行激烈对战',
      category: 'action',
      genre: ['格斗', '机甲', 'PvP'],
      rating: 4.7,
      players: 67000,
      downloads: '1.2M',
      price: 'Free',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mech%20arena%20game%20cover%20with%20giant%20robot%20warriors%20fighting&image_size=portrait_4_3',
      developer: 'Steel Works',
      releaseDate: '2023-12-20',
      isNew: false,
      isFeatured: false,
      isPopular: true
    },
    {
      id: 5,
      title: 'Mystic Cards',
      description: '魔法卡牌策略游戏，收集强大法术卡牌，成为卡牌大师',
      category: 'card',
      genre: ['卡牌', '策略', '收集'],
      rating: 4.5,
      players: 78000,
      downloads: '1.5M',
      price: 'Free',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mystical%20card%20game%20cover%20with%20magical%20cards%20and%20spell%20effects&image_size=portrait_4_3',
      developer: 'Arcane Studios',
      releaseDate: '2023-10-30',
      isNew: false,
      isFeatured: false,
      isPopular: true
    },
    {
      id: 6,
      title: 'Quantum Racing',
      description: '未来赛车竞速游戏，体验超光速的极限竞技',
      category: 'racing',
      genre: ['竞速', '科幻', '多人'],
      rating: 4.3,
      players: 34000,
      downloads: '600K',
      price: '$24.99',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20racing%20game%20cover%20with%20futuristic%20racing%20cars%20and%20neon%20tracks&image_size=portrait_4_3',
      developer: 'Velocity Games',
      releaseDate: '2024-01-12',
      isNew: true,
      isFeatured: false,
      isPopular: false
    }
  ]

  // 分类数据
  const categories = [
    { id: 'all', name: '全部游戏', icon: Gamepad2 },
    { id: 'action', name: '动作游戏', icon: Zap },
    { id: 'rpg', name: '角色扮演', icon: Star },
    { id: 'strategy', name: '策略游戏', icon: Trophy },
    { id: 'card', name: '卡牌游戏', icon: Heart },
    { id: 'racing', name: '竞速游戏', icon: Play }
  ]

  const genres = ['all', '射击', 'PvP', '科幻', 'MMORPG', '奇幻', '冒险', '模拟', '策略', '建造', '格斗', '机甲', '卡牌', '收集', '竞速', '多人']

  const sortOptions = [
    { id: 'popularity', name: '热门度' },
    { id: 'rating', name: '评分' },
    { id: 'newest', name: '最新' },
    { id: 'players', name: '玩家数' },
    { id: 'name', name: '名称' }
  ]

  // 处理游戏启动/购买
  const handlePlayGame = async (e: React.MouseEvent, gameId: number, gameTitle: string, price: string) => {
    e.stopPropagation()
    setLoadingGameId(gameId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (price === 'Free') {
        showToast.success(`正在启动 ${gameTitle}...`)
      } else {
        showToast.info(`即将跳转到 ${gameTitle} 购买页面`)
      }
    } catch (error) {
      showToast.error('操作失败，请稍后重试')
    } finally {
      setLoadingGameId(null)
    }
  }

  // 处理游戏卡片点击
  const handleGameClick = (gameId: number) => {
    navigate(`/games/${gameId}`)
  }

  // 筛选和排序游戏
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory
      const matchesGenre = selectedGenre === 'all' || game.genre.includes(selectedGenre)
      
      return matchesSearch && matchesCategory && matchesGenre
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case 'players':
          return b.players - a.players
        case 'name':
          return a.title.localeCompare(b.title)
        case 'popularity':
        default:
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.players - a.players
      }
    })

    return filtered
  }, [games, searchTerm, selectedCategory, selectedGenre, sortBy])

  // 游戏卡片组件
  const GameCard: React.FC<{ game: Game; index: number }> = ({ game, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "bg-primary-900/50 backdrop-blur-sm border border-primary-800 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-accent-500 hover:shadow-lg hover:shadow-accent-500/20",
        viewMode === 'list' ? 'flex flex-row h-32' : 'flex flex-col'
      )}
      onClick={() => handleGameClick(game.id)}
    >
      {/* 徽章 */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
        {game.isNew && (
          <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded font-bold">新游戏</span>
        )}
        {game.isFeatured && (
          <span className="bg-highlight-500 text-white text-xs px-2 py-1 rounded font-bold">精选</span>
        )}
        {game.isPopular && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">热门</span>
        )}
      </div>

      {/* 游戏图片 */}
      <div className={cn(
        "relative overflow-hidden",
        viewMode === 'list' ? 'w-48 h-full' : 'h-48'
      )}>
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* 价格 */}
        <div className="absolute bottom-4 right-4">
          <span className={cn(
            "text-sm font-bold px-2 py-1 rounded",
            game.price === 'Free' ? 'bg-accent-500 text-white' : 'bg-highlight-500 text-white'
          )}>
            {game.price}
          </span>
        </div>
        
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => handlePlayGame(e, game.id, game.title, game.price)}
            disabled={loadingGameId === game.id}
            className={cn(
              "w-16 h-16 rounded-full bg-accent-500 hover:bg-accent-600 flex items-center justify-center transition-colors",
              loadingGameId === game.id && "opacity-50"
            )}
          >
            {loadingGameId === game.id ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* 游戏信息 */}
      <div className={cn(
        "p-4 space-y-3",
        viewMode === 'list' ? 'flex-1' : ''
      )}>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{game.title}</h3>
          <p className={cn(
            "text-gray-400 text-sm",
            viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
          )}>
            {game.description}
          </p>
        </div>
        
        {/* 开发商和发布日期 */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent-500 font-medium">{game.developer}</span>
          <span className="text-gray-400">{new Date(game.releaseDate).getFullYear()}</span>
        </div>
        
        {/* 类型标签 */}
        <div className="flex flex-wrap gap-1">
          {game.genre.slice(0, 3).map((genre) => (
            <span key={genre} className="bg-primary-800 text-gray-300 text-xs px-2 py-1 rounded">
              {genre}
            </span>
          ))}
        </div>
        
        {/* 统计信息 */}
        <div className={cn(
          "grid gap-3 text-sm",
          viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'
        )}>
          <div className="flex items-center space-x-1 text-gray-400">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{game.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{Math.round(game.players / 1000)}K</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Download className="w-4 h-4" />
            <span>{game.downloads}</span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        {viewMode === 'grid' && (
          <button
            onClick={(e) => handlePlayGame(e, game.id, game.title, game.price)}
            disabled={loadingGameId === game.id}
            className={cn(
              "w-full bg-accent-500 hover:bg-accent-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2",
              loadingGameId === game.id && "opacity-50"
            )}
          >
            {loadingGameId === game.id ? (
              <span>处理中...</span>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{game.price === 'Free' ? '立即游玩' : '购买游戏'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-accent-400 to-highlight-400 bg-clip-text text-transparent">
              游戏中心
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            探索精彩的GameFi游戏世界，发现你的下一个最爱
          </p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* 搜索栏 */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索游戏、开发商或类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-primary-900/50 border border-primary-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 transition-colors"
            />
          </div>

          {/* 筛选控制 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-accent-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid' ? 'bg-accent-500 text-white' : 'bg-primary-800 text-gray-400 hover:text-white'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list' ? 'bg-accent-500 text-white' : 'bg-primary-800 text-gray-400 hover:text-white'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 展开的筛选器 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary-900/50 backdrop-blur-sm border border-primary-800 rounded-xl p-6 space-y-6"
            >
              {/* 分类 */}
              <div>
                <h3 className="text-white font-medium mb-3">游戏分类</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                          selectedCategory === category.id
                            ? 'bg-accent-500 text-white'
                            : 'bg-primary-800 text-gray-400 hover:text-white hover:bg-primary-700'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* 类型 */}
              <div>
                <h3 className="text-white font-medium mb-3">游戏类型</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm transition-colors",
                        selectedGenre === genre
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-800 text-gray-400 hover:text-white hover:bg-primary-700'
                      )}
                    >
                      {genre === 'all' ? '全部' : genre}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 结果计数 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            找到 <span className="text-accent-500 font-medium">{filteredGames.length}</span> 款游戏
          </p>
        </motion.div>

        {/* 游戏网格/列表 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "gap-6",
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col space-y-4'
          )}
        >
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </motion.div>

        {/* 空状态 */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">未找到匹配的游戏</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedGenre('all')
              }}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              重置筛选
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default GameCenter