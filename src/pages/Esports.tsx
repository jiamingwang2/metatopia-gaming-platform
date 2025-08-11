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

  const tournaments: Tournament[] = [
    {
      id: 1,
      title: 'METATOPIA 冠军杯',
      game: 'Cyber Warriors',
      description: '年度最大规模的赛博朋克射击游戏锦标赛，顶级选手云集',
      type: 'championship',
      status: 'upcoming',
      startDate: '2024-02-15',
      endDate: '2024-02-18',
      registrationDeadline: '2024-02-10',
      prizePool: '100,000 MTP',
      maxParticipants: 128,
      currentParticipants: 89,
      format: '单淘汰赛',
      rules: ['每场比赛BO3', '禁用特定装备', '官方地图池', '反作弊系统'],
      requirements: ['等级50+', '排位钻石+', '无违规记录', '实名认证'],
      organizer: 'METATOPIA 官方',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=esports%20championship%20tournament%20poster%20with%20cyberpunk%20theme&image_size=landscape_16_9',
      isRegistered: false,
      isFeatured: true,
      difficulty: 'pro'
    },
    {
      id: 2,
      title: '龙域争霸赛',
      game: 'Dragon Realm',
      description: '奇幻MMORPG公会战锦标赛，展现团队协作的极致魅力',
      type: 'tournament',
      status: 'ongoing',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      registrationDeadline: '2024-01-15',
      prizePool: '50,000 MTP',
      maxParticipants: 64,
      currentParticipants: 64,
      format: '公会对战',
      rules: ['5v5团队战', '限制装备等级', '指定地图', '禁用特定技能'],
      requirements: ['公会等级10+', '成员5人+', '无违规记录'],
      organizer: 'Mystic Games',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20dragon%20tournament%20poster%20with%20guild%20battle%20theme&image_size=landscape_16_9',
      isRegistered: true,
      isFeatured: true,
      difficulty: 'advanced'
    },
    {
      id: 3,
      title: '机甲格斗联赛',
      game: 'Mech Arena',
      description: '机甲格斗游戏的顶级联赛，每周定期举办',
      type: 'league',
      status: 'ongoing',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      registrationDeadline: '2024-02-28',
      prizePool: '25,000 MTP',
      maxParticipants: 200,
      currentParticipants: 156,
      format: '积分制联赛',
      rules: ['每周3场比赛', '积分排名', '季后赛淘汰', '机甲限制'],
      requirements: ['等级30+', '排位黄金+', '活跃度要求'],
      organizer: 'Steel Works',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mech%20arena%20league%20poster%20with%20robot%20fighting%20theme&image_size=landscape_16_9',
      isRegistered: false,
      isFeatured: false,
      difficulty: 'intermediate'
    },
    {
      id: 4,
      title: '新手训练营',
      game: 'Cyber Warriors',
      description: '专为新手玩家设计的友谊赛，提供学习和成长的机会',
      type: 'tournament',
      status: 'upcoming',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      registrationDeadline: '2024-01-30',
      prizePool: '5,000 MTP',
      maxParticipants: 32,
      currentParticipants: 18,
      format: '双淘汰赛',
      rules: ['新手友好', '教练指导', '技巧分享', '奖励丰富'],
      requirements: ['等级1-20', '新注册用户', '学习意愿'],
      organizer: 'METATOPIA 学院',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beginner%20esports%20training%20camp%20poster%20with%20friendly%20theme&image_size=landscape_16_9',
      isRegistered: false,
      isFeatured: false,
      difficulty: 'beginner'
    }
  ]

  const leaderboard: Player[] = [
    {
      id: 1,
      username: 'CyberKing2024',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20gamer%20avatar%20with%20neon%20helmet&image_size=square',
      rank: 1,
      points: 2850,
      wins: 127,
      losses: 23,
      winRate: 84.7,
      favoriteGame: 'Cyber Warriors',
      achievements: ['冠军', '连胜王', '神枪手', '团队领袖'],
      level: 89,
      tier: 'master'
    },
    {
      id: 2,
      username: 'DragonSlayer',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20warrior%20avatar%20with%20dragon%20theme&image_size=square',
      rank: 2,
      points: 2720,
      wins: 98,
      losses: 31,
      winRate: 76.0,
      favoriteGame: 'Dragon Realm',
      achievements: ['公会领袖', '龙之征服者', '策略大师'],
      level: 76,
      tier: 'diamond'
    },
    {
      id: 3,
      username: 'MechPilot',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mech%20pilot%20avatar%20with%20robot%20theme&image_size=square',
      rank: 3,
      points: 2580,
      wins: 89,
      losses: 28,
      winRate: 76.1,
      favoriteGame: 'Mech Arena',
      achievements: ['机甲大师', '格斗专家', '技术流'],
      level: 72,
      tier: 'diamond'
    },
    {
      id: 4,
      username: 'CardMaster',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mystical%20card%20master%20avatar%20with%20magic%20theme&image_size=square',
      rank: 4,
      points: 2450,
      wins: 156,
      losses: 44,
      winRate: 78.0,
      favoriteGame: 'Mystic Cards',
      achievements: ['卡牌宗师', '策略天才', '收集家'],
      level: 68,
      tier: 'platinum'
    },
    {
      id: 5,
      username: 'SpeedRacer',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20racer%20avatar%20with%20speed%20theme&image_size=square',
      rank: 5,
      points: 2320,
      wins: 78,
      losses: 22,
      winRate: 78.0,
      favoriteGame: 'Quantum Racing',
      achievements: ['速度之王', '赛道传奇', '完美操控'],
      level: 65,
      tier: 'platinum'
    }
  ]

  const games = ['all', 'Cyber Warriors', 'Dragon Realm', 'Mech Arena', 'Mystic Cards', 'Quantum Racing']
  const statuses = ['all', 'upcoming', 'ongoing', 'completed']
  const types = ['all', 'tournament', 'league', 'championship']

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

  const handleRegisterTournament = async (tournamentId: number, tournamentTitle: string) => {
    setLoadingTournamentId(tournamentId)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const tournament = tournaments.find(t => t.id === tournamentId)
      if (tournament) {
        tournament.isRegistered = !tournament.isRegistered
        if (tournament.isRegistered) {
          tournament.currentParticipants += 1
          showToast.success(`成功报名 ${tournamentTitle}！`)
        } else {
          tournament.currentParticipants -= 1
          showToast.success(`已取消报名 ${tournamentTitle}`)
        }
      }
    } catch (error) {
      showToast.error('操作失败，请稍后重试')
    } finally {
      setLoadingTournamentId(null)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'master': return 'text-red-400'
      case 'diamond': return 'text-blue-400'
      case 'platinum': return 'text-green-400'
      case 'gold': return 'text-yellow-400'
      case 'silver': return 'text-gray-400'
      default: return 'text-orange-400'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'master': return Crown
      case 'diamond': return Star
      case 'platinum': return Medal
      case 'gold': return Trophy
      case 'silver': return Award
      default: return Shield
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'pro': return 'bg-red-500'
      case 'advanced': return 'bg-orange-500'
      case 'intermediate': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'text-green-400'
      case 'upcoming': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const TournamentCard: React.FC<{ tournament: Tournament; index: number }> = ({ tournament, index }) => (
    <ScrollAnimation direction="up" delay={index * 0.1}>
      <AnimatedCard className="group relative overflow-hidden" glowEffect={true}>
        <motion.div className="card-gaming group hover:scale-105 transition-all duration-300 relative overflow-hidden">
      {/* Tournament Image */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={tournament.image}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {tournament.isFeatured && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">精选</span>
          )}
          <span className={cn(
            "text-white text-xs px-2 py-1 rounded font-bold",
            getDifficultyColor(tournament.difficulty)
          )}>
            {tournament.difficulty === 'pro' ? '职业' : 
             tournament.difficulty === 'advanced' ? '高级' :
             tournament.difficulty === 'intermediate' ? '中级' : '新手'}
          </span>
        </div>
        
        {/* Status */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            "text-sm font-bold px-2 py-1 rounded",
            tournament.status === 'ongoing' ? 'bg-green-500' :
            tournament.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
          )}>
            {tournament.status === 'ongoing' ? '进行中' :
             tournament.status === 'upcoming' ? '即将开始' : '已结束'}
          </span>
        </div>
        
        {/* Prize Pool */}
        <div className="absolute bottom-4 right-4">
          <span className="bg-neon-500 text-white text-sm font-bold px-2 py-1 rounded">
            {tournament.prizePool}
          </span>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-tech font-bold text-white mb-1">{tournament.title}</h3>
          <p className="text-neon-500 text-sm font-medium mb-2">{tournament.game}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{tournament.description}</p>
        </div>
        
        {/* Tournament Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>开始时间</span>
            </div>
            <span className="text-white">{new Date(tournament.startDate).toLocaleDateString('zh-CN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>参与人数</span>
            </div>
            <span className="text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400">
              <Trophy className="w-4 h-4" />
              <span>赛制</span>
            </div>
            <span className="text-white">{tournament.format}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">报名进度</span>
            <span className="text-white">{Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}%</span>
          </div>
          <div className="w-full bg-primary-800 rounded-full h-2">
            <div 
              className="bg-neon-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Action Button */}
        <AnimatedButton
          onClick={() => handleRegisterTournament(tournament.id, tournament.title)}
          disabled={loadingTournamentId === tournament.id || tournament.status === 'completed' || 
                   (tournament.currentParticipants >= tournament.maxParticipants && !tournament.isRegistered)}
          variant={tournament.isRegistered ? "danger" : "primary"}
          size="md"
          className="w-full"
        >
          {loadingTournamentId === tournament.id ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>处理中...</span>
            </div>
          ) : tournament.status === 'completed' ? (
            '已结束'
          ) : tournament.currentParticipants >= tournament.maxParticipants && !tournament.isRegistered ? (
            '报名已满'
          ) : tournament.isRegistered ? (
            '取消报名'
          ) : (
            '立即报名'
          )}
        </AnimatedButton>
        </div>
        </motion.div>
      </AnimatedCard>
    </ScrollAnimation>
  )

  const PlayerCard: React.FC<{ player: Player; index: number }> = ({ player, index }) => {
    const TierIcon = getTierIcon(player.tier)
    
    return (
      <ScrollAnimation direction="left" delay={index * 0.1}>
        <AnimatedCard className="hover:scale-105 transition-all duration-300" glowEffect={true}>
          <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
              player.rank === 1 ? 'bg-yellow-500 text-black' :
              player.rank === 2 ? 'bg-gray-400 text-black' :
              player.rank === 3 ? 'bg-orange-500 text-black' :
              'bg-primary-700 text-white'
            )}>
              {player.rank <= 3 ? (
                player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
              ) : (
                player.rank
              )}
            </div>
          </div>
          
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={player.avatar}
              alt={player.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-tech font-bold truncate">{player.username}</h3>
              <TierIcon className={cn("w-4 h-4", getTierColor(player.tier))} />
              <span className="text-xs bg-primary-700 text-gray-300 px-2 py-1 rounded">
                Lv.{player.level}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{player.favoriteGame}</p>
          </div>
          
          {/* Stats */}
          <div className="flex-shrink-0 text-right">
            <div className="text-neon-500 font-bold text-lg">{player.points.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">{player.winRate.toFixed(1)}% 胜率</div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="mt-4 flex flex-wrap gap-1">
          {player.achievements.slice(0, 3).map((achievement, i) => (
            <span key={i} className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded">
              {achievement}
            </span>
          ))}
        </div>
        </AnimatedCard>
      </ScrollAnimation>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-responsive-lg font-gaming font-bold text-white mb-4">
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