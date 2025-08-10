import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Trophy, Users, DollarSign, Play, Eye, MapPin, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'

interface Event {
  id: number
  title: string
  game: string
  status: 'live' | 'upcoming' | 'finished'
  startTime: string
  endTime?: string
  participants: number
  maxParticipants: number
  prizePool: string
  image: string
  description: string
  organizer: string
  viewers?: number
  location: string
  tags: string[]
}

const LiveEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'calendar'>('live')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null)

  // 处理活动卡片点击
  const handleEventClick = (eventId: number, eventTitle: string) => {
    console.log(`查看活动详情: ${eventTitle} (ID: ${eventId})`)
    showToast.info(`即将进入 ${eventTitle} 详情页面`)
  }

  // 处理观看直播/参加活动
  const handleJoinEvent = async (e: React.MouseEvent, eventId: number, eventTitle: string, status: string) => {
    e.stopPropagation()
    setLoadingEventId(eventId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (status === 'live') {
        showToast.success(`正在进入 ${eventTitle} 直播间...`)
      } else {
        showToast.success(`已报名参加 ${eventTitle}！`)
      }
    } catch (error) {
      showToast.error('操作失败，请稍后重试')
    } finally {
      setLoadingEventId(null)
    }
  }

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const events: Event[] = [
    {
      id: 1,
      title: 'Cyber Warriors 世界锦标赛',
      game: 'Cyber Warriors',
      status: 'live',
      startTime: '2024-01-15T14:00:00Z',
      endTime: '2024-01-15T18:00:00Z',
      participants: 128,
      maxParticipants: 128,
      prizePool: '$50,000',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=esports%20tournament%20arena%20with%20cyberpunk%20theme%20and%20gaming%20setup&image_size=landscape_16_9',
      description: '全球顶级玩家齐聚一堂，争夺年度总冠军',
      organizer: 'NEXUS Gaming',
      viewers: 25680,
      location: '线上赛事',
      tags: ['锦标赛', 'PvP', '直播']
    },
    {
      id: 2,
      title: 'Dragon Realm 公会战',
      game: 'Dragon Realm',
      status: 'live',
      startTime: '2024-01-15T16:00:00Z',
      endTime: '2024-01-15T20:00:00Z',
      participants: 500,
      maxParticipants: 500,
      prizePool: '$25,000',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20guild%20war%20battle%20scene%20with%20dragons%20and%20magic&image_size=landscape_16_9',
      description: '史诗级公会对战，争夺服务器霸主地位',
      organizer: 'Dragon Studios',
      viewers: 18420,
      location: '游戏内',
      tags: ['公会战', 'MMORPG', '团队']
    },
    {
      id: 3,
      title: 'Space Miners 速建挑战',
      game: 'Space Miners',
      status: 'upcoming',
      startTime: '2024-01-16T10:00:00Z',
      endTime: '2024-01-16T12:00:00Z',
      participants: 45,
      maxParticipants: 100,
      prizePool: '$10,000',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=space%20mining%20competition%20with%20futuristic%20spaceships%20and%20mining%20equipment&image_size=landscape_16_9',
      description: '2小时内建造最高效的采矿基地',
      organizer: 'Cosmic Games',
      location: '线上赛事',
      tags: ['速建', '策略', '限时']
    },
    {
      id: 4,
      title: 'Mech Arena 新手杯',
      game: 'Mech Arena',
      status: 'upcoming',
      startTime: '2024-01-16T15:00:00Z',
      endTime: '2024-01-16T17:00:00Z',
      participants: 32,
      maxParticipants: 64,
      prizePool: '$5,000',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mech%20robot%20tournament%20arena%20with%20futuristic%20stadium&image_size=landscape_16_9',
      description: '专为新手玩家设计的机甲对战赛事',
      organizer: 'Mech Studios',
      location: '竞技场',
      tags: ['新手友好', '机甲', 'PvP']
    },
    {
      id: 5,
      title: 'Mystic Cards 大师赛',
      game: 'Mystic Cards',
      status: 'upcoming',
      startTime: '2024-01-17T12:00:00Z',
      endTime: '2024-01-17T16:00:00Z',
      participants: 256,
      maxParticipants: 256,
      prizePool: '$30,000',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=magical%20card%20tournament%20with%20mystical%20arena%20and%20spell%20effects&image_size=landscape_16_9',
      description: '顶级卡牌大师的终极对决',
      organizer: 'Mystic Entertainment',
      location: '魔法竞技场',
      tags: ['卡牌', '策略', '大师级']
    }
  ]

  const liveEvents = events.filter(event => event.status === 'live')
  const upcomingEvents = events.filter(event => event.status === 'upcoming')

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Shanghai'
    })
  }

  const getTimeUntilEvent = (startTime: string) => {
    const now = currentTime.getTime()
    const eventTime = new Date(startTime).getTime()
    const diff = eventTime - now
    
    if (diff <= 0) return '已开始'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟后开始`
    }
    return `${minutes}分钟后开始`
  }

  const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming group cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden"
      onClick={() => handleEventClick(event.id, event.title)}
    >
      {/* Live Indicator */}
      {event.status === 'live' && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span>直播中</span>
        </div>
      )}

      {/* Event Image */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Viewers Count for Live Events */}
        {event.status === 'live' && event.viewers && (
          <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
            <Eye className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm font-medium">{event.viewers.toLocaleString()}</span>
          </div>
        )}
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => handleJoinEvent(e, event.id, event.title, event.status)}
            disabled={loadingEventId === event.id}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
              loadingEventId === event.id
                ? "bg-gray-500/90 cursor-not-allowed"
                : "bg-neon-500/90 hover:bg-neon-400/90 hover:scale-110"
            )}
          >
            {loadingEventId === event.id ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : event.status === 'live' ? (
              <Eye className="w-8 h-8 text-white" />
            ) : (
              <Calendar className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Event Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-tech font-bold text-white mb-2">{event.title}</h3>
          <p className="text-gray-400 text-sm">{event.description}</p>
        </div>
        
        {/* Game and Organizer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neon-500 font-medium">{event.game}</span>
          <span className="text-gray-400">{event.organizer}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {event.tags.map((tag) => (
            <span key={tag} className="bg-primary-800 text-gray-300 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Event Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {event.status === 'live' ? '进行中' : getTimeUntilEvent(event.startTime)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{event.participants}/{event.maxParticipants}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">{event.prizePool}</span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <button className={cn(
          "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300",
          event.status === 'live'
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "btn-primary"
        )}>
          {event.status === 'live' ? '观看直播' : '报名参加'}
        </button>
      </div>
    </motion.div>
  )

  return (
    <section className="py-16 bg-primary-950/50">
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
            <span className="text-gradient">实时赛事</span>
            中心
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            参与激动人心的电竞赛事，与全球玩家同台竞技，赢取丰厚奖励
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-primary-800 rounded-lg p-1">
            {[
              { key: 'live', label: '直播中', icon: Zap },
              { key: 'upcoming', label: '即将开始', icon: Calendar },
              { key: 'calendar', label: '赛事日历', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium",
                  activeTab === key
                    ? "bg-neon-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-primary-700"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {key === 'live' && liveEvents.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {liveEvents.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {activeTab === 'live' && (
            <div className="space-y-8">
              {liveEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {liveEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">暂无直播赛事</h3>
                  <p className="text-gray-500">请关注即将开始的赛事</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="card-gaming max-w-4xl mx-auto">
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">赛事日历</h3>
                <p className="text-gray-500 mb-6">完整的赛事日历功能即将上线</p>
                <button className="btn-primary">
                  订阅赛事提醒
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default LiveEvents