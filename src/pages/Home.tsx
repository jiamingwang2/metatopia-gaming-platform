import React, { useState } from 'react'
import { Play, Star, Users, TrendingUp, ArrowRight, Gamepad2, Trophy, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'
import PopularGames from '../components/PopularGames'
import LiveEvents from '../components/LiveEvents'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import ScrollAnimation from '../components/ScrollAnimation'
import { LazyLoader, useLoadingState } from '../components/ui/LazyLoader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { LoadingOverlay } from '../components/ui/LoadingOverlay'
import ScrollReveal, { FadeInUp, FadeInLeft, FadeInRight, CascadeReveal } from '../components/ui/ScrollReveal'
import ParallaxScroll, { ParallaxImage } from '../components/ui/ParallaxScroll'
import ScrollProgress from '../components/ui/ScrollProgress'
import { CounterAnimation, AnimatedIcon, AnimatedProgress, FloatingTooltip } from '../components/ui/MicroInteractions'

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingGameId, setLoadingGameId] = useState<number | null>(null)
  const { isLoading: gamesLoading, startLoading, stopLoading } = useLoadingState(true)
  const [showGlobalLoading, setShowGlobalLoading] = useState(false)

  // 处理游戏卡片点击
  const handleGameClick = (gameId: number, gameName: string) => {
    console.log(`查看游戏详情: ${gameName} (ID: ${gameId})`)
    // 这里可以导航到游戏详情页面
    showToast.info(`即将进入 ${gameName} 详情页面`)
  }

  // 处理立即游戏按钮点击
  const handlePlayGame = async (e: React.MouseEvent, gameId: number, gameName: string) => {
    e.stopPropagation() // 阻止事件冒泡
    setLoadingGameId(gameId)
    setShowGlobalLoading(true)
    
    try {
      // 模拟游戏启动过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      showToast.success(`正在启动 ${gameName}...`)
    } catch (error) {
      showToast.error('游戏启动失败，请稍后重试')
    } finally {
      setShowGlobalLoading(false)
      setLoadingGameId(null)
    }
  }

  // 模拟数据加载
  React.useEffect(() => {
    const timer = setTimeout(() => {
      stopLoading()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // 处理主要按钮点击
  const handleStartGame = () => {
    showToast.info('即将进入游戏中心选择游戏')
  }

  const handleViewEarnings = () => {
    showToast.info('即将查看收益详情')
  }

  // 模拟个性化推荐数据
  const recommendedGames = [
    {
      id: 1,
      title: 'Cyber Warriors',
      category: 'RPG',
      rating: 4.8,
      players: '2.5M',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20cyberpunk%20warrior%20game%20cover%20art%20with%20neon%20lights%20and%20digital%20effects&image_size=landscape_4_3',
      earnings: '$125/月',
      isHot: true
    },
    {
      id: 2,
      title: 'Space Miners',
      category: '策略',
      rating: 4.6,
      players: '1.8M',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=space%20mining%20game%20with%20spaceships%20and%20asteroids%20in%20deep%20space&image_size=landscape_4_3',
      earnings: '$89/月',
      isHot: false
    },
    {
      id: 3,
      title: 'Dragon Realm',
      category: 'MMORPG',
      rating: 4.9,
      players: '3.2M',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20dragon%20realm%20game%20with%20magical%20creatures%20and%20epic%20landscapes&image_size=landscape_4_3',
      earnings: '$200/月',
      isHot: true
    }
  ]

  const stats = [
    { label: '注册用户', value: '500万+', icon: Users },
    { label: '游戏数量', value: '1000+', icon: Gamepad2 },
    { label: '总奖金池', value: '$50M+', icon: Trophy },
    { label: '活跃玩家', value: '100万+', icon: Target }
  ]

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Indicator */}
      <ScrollProgress showPercentage={true} />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#22c55e" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`,
            backgroundRepeat: 'repeat'
          }} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <FadeInLeft className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-neon-500/10 border border-neon-500/30 rounded-full px-4 py-2">
                  <Zap className="w-4 h-4 text-neon-500" />
                  <span className="text-neon-500 text-sm font-tech">AI驱动的GameFi平台</span>
                </div>
                <h1 className="text-responsive-xl font-gaming font-bold text-white leading-tight">
                  进入
                  <span className="text-gradient"> METATOPIA </span>
                  游戏宇宙
                </h1>
                <p className="text-responsive-md text-gray-300 max-w-lg">
                  体验前所未有的GameFi生态系统，通过AI个性化推荐发现最适合你的游戏，在电竞竞技中展现实力，在NFT市场中交易珍稀道具。
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton 
                  onClick={handleStartGame}
                  variant="primary"
                  size="lg"
                  className="flex items-center space-x-2 group"
                >
                  <Play className="w-5 h-5 group-hover:animate-pulse" />
                  <span>开始游戏</span>
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleViewEarnings}
                  variant="secondary"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>查看收益</span>
                </AnimatedButton>
              </div>
              
              {/* Stats */}
              <CascadeReveal 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8"
                cascadeDelay={0.15}
                delay={0.3}
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="text-center">
                      <AnimatedCard className="p-4 bg-primary-800/50 border border-primary-700" glowEffect={false}>
                        <AnimatedIcon icon={<Icon className="w-8 h-8 text-accent-400" />} className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                        <div className="text-2xl font-gaming font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </AnimatedCard>
                    </div>
                  )
                })}
              </CascadeReveal>
            </FadeInLeft>
            
            {/* Right Content - Hero Image */}
            <FadeInRight delay={0.2} className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden glow-effect">
                <ParallaxImage
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20gaming%20setup%20with%20holographic%20displays%20neon%20lights%20and%20cyberpunk%20aesthetic&image_size=portrait_4_3"
                  alt="METATOPIA Gaming Platform"
                  className="w-full h-full"
                  speed={0.3}
                  overlay={true}
                  overlayClassName="bg-gradient-to-t from-primary-900/80 to-transparent"
                />
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 bg-neon-500/20 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="text-neon-500 text-sm font-tech">实时收益</div>
                  <CounterAnimation 
                    value={125.50} 
                    className="text-white font-bold"
                    duration={1500}
                    prefix="+$"
                    decimals={2}
                  />
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute bottom-4 left-4 bg-esports-500/20 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="text-esports-500 text-sm font-tech">在线玩家</div>
                  <CounterAnimation 
                    value={1234567} 
                    className="text-white font-bold"
                    duration={2500}
                  />
                </motion.div>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-16 bg-primary-950/50">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeInUp delay={0.2} className="text-center mb-12">
            <h2 className="text-responsive-lg font-gaming font-bold text-white mb-4">
              为你
              <span className="text-gradient">量身定制</span>
              的游戏推荐
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              基于AI算法分析你的游戏偏好、技能水平和收益目标，为你推荐最适合的GameFi项目
            </p>
          </FadeInUp>
          
          <LazyLoader
            isLoading={gamesLoading}
            skeleton="card"
            skeletonCount={6}
            minLoadingTime={1000}
          >
            <CascadeReveal 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              cascadeDelay={0.2}
              delay={0.4}
            >
              {recommendedGames.map((game, index) => (
                <div key={game.id}>
                  <AnimatedCard
                    className="card-gaming group"
                    onClick={() => handleGameClick(game.id, game.title)}
                    hoverScale={1.05}
                    glowEffect={true}
                  >
                {/* Game Image */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Hot Badge */}
                  {game.isHot && (
                    <div className="absolute top-3 left-3 bg-esports-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      HOT
                    </div>
                  )}
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-neon-500/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Game Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-tech font-bold text-white">{game.title}</h3>
                    <span className="text-neon-500 text-sm font-medium">{game.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <FloatingTooltip content={`评分: ${game.rating}/5.0`}>
                      <div className="flex items-center space-x-1">
                        <AnimatedIcon 
                          icon={<Star className="w-4 h-4 text-yellow-400 fill-current" />} 
                          className="w-4 h-4 text-yellow-400 fill-current" 
                          animation="bounce"
                        />
                        <span>{game.rating}</span>
                      </div>
                    </FloatingTooltip>
                    <FloatingTooltip content={`在线玩家: ${game.players}`}>
                      <div className="flex items-center space-x-1">
                        <AnimatedIcon 
                          icon={<Users className="w-4 h-4" />} 
                          className="w-4 h-4" 
                          animation="pulse"
                        />
                        <span>{game.players}</span>
                      </div>
                    </FloatingTooltip>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <FloatingTooltip content="基于历史数据预测的平均收益">
                      <div>
                        <div className="text-xs text-gray-400">预期收益</div>
                        <div className="text-neon-500 font-bold">
                          {game.earnings}
                        </div>
                      </div>
                    </FloatingTooltip>
                    <AnimatedButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayGame(e, game.id, game.title)
                      }}
                      disabled={loadingGameId === game.id}
                      variant="accent"
                      size="sm"
                      loading={loadingGameId === game.id}
                      icon={loadingGameId === game.id ? undefined : <ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                      hapticFeedback
                      className={cn(
                        "flex items-center space-x-1",
                        loadingGameId === game.id && "opacity-50"
                      )}
                    >
                      {loadingGameId === game.id ? "启动中..." : "立即游戏"}
                    </AnimatedButton>
                    </div>
                  </div>
                  </AnimatedCard>
                </div>
              ))}
            </CascadeReveal>
          </LazyLoader>
          
          <FadeInUp delay={0.8} className="text-center mt-12">
            <AnimatedButton 
              onClick={() => showToast.info('即将显示更多游戏推荐')}
              variant="secondary"
              size="lg"
            >
              查看更多推荐
            </AnimatedButton>
          </FadeInUp>
        </div>
      </section>

      {/* Popular Games Section */}
      <PopularGames />

      {/* Live Events Section */}
      <LiveEvents />
      
      {/* Global Loading Overlay */}
      {showGlobalLoading && (
        <LoadingOverlay
          isVisible={true}
          message="正在启动游戏..."
          size="lg"
        />
      )}
    </div>
  )
}

export default Home