import React, { useState, useMemo } from 'react'
import { Search, Filter, Trophy, Users, Calendar, Clock, MapPin, Star, Medal, Crown, Award, Gamepad2, Zap, Target, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import ScrollAnimation from '../components/ScrollAnimation'
import AnimatedInput from '../components/AnimatedInput'

interface Tournament {
  id: number
  title: string
  game: string
  description: string
  type: 'tournament' | 'league' | 'championship'
  status: 'upcoming' | 'ongoing' | 'completed'
  startDate: string
  endDate: string
  registrationDeadline: string
  prizePool: string
  maxParticipants: number
  currentParticipants: number
  format: string
  rules: string[]
  requirements: string[]
  organizer: string
  image: string
  isRegistered: boolean
  isFeatured: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'pro'
}

interface Player {
  id: number
  username: string
  avatar: string
  rank: number
  points: number
  wins: number
  losses: number
  winRate: number
  favoriteGame: string
  achievements: string[]
  level: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master'
}

const Esports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'leaderboard' | 'my-matches'>('tournaments')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loadingTournamentId, setLoadingTournamentId] = useState<number | null>(null)

  // Mock tournament data
  const tournaments: Tournament[] = [
    {
      id: 1,
      title: 'METATOPIA 冠军杯',
      game: '龙域传说',
      description: '年度最大规模的龙域传说锦标赛，汇聚全球顶尖玩家',
      type: 'championship',
      status: 'upcoming',
      startDate: '2024-02-15',
      endDate: '2024-02-18',
      registrationDeadline: '2024-02-10',
      prizePool: '500,000 MTP',
      maxParticipants: 128,
      currentParticipants: 89,
      format: '单淘汰赛',
      rules: [
        '每场比赛最多30分钟',
        '禁止使用外挂或作弊工具',
        '必须使用官方客户端',
        '比赛期间禁止暂停'
      ],
      requirements: [
        '等级达到50级以上',
        '排位赛段位钻石以上',
        '近30天无违规记录'
      ],
      organizer: 'METATOPIA 官方',
      image: '/images/tournaments/championship-cup.jpg',
      isRegistered: false,
      isFeatured: true,
      difficulty: 'pro'
    },
    {
      id: 2,
      title: '龙域争霸赛',
      game: '龙域传说',
      description: '每周定期举办的竞技赛事，适合各个水平的玩家参与',
      type: 'tournament',
      status: 'ongoing',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      registrationDeadline: '2024-01-18',
      prizePool: '50,000 MTP',
      maxParticipants: 64,
      currentParticipants: 64,
      format: '瑞士轮制',
      rules: [
        '每场比赛最多20分钟',
        '允许使用游戏内道具',
        '禁止恶意拖延时间'
      ],
      requirements: [
        '等级达到30级以上',
        '完成新手教程'
      ],
      organizer: '龙域公会联盟',
      image: '/images/tournaments/dragon-battle.jpg',
      isRegistered: true,
      isFeatured: false,
      difficulty: 'intermediate'
    },
    {
      id: 3,
      title: '机甲格斗联赛',
      game: '机甲战士',
      description: '机甲战士官方联赛第三赛季，展现你的机甲操控技巧',
      type: 'league',
      status: 'upcoming',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      registrationDeadline: '2024-01-28',
      prizePool: '200,000 MTP',
      maxParticipants: 256,
      currentParticipants: 156,
      format: '积分制联赛',
      rules: [
        '每周进行3场比赛',
        '使用标准机甲配置',
        '禁止使用付费强化道具'
      ],
      requirements: [
        '拥有至少3台不同类型机甲',
        '联赛经验值达到1000点',
        '通过机甲操控认证'
      ],
      organizer: '机甲战士联盟',
      image: '/images/tournaments/mech-league.jpg',
      isRegistered: false,
      isFeatured: true,
      difficulty: 'advanced'
    },
    {
      id: 4,
      title: '新手训练营',
      game: '全游戏通用',
      description: '专为新玩家设计的友谊赛，学习竞技技巧和策略',
      type: 'tournament',
      status: 'upcoming',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      registrationDeadline: '2024-01-24',
      prizePool: '10,000 MTP',
      maxParticipants: 32,
      currentParticipants: 18,
      format: '教学赛制',
      rules: [
        '每场比赛有导师指导',
        '重点在于学习而非竞争',
        '允许中途询问和暂停'
      ],
      requirements: [
        '游戏时间少于100小时',
        '等级在20级以下',
        '首次参加竞技赛事'
      ],
      organizer: 'METATOPIA 教育部',
      image: '/images/tournaments/training-camp.jpg',
      isRegistered: false,
      isFeatured: false,
      difficulty: 'beginner'
    }
  ]

  // Mock leaderboard data
  const leaderboard: Player[] = [
    {
      id: 1,
      username: 'CyberKing2024',
      avatar: '/images/avatars/cyber-king.jpg',
      rank: 1,
      points: 15420,
      wins: 342,
      losses: 28,
      winRate: 92.4,
      favoriteGame: '龙域传说',
      achievements: ['传奇大师', '连胜王者', '竞技之神'],
      level: 89,
      tier: 'master'
    },
    {
      id: 2,
      username: 'DragonSlayer',
      avatar: '/images/avatars/dragon-slayer.jpg',
      rank: 2,
      points: 14890,
      wins: 298,
      losses: 45,
      winRate: 86.9,
      favoriteGame: '龙域传说',
      achievements: ['龙族克星', '战术大师'],
      level: 85,
      tier: 'master'
    },
    {
      id: 3,
      username: 'MechWarrior',
      avatar: '/images/avatars/mech-warrior.jpg',
      rank: 3,
      points: 13567,
      wins: 267,
      losses: 52,
      winRate: 83.7,
      favoriteGame: '机甲战士',
      achievements: ['机甲专家', '联赛冠军'],
      level: 82,
      tier: 'diamond'
    },
    {
      id: 4,
      username: 'ShadowNinja',
      avatar: '/images/avatars/shadow-ninja.jpg',
      rank: 4,
      points: 12234,
      wins: 234,
      losses: 67,
      winRate: 77.7,
      favoriteGame: '暗影忍者',
      achievements: ['暗影大师', '潜行专家'],
      level: 78,
      tier: 'diamond'
    },
    {
      id: 5,
      username: 'StarCommander',
      avatar: '/images/avatars/star-commander.jpg',
      rank: 5,
      points: 11456,
      wins: 201,
      losses: 89,
      winRate: 69.3,
      favoriteGame: '星际指挥官',
      achievements: ['星际战略家', '舰队司令'],
      level: 75,
      tier: 'platinum'
    }
  ]

  // Filter options
  const games = ['all', '龙域传说', '机甲战士', '暗影忍者', '星际指挥官', '全游戏通用']
  const statuses = ['all', 'upcoming', 'ongoing', 'completed']
  const types = ['all', 'tournament', 'league', 'championship']

  // Filter tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament => {
      const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tournament.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGame = selectedGame === 'all' || tournament.game === selectedGame
      const matchesStatus = selectedStatus === 'all' || tournament.status === selectedStatus
      const matchesType = selectedType === 'all' || tournament.type === selectedType
      
      return matchesSearch && matchesGame && matchesStatus && matchesType
    })
  }, [tournaments, searchTerm, selectedGame, selectedStatus, selectedType])

  // Handle tournament registration
  const handleTournamentAction = async (tournamentId: number) => {
    setLoadingTournamentId(tournamentId)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const tournament = tournaments.find(t => t.id === tournamentId)
      if (tournament) {
        if (tournament.isRegistered) {
          showToast('已取消报名', 'success')
        } else {
          showToast('报名成功！', 'success')
        }
        // Update tournament registration status
        tournament.isRegistered = !tournament.isRegistered
        if (tournament.isRegistered) {
          tournament.currentParticipants += 1
        } else {
          tournament.currentParticipants -= 1
        }
      }
    } catch (error) {
      showToast('操作失败，请重试', 'error')
    } finally {
      setLoadingTournamentId(null)
    }
  }

  // Helper functions
  const getTierColor = (tier: Player['tier']) => {
    const colors = {
      bronze: 'text-orange-400',
      silver: 'text-gray-300',
      gold: 'text-yellow-400',
      platinum: 'text-cyan-400',
      diamond: 'text-blue-400',
      master: 'text-purple-400'
    }
    return colors[tier]
  }

  const getTierIcon = (tier: Player['tier']) => {
    const icons = {
      bronze: Shield,
      silver: Medal,
      gold: Award,
      platinum: Star,
      diamond: Zap,
      master: Crown
    }
    return icons[tier]
  }

  const getDifficultyColor = (difficulty: Tournament['difficulty']) => {
    const colors = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-orange-500',
      pro: 'bg-red-500'
    }
    return colors[difficulty]
  }

  const getStatusColor = (status: Tournament['status']) => {
    const colors = {
      upcoming: 'bg-blue-500',
      ongoing: 'bg-green-500',
      completed: 'bg-gray-500'
    }
    return colors[status]
  }

  const getStatusText = (status: Tournament['status']) => {
    const texts = {
      upcoming: '即将开始',
      ongoing: '进行中',
      completed: '已结束'
    }
    return texts[status]
  }

  // Tournament Card Component
  const TournamentCard: React.FC<{ tournament: Tournament; index: number }> = ({ tournament, index }) => {
    const isLoading = loadingTournamentId === tournament.id
    const canRegister = tournament.status === 'upcoming' && tournament.currentParticipants < tournament.maxParticipants
    const registrationFull = tournament.currentParticipants >= tournament.maxParticipants
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <AnimatedCard className="card-gaming overflow-hidden group">
          {/* Tournament Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={tournament.image}
              alt={tournament.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {tournament.isFeatured && (
                <span className="px-2 py-1 bg-neon-500 text-black text-xs font-bold rounded">
                  精选
                </span>
              )}
              <span className={cn(
                "px-2 py-1 text-white text-xs font-medium rounded",
                getDifficultyColor(tournament.difficulty)
              )}>
                {tournament.difficulty === 'beginner' && '新手'}
                {tournament.difficulty === 'intermediate' && '中级'}
                {tournament.difficulty === 'advanced' && '高级'}
                {tournament.difficulty === 'pro' && '专业'}
              </span>
            </div>
            
            <div className="absolute top-4 right-4">
              <span className={cn(
                "px-2 py-1 text-white text-xs font-medium rounded",
                getStatusColor(tournament.status)
              )}>
                {getStatusText(tournament.status)}
              </span>
            </div>
            
            {/* Prize Pool */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-2 text-neon-500">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">{tournament.prizePool}</span>
              </div>
            </div>
          </div>
          
          {/* Tournament Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-tech font-bold text-white mb-1">
                {tournament.title}
              </h3>
              <p className="text-neon-500 text-sm font-medium">{tournament.game}</p>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {tournament.description}
              </p>
            </div>
            
            {/* Tournament Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>开始时间: {new Date(tournament.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                <span>{tournament.currentParticipants}/{tournament.maxParticipants} 参与者</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Target className="w-4 h-4 mr-2" />
                <span>赛制: {tournament.format}</span>
              </div>
            </div>
            
            {/* Registration Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">报名进度</span>
                <span className="text-white">
                  {Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}%
                </span>
              </div>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-neon-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Action Button */}
            <div className="pt-2">
              {tournament.status === 'completed' ? (
                <AnimatedButton
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled
                >
                  已结束
                </AnimatedButton>
              ) : registrationFull ? (
                <AnimatedButton
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled
                >
                  报名已满
                </AnimatedButton>
              ) : tournament.isRegistered ? (
                <AnimatedButton
                  onClick={() => handleTournamentAction(tournament.id)}
                  variant="secondary"
                  size="md"
                  className="w-full"
                  loading={isLoading}
                >
                  取消报名
                </AnimatedButton>
              ) : canRegister ? (
                <AnimatedButton
                  onClick={() => handleTournamentAction(tournament.id)}
                  variant="primary"
                  size="md"
                  className="w-full"
                  loading={isLoading}
                >
                  立即报名
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled
                >
                  报名已截止
                </AnimatedButton>
              )}
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    )
  }

  // Player Card Component
  const PlayerCard: React.FC<{ player: Player; index: number }> = ({ player, index }) => {
    const TierIcon = getTierIcon(player.tier)
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <AnimatedCard className="card-gaming p-6">
          <div className="flex items-center space-x-4">
            {/* Rank */}
            <div className="flex-shrink-0">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                player.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black" :
                player.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500 text-black" :
                player.rank === 3 ? "bg-gradient-to-r from-orange-400 to-orange-600 text-black" :
                "bg-primary-700 text-white"
              )}>
                {player.rank}
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-8 h-8 rounded-full"
                />
                <h3 className="font-tech font-bold text-white truncate">
                  {player.username}
                </h3>
                <TierIcon className={cn("w-4 h-4", getTierColor(player.tier))} />
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Lv.{player.level}</span>
                <span>{player.favoriteGame}</span>
                <span>{player.points.toLocaleString()} 积分</span>
                <span>{player.winRate}% 胜率</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {player.achievements.slice(0, 3).map((achievement, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-neon-500/20 text-neon-500 text-xs rounded"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="text-green-400 font-bold">{player.wins}胜</div>
              <div className="text-red-400 text-sm">{player.losses}负</div>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-tech font-bold mb-4">
            <span className="text-gradient">电竞竞技</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            参与激烈的电竞赛事，展现你的技能，赢取丰厚奖励
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-primary-800 rounded-lg p-1">
            {[
              { id: 'tournaments', label: '赛事中心', icon: Trophy },
              { id: 'leaderboard', label: '排行榜', icon: Crown },
              { id: 'my-matches', label: '我的比赛', icon: Gamepad2 }
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

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <AnimatedInput
                  type="text"
                  placeholder="搜索赛事、游戏或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  className="w-full"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <AnimatedButton
                  onClick={() => setShowFilters(!showFilters)}
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>筛选</span>
                </AnimatedButton>
                
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-neon-500"
                >
                  <option value="all">全部游戏</option>
                  {games.slice(1).map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-neon-500"
                >
                  <option value="all">全部状态</option>
                  <option value="upcoming">即将开始</option>
                  <option value="ongoing">进行中</option>
                  <option value="completed">已结束</option>
                </select>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card-gaming p-6"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-3">赛事类型</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', name: '全部类型' },
                          { id: 'tournament', name: '锦标赛' },
                          { id: 'league', name: '联赛' },
                          { id: 'championship', name: '冠军赛' }
                        ].map(type => (
                          <AnimatedButton
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            variant={selectedType === type.id ? "primary" : "secondary"}
                            size="sm"
                          >
                            {type.name}
                          </AnimatedButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Results Count */}
            <div className="text-center">
              <p className="text-gray-400">
                找到 <span className="text-neon-500 font-medium">{filteredTournaments.length}</span> 个赛事
              </p>
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament, index) => (
                <TournamentCard key={tournament.id} tournament={tournament} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredTournaments.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">未找到匹配的赛事</h3>
                <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
                <AnimatedButton
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedGame('all')
                    setSelectedStatus('all')
                    setSelectedType('all')
                  }}
                  variant="primary"
                  size="md"
                >
                  重置筛选
                </AnimatedButton>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-tech font-bold text-white mb-2">全球排行榜</h2>
              <p className="text-gray-400">顶级玩家实时排名</p>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* My Matches Tab */}
        {activeTab === 'my-matches' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">我的比赛</h3>
            <p className="text-gray-500 mb-6">这里将显示你参与的所有比赛记录</p>
            <AnimatedButton variant="primary" size="md">
              查看比赛历史
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Esports