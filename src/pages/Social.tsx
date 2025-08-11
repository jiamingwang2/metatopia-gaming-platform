import React, { useState, useMemo } from 'react'
import { Search, Filter, Heart, MessageCircle, Share2, Users, UserPlus, UserCheck, Send, Image, Video, Gamepad2, Trophy, Star, Clock, ThumbsUp, ThumbsDown, MoreHorizontal, Pin, Flag } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import ScrollAnimation from '../components/ScrollAnimation'
import AnimatedInput from '../components/AnimatedInput'
import LazyLoader from '../components/ui/LazyLoader'
import { useLoadingState } from '../components/ui/LazyLoader'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import ScrollReveal, { FadeInUp, FadeInLeft, FadeInRight, CascadeReveal } from '../components/ui/ScrollReveal'
import ParallaxScroll from '../components/ui/ParallaxScroll'
import ScrollProgress from '../components/ui/ScrollProgress'

interface Post {
  id: number
  author: {
    id: number
    username: string
    avatar: string
    level: number
    isVerified: boolean
    isOnline: boolean
  }
  content: string
  images?: string[]
  video?: string
  game?: string
  type: 'text' | 'image' | 'video' | 'achievement' | 'game_review'
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  isPinned: boolean
  tags: string[]
}

interface Comment {
  id: number
  author: {
    id: number
    username: string
    avatar: string
    level: number
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface Friend {
  id: number
  username: string
  avatar: string
  level: number
  isOnline: boolean
  lastSeen: string
  favoriteGame: string
  mutualFriends: number
  status: 'friend' | 'pending' | 'suggested'
}

const Social: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'groups'>('feed')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [newPostContent, setNewPostContent] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  
  const { isLoading: postsLoading, setLoading: setPostsLoading } = useLoadingState()
  const { isLoading: showGlobalLoading, setLoading: setGlobalLoading } = useLoadingState()

  // Mock data
  const mockPosts: Post[] = [
    {
      id: 1,
      author: {
        id: 1,
        username: 'CyberKing2024',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20gamer%20avatar%20with%20neon%20lights&image_size=square',
        level: 42,
        isVerified: true,
        isOnline: true
      },
      content: '刚刚在METATOPIA冠军杯中取得了胜利！这场比赛真的太激烈了，最后一波团战差点翻车，好在队友给力！感谢所有支持我的朋友们！🏆',
      images: [
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=esports%20tournament%20victory%20celebration&image_size=landscape',
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20trophy%20championship&image_size=landscape'
      ],
      game: 'METATOPIA',
      type: 'achievement',
      timestamp: '2024-01-15T10:30:00Z',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      isBookmarked: true,
      isPinned: true,
      tags: ['冠军', '电竞', 'METATOPIA']
    },
    {
      id: 2,
      author: {
        id: 2,
        username: 'GameMaster_Pro',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20gamer%20avatar%20with%20headset&image_size=square',
        level: 38,
        isVerified: true,
        isOnline: false
      },
      content: '今天测试了新发布的《星际征途》，画面效果真的震撼！特别是太空战斗场景，每一个细节都做得非常精致。推荐给所有科幻游戏爱好者！\n\n评分：9.5/10\n优点：画面精美、操作流畅、剧情丰富\n缺点：新手教程稍显复杂',
      game: '星际征途',
      type: 'game_review',
      timestamp: '2024-01-15T08:15:00Z',
      likes: 156,
      comments: 28,
      shares: 8,
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      tags: ['游戏评测', '科幻', '推荐']
    },
    {
      id: 3,
      author: {
        id: 3,
        username: 'StrategyQueen',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=female%20gamer%20avatar%20with%20strategic%20elements&image_size=square',
        level: 35,
        isVerified: false,
        isOnline: true
      },
      content: '分享一个实用的训练技巧：每天花30分钟练习反应速度，可以显著提升你在FPS游戏中的表现。我用这个方法训练了一个月，排位从黄金升到了钻石！\n\n具体方法：\n1. 使用专业的反应训练软件\n2. 每天固定时间练习\n3. 记录进步数据\n4. 保持耐心和坚持',
      type: 'text',
      timestamp: '2024-01-15T06:45:00Z',
      likes: 89,
      comments: 15,
      shares: 22,
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      tags: ['训练技巧', 'FPS', '提升']
    },
    {
      id: 4,
      author: {
        id: 4,
        username: 'CardMaster_88',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=card%20game%20master%20avatar&image_size=square',
        level: 29,
        isVerified: false,
        isOnline: false
      },
      content: '新的卡组构建心得！经过一周的测试，这套控制流卡组在当前环境下表现非常出色，胜率达到了78%。关键在于合理的费用曲线和强力的后期单卡。',
      images: [
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=trading%20card%20game%20deck%20layout&image_size=landscape'
      ],
      game: '元宇宙卡牌',
      type: 'image',
      timestamp: '2024-01-14T20:30:00Z',
      likes: 67,
      comments: 12,
      shares: 5,
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      tags: ['卡组', '攻略', '分享']
    },
    {
      id: 5,
      author: {
        id: 5,
        username: 'SpeedRacer_X',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=racing%20gamer%20avatar%20with%20helmet&image_size=square',
        level: 31,
        isVerified: false,
        isOnline: true
      },
      content: '量子赛车的新赛道"时空隧道"真的太刺激了！重力变化和时间扭曲效果让比赛充满了不确定性。刚刚跑出了个人最佳成绩：2分34秒！',
      video: 'racing_gameplay.mp4',
      game: '量子赛车',
      type: 'video',
      timestamp: '2024-01-14T18:20:00Z',
      likes: 123,
      comments: 19,
      shares: 7,
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      tags: ['赛车', '新赛道', '记录']
    }
  ]

  const mockFriends: Friend[] = [
    {
      id: 1,
      username: 'EliteGamer_2024',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elite%20gamer%20avatar&image_size=square',
      level: 45,
      isOnline: true,
      lastSeen: '在线',
      favoriteGame: 'METATOPIA',
      mutualFriends: 12,
      status: 'friend'
    },
    {
      id: 2,
      username: 'TechNinja_Pro',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tech%20ninja%20gamer%20avatar&image_size=square',
      level: 38,
      isOnline: false,
      lastSeen: '2小时前',
      favoriteGame: '星际征途',
      mutualFriends: 8,
      status: 'friend'
    },
    {
      id: 3,
      username: 'CyberWarrior_X',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyber%20warrior%20avatar&image_size=square',
      level: 42,
      isOnline: true,
      lastSeen: '在线',
      favoriteGame: '量子赛车',
      mutualFriends: 15,
      status: 'pending'
    },
    {
      id: 4,
      username: 'PixelMaster_99',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20gamer%20avatar&image_size=square',
      level: 33,
      isOnline: false,
      lastSeen: '1天前',
      favoriteGame: '元宇宙卡牌',
      mutualFriends: 5,
      status: 'suggested'
    },
    {
      id: 5,
      username: 'QuantumGamer',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20themed%20gamer%20avatar&image_size=square',
      level: 40,
      isOnline: true,
      lastSeen: '在线',
      favoriteGame: 'METATOPIA',
      mutualFriends: 20,
      status: 'friend'
    }
  ]

  const filters = [
    { id: 'all', name: '全部动态', icon: Users },
    { id: 'friends', name: '好友动态', icon: UserCheck },
    { id: 'achievements', name: '成就分享', icon: Trophy },
    { id: 'reviews', name: '游戏评测', icon: Star },
    { id: 'media', name: '图片视频', icon: Image }
  ]

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let filtered = mockPosts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.game && post.game.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFilter = selectedFilter === 'all' ||
                          (selectedFilter === 'achievements' && post.type === 'achievement') ||
                          (selectedFilter === 'reviews' && post.type === 'game_review') ||
                          (selectedFilter === 'media' && (post.type === 'image' || post.type === 'video'))
      
      return matchesSearch && matchesFilter
    })

    // Sort by pinned first, then by timestamp
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }, [searchTerm, selectedFilter])

  // Simulate loading
  React.useEffect(() => {
    setPostsLoading(true)
    const timer = setTimeout(() => setPostsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [activeTab, setPostsLoading])

  const handleLikePost = async (postId: number) => {
    setLoadingAction(`like-${postId}`)
    await new Promise(resolve => setTimeout(resolve, 500))
    showToast('操作成功', 'success')
    setLoadingAction(null)
  }

  const handleBookmarkPost = async (postId: number) => {
    setLoadingAction(`bookmark-${postId}`)
    await new Promise(resolve => setTimeout(resolve, 500))
    showToast('收藏成功', 'success')
    setLoadingAction(null)
  }

  const handleSharePost = async (postId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    showToast('分享成功', 'success')
  }

  const handleAddFriend = async (friendId: number) => {
    setLoadingAction(`friend-${friendId}`)
    await new Promise(resolve => setTimeout(resolve, 800))
    showToast('好友请求已发送', 'success')
    setLoadingAction(null)
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return
    
    setLoadingAction('create-post')
    setGlobalLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showToast('动态发布成功', 'success')
    setNewPostContent('')
    setShowNewPost(false)
    setLoadingAction(null)
    setGlobalLoading(false)
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    return `${days}天前`
  }

  const PostCard: React.FC<{ post: Post; index: number }> = ({ post, index }) => (
  <ScrollAnimation direction="up" delay={index * 0.1}>
    <AnimatedCard className="hover:scale-[1.02] transition-all duration-300" glowEffect>
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            {post.author.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-primary-900 rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-tech font-bold">{post.author.username}</h3>
              {post.author.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs bg-primary-700 text-gray-300 px-2 py-1 rounded">
                Lv.{post.author.level}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatTime(post.timestamp)}</span>
              {post.game && (
                <>
                  <span>•</span>
                  <Gamepad2 className="w-3 h-3" />
                  <span>{post.game}</span>
                </>
              )}
              </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.isPinned && (
            <Pin className="w-4 h-4 text-orange-500" />
          )}
          <button className="p-1 hover:bg-primary-700 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        <p className="text-gray-300 leading-relaxed">{post.content}</p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="bg-neon-500/20 text-neon-400 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Media */}
        {post.images && post.images.length > 0 && (
          <div className={cn(
            "grid gap-2 rounded-lg overflow-hidden",
            post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          )}>
            {post.images.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`Post image ${i + 1}`}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            ))}
          </div>
        )}
        
        {post.video && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <Video className="w-16 h-16 text-gray-400" />
              <span className="ml-2 text-gray-400">视频内容</span>
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-primary-700">
        <div className="flex items-center space-x-6">
          <AnimatedButton
            onClick={() => handleLikePost(post.id)}
            disabled={loadingAction === `like-${post.id}`}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-2",
              post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            )}
          >
            <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
            <span>{post.likes}</span>
          </AnimatedButton>
          
          <AnimatedButton
            onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </AnimatedButton>
          
          <AnimatedButton
            onClick={() => handleSharePost(post.id)}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-400 hover:text-green-400"
          >
            <Share2 className="w-5 h-5" />
            <span>{post.shares}</span>
          </AnimatedButton>
        </div>
        
        <AnimatedButton
          onClick={() => handleBookmarkPost(post.id)}
          disabled={loadingAction === `bookmark-${post.id}`}
          variant="ghost"
          size="sm"
          className={cn(
            "p-2",
            post.isBookmarked ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
          )}
        >
          <Star className={cn("w-5 h-5", post.isBookmarked && "fill-current")} />
        </AnimatedButton>
      </div>

      {/* Comments Section */}
      {selectedPost === post.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 border-t border-primary-700 space-y-4"
        >
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2" />
            <p>暂无评论，来发表第一条评论吧！</p>
          </div>
        </motion.div>
      )}
    </AnimatedCard>
  </ScrollAnimation>
)

  const FriendCard: React.FC<{ friend: Friend; index: number }> = ({ friend, index }) => (
    <ScrollAnimation direction="left" delay={index * 0.1}>
      <AnimatedCard className="hover:scale-105 transition-all duration-300" glowEffect>
        <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          {friend.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-primary-900 rounded-full" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-white font-tech font-bold truncate">{friend.username}</h3>
            <span className="text-xs bg-primary-700 text-gray-300 px-2 py-1 rounded">
              Lv.{friend.level}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{friend.favoriteGame}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{friend.isOnline ? '在线' : friend.lastSeen}</span>
            {friend.mutualFriends > 0 && (
              <>
                <span>•</span>
                <span>{friend.mutualFriends}个共同好友</span>
              </>
            )}
          </div>
        </div>
        
        <AnimatedButton
          onClick={() => handleAddFriend(friend.id)}
          disabled={loadingAction === `friend-${friend.id}`}
          variant={friend.status === 'friend' ? 'success' : friend.status === 'pending' ? 'warning' : 'primary'}
          size="sm"
        >
          {loadingAction === `friend-${friend.id}` ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : friend.status === 'friend' ? (
            <UserCheck className="w-4 h-4" />
          ) : friend.status === 'pending' ? (
            '接受'
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
        </AnimatedButton>
      </div>
      </AnimatedCard>
    </ScrollAnimation>
  )

  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      {/* Scroll Progress Indicator */}
      <ScrollProgress showPercentage={true} />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <FadeInUp delay={0.2} className="text-center mb-12">
          <h1 className="text-responsive-lg font-gaming font-bold text-white mb-4">
            <span className="text-gradient">社交广场</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            与游戏伙伴分享精彩时刻，建立深厚友谊
          </p>
        </FadeInUp>

        {/* Tabs */}
        <FadeInUp delay={0.4} className="flex justify-center mb-8">
          <div className="flex bg-primary-800 rounded-lg p-1">
            {[
              { id: 'feed', label: '动态广场', icon: Users },
              { id: 'friends', label: '好友列表', icon: UserCheck },
              { id: 'groups', label: '社区群组', icon: Users }
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
        </FadeInUp>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <FadeInUp delay={0.6} className="space-y-8">
            {/* Create Post */}
            <FadeInLeft delay={0.8}>
              <div className="card-gaming">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20gamer%20avatar%20with%20gaming%20setup&image_size=square"
                  alt="Your Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <AnimatedButton
                  onClick={() => setShowNewPost(true)}
                  variant="ghost"
                  size="md"
                  className="flex-1 text-left px-4 py-3 bg-primary-800 hover:bg-primary-700 text-gray-400"
                >
                  分享你的游戏时刻...
                </AnimatedButton>
              </div>
              
              {showNewPost && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="分享你的游戏体验、成就或想法..."
                    className="w-full h-32 p-4 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-neon-500"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AnimatedButton variant="ghost" size="sm" className="p-2">
                        <Image className="w-5 h-5 text-gray-400" />
                      </AnimatedButton>
                      <AnimatedButton variant="ghost" size="sm" className="p-2">
                        <Video className="w-5 h-5 text-gray-400" />
                      </AnimatedButton>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AnimatedButton
                        onClick={() => setShowNewPost(false)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        取消
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={handleCreatePost}
                        disabled={loadingAction === 'create-post' || !newPostContent.trim()}
                        variant="primary"
                        size="md"
                      >
                        {loadingAction === 'create-post' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>发布中...</span>
                          </div>
                        ) : (
                          '发布'
                        )}
                      </AnimatedButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            </FadeInLeft>

            {/* Search and Filters */}
            <FadeInRight delay={1.0} className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <AnimatedInput
                  type="text"
                  placeholder="搜索动态、用户或游戏..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  className="w-full"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {filters.map(filter => {
                  const Icon = filter.icon
                  return (
                    <AnimatedButton
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      variant={selectedFilter === filter.id ? "primary" : "secondary"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{filter.name}</span>
                    </AnimatedButton>
                  )
                })}
              </div>
            </FadeInRight>

            {/* Posts */}
            <LazyLoader
              isLoading={postsLoading}
              skeleton="card"
              skeletonCount={4}
              minLoadingTime={500}
            >
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </LazyLoader>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <FadeInUp delay={0.4} className="text-center py-16">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">暂无动态</h3>
                <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
                <AnimatedButton
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                  variant="primary"
                  size="md"
                >
                  重置筛选
                </AnimatedButton>
              </FadeInUp>
            )}
          </FadeInUp>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <FadeInUp delay={0.6} className="space-y-6">
            <FadeInUp delay={0.8} className="text-center mb-8">
              <h2 className="text-2xl font-tech font-bold text-white mb-2">好友列表</h2>
              <p className="text-gray-400">管理你的游戏伙伴</p>
            </FadeInUp>
            
            <LazyLoader
              isLoading={postsLoading}
              skeleton="profile"
              skeletonCount={6}
              minLoadingTime={500}
            >
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <FriendCard key={friend.id} friend={friend} index={index} />
                ))}
              </div>
            </LazyLoader>
          </FadeInUp>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <FadeInUp delay={0.6} className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">社区群组</h3>
            <p className="text-gray-500 mb-6">加入志同道合的游戏社区</p>
            <AnimatedButton variant="primary" size="md">
              探索群组
            </AnimatedButton>
          </FadeInUp>
        )}
      </div>
      
      {/* Global Loading Overlay */}
      {showGlobalLoading && (
        <LoadingOverlay
          isVisible={showGlobalLoading}
          message="发布中..."
          size="lg"
        />
      )}
    </div>
  )
}

export default Social