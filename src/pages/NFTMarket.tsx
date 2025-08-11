import React, { useState, useMemo } from 'react'
import { Search, Filter, Heart, ShoppingCart, Eye, TrendingUp, TrendingDown, Star, Clock, Zap, Award, Image, Video, Music, Gamepad2, Palette, Grid3X3, List, SortAsc, SortDesc, Wallet, ExternalLink, Share2, Flag, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'
import { CounterAnimation, AnimatedIcon, AnimatedProgress, FloatingTooltip, LikeButton, StarRating } from '../components/ui/MicroInteractions'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'

interface NFT {
  id: number
  name: string
  description: string
  image: string
  video?: string
  creator: {
    id: number
    username: string
    avatar: string
    isVerified: boolean
  }
  owner: {
    id: number
    username: string
    avatar: string
  }
  collection: {
    id: number
    name: string
    floorPrice: number
  }
  price: number
  currency: 'ETH' | 'MTP' | 'USDT'
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'
  category: 'Art' | 'Gaming' | 'Music' | 'Sports' | 'Collectibles' | 'Virtual Worlds'
  attributes: Array<{
    trait_type: string
    value: string | number
    rarity: number
  }>
  stats: {
    views: number
    likes: number
    sales: number
    volume: number
  }
  isLiked: boolean
  isForSale: boolean
  isAuction: boolean
  auctionEndTime?: string
  lastSale?: {
    price: number
    currency: string
    date: string
  }
  priceHistory: Array<{
    price: number
    date: string
  }>
}

interface Collection {
  id: number
  name: string
  description: string
  image: string
  creator: string
  floorPrice: number
  volume24h: number
  change24h: number
  items: number
  owners: number
}

const NFTMarket: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'collections' | 'activity'>('explore')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Mock NFT data
  const nfts: NFT[] = [
    {
      id: 1,
      name: 'Cyber Warrior #001',
      description: 'A legendary cyber warrior from the digital realm',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      creator: {
        id: 1,
        username: 'CyberArtist',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
        isVerified: true
      },
      owner: {
        id: 2,
        username: 'NFTCollector',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      collection: {
        id: 1,
        name: 'Cyber Warriors',
        floorPrice: 2.5
      },
      price: 15.5,
      currency: 'ETH',
      rarity: 'Legendary',
      category: 'Gaming',
      attributes: [
        { trait_type: 'Strength', value: 95, rarity: 5 },
        { trait_type: 'Speed', value: 88, rarity: 12 },
        { trait_type: 'Armor', value: 'Quantum', rarity: 2 },
        { trait_type: 'Weapon', value: 'Plasma Sword', rarity: 8 }
      ],
      stats: {
        views: 12450,
        likes: 892,
        sales: 23,
        volume: 156.8
      },
      isLiked: false,
      isForSale: true,
      isAuction: false,
      lastSale: {
        price: 12.3,
        currency: 'ETH',
        date: '2024-01-15'
      },
      priceHistory: [
        { price: 8.5, date: '2024-01-01' },
        { price: 10.2, date: '2024-01-08' },
        { price: 12.3, date: '2024-01-15' },
        { price: 15.5, date: '2024-01-22' }
      ]
    },
    {
      id: 2,
      name: 'Dragon Essence Crystal',
      description: 'A mystical crystal containing the essence of ancient dragons',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      creator: {
        id: 3,
        username: 'MysticCreator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        isVerified: true
      },
      owner: {
        id: 4,
        username: 'DragonLord',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      collection: {
        id: 2,
        name: 'Mystic Artifacts',
        floorPrice: 1.8
      },
      price: 8.2,
      currency: 'ETH',
      rarity: 'Epic',
      category: 'Art',
      attributes: [
        { trait_type: 'Element', value: 'Fire', rarity: 15 },
        { trait_type: 'Power Level', value: 87, rarity: 8 },
        { trait_type: 'Origin', value: 'Ancient', rarity: 3 },
        { trait_type: 'Clarity', value: 'Perfect', rarity: 1 }
      ],
      stats: {
        views: 8920,
        likes: 654,
        sales: 18,
        volume: 98.4
      },
      isLiked: true,
      isForSale: true,
      isAuction: true,
      auctionEndTime: '2024-02-01T15:30:00Z',
      lastSale: {
        price: 6.8,
        currency: 'ETH',
        date: '2024-01-10'
      },
      priceHistory: [
        { price: 4.2, date: '2024-01-01' },
        { price: 5.5, date: '2024-01-05' },
        { price: 6.8, date: '2024-01-10' },
        { price: 8.2, date: '2024-01-20' }
      ]
    },
    {
      id: 3,
      name: 'Quantum Racer #777',
      description: 'Ultra-rare quantum racing vehicle with interdimensional capabilities',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      creator: {
        id: 5,
        username: 'QuantumDesigns',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        isVerified: true
      },
      owner: {
        id: 6,
        username: 'SpeedDemon',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      collection: {
        id: 3,
        name: 'Quantum Racers',
        floorPrice: 3.2
      },
      price: 22.8,
      currency: 'ETH',
      rarity: 'Mythic',
      category: 'Gaming',
      attributes: [
        { trait_type: 'Speed', value: 99, rarity: 1 },
        { trait_type: 'Acceleration', value: 96, rarity: 3 },
        { trait_type: 'Engine', value: 'Quantum Drive', rarity: 0.5 },
        { trait_type: 'Color', value: 'Holographic', rarity: 2 }
      ],
      stats: {
        views: 15680,
        likes: 1205,
        sales: 8,
        volume: 184.2
      },
      isLiked: false,
      isForSale: true,
      isAuction: false,
      lastSale: {
        price: 18.5,
        currency: 'ETH',
        date: '2024-01-18'
      },
      priceHistory: [
        { price: 12.0, date: '2024-01-01' },
        { price: 15.5, date: '2024-01-08' },
        { price: 18.5, date: '2024-01-18' },
        { price: 22.8, date: '2024-01-25' }
      ]
    },
    {
      id: 4,
      name: 'Mech Pilot Badge',
      description: 'Elite pilot certification badge from the Mech Wars',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=400&fit=crop',
      creator: {
        id: 7,
        username: 'MechCorps',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
        isVerified: true
      },
      owner: {
        id: 8,
        username: 'ElitePilot',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face'
      },
      collection: {
        id: 4,
        name: 'Mech Warriors',
        floorPrice: 0.8
      },
      price: 3.5,
      currency: 'ETH',
      rarity: 'Rare',
      category: 'Collectibles',
      attributes: [
        { trait_type: 'Rank', value: 'Elite', rarity: 10 },
        { trait_type: 'Missions', value: 150, rarity: 5 },
        { trait_type: 'Mech Type', value: 'Assault', rarity: 20 },
        { trait_type: 'Service Years', value: 8, rarity: 15 }
      ],
      stats: {
        views: 5420,
        likes: 387,
        sales: 45,
        volume: 67.8
      },
      isLiked: true,
      isForSale: false,
      isAuction: false,
      lastSale: {
        price: 2.8,
        currency: 'ETH',
        date: '2024-01-12'
      },
      priceHistory: [
        { price: 1.5, date: '2024-01-01' },
        { price: 2.1, date: '2024-01-06' },
        { price: 2.8, date: '2024-01-12' },
        { price: 3.5, date: '2024-01-20' }
      ]
    },
    {
      id: 5,
      name: 'Cosmic Symphony #42',
      description: 'A harmonious blend of cosmic energies captured in digital form',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop',
      video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      creator: {
        id: 9,
        username: 'CosmicComposer',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
        isVerified: true
      },
      owner: {
        id: 10,
        username: 'MusicLover',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
      },
      collection: {
        id: 5,
        name: 'Cosmic Symphonies',
        floorPrice: 1.2
      },
      price: 6.7,
      currency: 'ETH',
      rarity: 'Epic',
      category: 'Music',
      attributes: [
        { trait_type: 'Frequency', value: '432Hz', rarity: 8 },
        { trait_type: 'Duration', value: '3:42', rarity: 25 },
        { trait_type: 'Instruments', value: 'Cosmic', rarity: 5 },
        { trait_type: 'Mood', value: 'Transcendent', rarity: 12 }
      ],
      stats: {
        views: 9850,
        likes: 742,
        sales: 28,
        volume: 89.6
      },
      isLiked: false,
      isForSale: true,
      isAuction: true,
      auctionEndTime: '2024-02-05T20:00:00Z',
      lastSale: {
        price: 5.2,
        currency: 'ETH',
        date: '2024-01-14'
      },
      priceHistory: [
        { price: 3.8, date: '2024-01-01' },
        { price: 4.5, date: '2024-01-07' },
        { price: 5.2, date: '2024-01-14' },
        { price: 6.7, date: '2024-01-21' }
      ]
    }
  ]

  // Mock Collections data
  const collections: Collection[] = [
    {
      id: 1,
      name: 'Cyber Warriors',
      description: 'Elite digital warriors from the cyber realm',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      creator: 'CyberArtist',
      floorPrice: 2.5,
      volume24h: 45.8,
      change24h: 12.5,
      items: 10000,
      owners: 3420
    },
    {
      id: 2,
      name: 'Mystic Artifacts',
      description: 'Ancient magical items with mysterious powers',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      creator: 'MysticCreator',
      floorPrice: 1.8,
      volume24h: 32.4,
      change24h: -5.2,
      items: 5000,
      owners: 1890
    },
    {
      id: 3,
      name: 'Quantum Racers',
      description: 'High-speed vehicles from parallel dimensions',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      creator: 'QuantumDesigns',
      floorPrice: 3.2,
      volume24h: 78.9,
      change24h: 8.7,
      items: 7777,
      owners: 2156
    },
    {
      id: 4,
      name: 'Mech Warriors',
      description: 'Battle-tested mechanical warriors',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=300&fit=crop',
      creator: 'MechCorps',
      floorPrice: 0.8,
      volume24h: 18.6,
      change24h: 3.4,
      items: 15000,
      owners: 4567
    },
    {
      id: 5,
      name: 'Cosmic Symphonies',
      description: 'Musical NFTs that resonate with the universe',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop',
      creator: 'CosmicComposer',
      floorPrice: 1.2,
      volume24h: 25.7,
      change24h: 15.8,
      items: 3333,
      owners: 987
    },
    {
      id: 6,
      name: 'Digital Landscapes',
      description: 'Breathtaking virtual worlds and environments',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      creator: 'WorldBuilder',
      floorPrice: 2.1,
      volume24h: 41.3,
      change24h: -2.8,
      items: 8888,
      owners: 2789
    }
  ]

  // Filter options
  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'art', name: '艺术' },
    { id: 'gaming', name: '游戏' },
    { id: 'music', name: '音乐' },
    { id: 'sports', name: '体育' },
    { id: 'collectibles', name: '收藏品' },
    { id: 'virtual-worlds', name: '虚拟世界' }
  ]

  const rarities = [
    { id: 'all', name: '全部稀有度' },
    { id: 'common', name: '普通' },
    { id: 'rare', name: '稀有' },
    { id: 'epic', name: '史诗' },
    { id: 'legendary', name: '传说' },
    { id: 'mythic', name: '神话' }
  ]

  const sortOptions = [
    { id: 'newest', name: '最新上架' },
    { id: 'oldest', name: '最早上架' },
    { id: 'price-low', name: '价格从低到高' },
    { id: 'price-high', name: '价格从高到低' },
    { id: 'most-liked', name: '最受欢迎' },
    { id: 'most-viewed', name: '浏览最多' }
  ]

  // Filtered and sorted NFTs
  const filteredNFTs = useMemo(() => {
    let filtered = nfts.filter(nft => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
                             nft.category.toLowerCase().replace(' ', '-') === selectedCategory
      
      const matchesRarity = selectedRarity === 'all' || 
                           nft.rarity.toLowerCase() === selectedRarity
      
      const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesRarity && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'most-liked':
        filtered.sort((a, b) => b.stats.likes - a.stats.likes)
        break
      case 'most-viewed':
        filtered.sort((a, b) => b.stats.views - a.stats.views)
        break
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id)
        break
      default: // newest
        filtered.sort((a, b) => b.id - a.id)
    }

    return filtered
  }, [nfts, searchTerm, selectedCategory, selectedRarity, priceRange, sortBy])

  // Handle NFT actions
  const handleLikeNFT = async (nftId: number) => {
    setLoadingAction(`like-${nftId}`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    showToast.success('已添加到收藏')
    setLoadingAction(null)
  }

  const handleBuyNFT = async (nftId: number) => {
    setLoadingAction(`buy-${nftId}`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    showToast.success('购买成功！NFT已添加到您的钱包')
    setLoadingAction(null)
  }

  const handlePlaceBid = async (nftId: number) => {
    setLoadingAction(`bid-${nftId}`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    showToast.success('出价成功！')
    setLoadingAction(null)
  }

  // Format auction time
  const formatAuctionTime = (endTime: string) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return '已结束'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}天 ${hours}小时`
    if (hours > 0) return `${hours}小时 ${minutes}分钟`
    return `${minutes}分钟`
  }

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-orange-400'
      case 'mythic': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const NFTCard: React.FC<{ nft: NFT; index: number }> = ({ nft, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedNFT(selectedNFT === nft.id ? null : nft.id)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        {/* NFT Image/Video */}
        {nft.video ? (
          <video
            src={nft.video}
            poster={nft.image}
            className="w-full h-64 object-cover"
            muted
            loop
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        ) : (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-64 object-cover"
          />
        )}
        
        {/* Rarity Badge */}
        <div className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
          getRarityColor(nft.rarity),
          "bg-black/50"
        )}>
          {nft.rarity}
        </div>
        
        {/* Auction Timer */}
        {nft.isAuction && nft.auctionEndTime && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatAuctionTime(nft.auctionEndTime)}</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <FloatingTooltip content={nft.isLiked ? '取消收藏' : '添加收藏'}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleLikeNFT(nft.id)
              }}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-colors",
                nft.isLiked ? 'bg-red-500/90 text-white' : 'bg-black/50 text-gray-300 hover:text-red-400'
              )}
            >
              <Heart className={cn("w-4 h-4", nft.isLiked && "fill-current")} />
            </button>
          </FloatingTooltip>
          <FloatingTooltip content="分享">
            <button
              onClick={(e) => {
                e.stopPropagation()
                showToast.success('链接已复制到剪贴板')
              }}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-gray-300 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </FloatingTooltip>
          <FloatingTooltip content="在新窗口打开">
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(`/nft/${nft.id}`, '_blank')
              }}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </FloatingTooltip>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* NFT Info */}
        <div>
          <h3 className="text-white font-tech font-bold text-lg">{nft.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{nft.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.username}
                className="w-6 h-6 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">by</span>
                  <span className="text-xs text-white font-medium">{nft.creator.username}</span>
                  {nft.creator.isVerified && (
                    <AnimatedIcon 
                      icon={<Star className="w-3 h-3 text-blue-400 fill-current" />} 
                      className="w-3 h-3" 
                      animation="pulse"
                    />
                  )}
                </div>
                <div className="text-xs text-gray-500">{nft.collection.name}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-3">
            <FloatingTooltip content={`浏览量: ${nft.stats.views.toLocaleString()}`}>
              <div className="flex items-center space-x-1">
                <AnimatedIcon 
                  icon={<Eye className="w-3 h-3" />} 
                  className="w-3 h-3" 
                  animation="pulse"
                />
                <CounterAnimation 
                  value={nft.stats.views} 
                  duration={1500}
                />
              </div>
            </FloatingTooltip>
            <LikeButton 
              isLiked={nft.isLiked}
              onToggle={() => {
                showToast.success(nft.isLiked ? '已取消收藏' : '已添加到收藏')
              }}
              count={nft.stats.likes}
            />
          </div>
          <FloatingTooltip content={`销售次数: ${nft.stats.sales}`}>
            <div className="text-gray-500">
              <CounterAnimation 
                value={nft.stats.sales} 
                suffix=" sales"
                duration={1000}
              />
            </div>
          </FloatingTooltip>
        </div>
        
        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-primary-700">
          <div>
            <div className="text-xs text-gray-400 mb-1">
              {nft.isAuction ? 'Current Bid' : 'Price'}
            </div>
            <div className="flex items-center space-x-1">
              <CounterAnimation 
                value={nft.price} 
                className="text-white font-bold text-lg"
                duration={2000}
                decimals={1}
              />
              <span className="text-gray-400 text-sm">{nft.currency}</span>
            </div>
            {nft.lastSale && (
              <div className="text-xs text-gray-500">
                Last: <CounterAnimation 
                  value={nft.lastSale.price} 
                  duration={1500}
                  decimals={1}
                /> {nft.lastSale.currency}
              </div>
            )}
          </div>
          
          {nft.isForSale && (
            <AnimatedButton
              onClick={(e) => {
                e.stopPropagation()
                if (nft.isAuction) {
                  handlePlaceBid(nft.id)
                } else {
                  handleBuyNFT(nft.id)
                }
              }}
              disabled={loadingAction === `buy-${nft.id}` || loadingAction === `bid-${nft.id}`}
              loading={loadingAction === `buy-${nft.id}` || loadingAction === `bid-${nft.id}`}
              variant={nft.isAuction ? "secondary" : "accent"}
              size="sm"
              icon={nft.isAuction ? undefined : <ShoppingCart className="w-4 h-4" />}
              iconPosition="left"
              hapticFeedback
            >
              {nft.isAuction ? '出价' : '购买'}
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {selectedNFT === nft.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-primary-700 space-y-4"
        >
          {/* Attributes */}
          <div>
            <h4 className="text-white font-bold mb-2">属性</h4>
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr, i) => (
                <div key={i} className="bg-primary-800 p-2 rounded">
                  <div className="text-xs text-gray-400">{attr.trait_type}</div>
                  <div className="text-white font-medium">{attr.value}</div>
                  <div className="text-xs text-neon-400">{attr.rarity}% rare</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price History */}
          <div>
            <h4 className="text-white font-bold mb-2">价格历史</h4>
            <div className="space-y-1">
              {nft.priceHistory.map((history, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-400">{history.date}</span>
                  <span className="text-white">{history.price} ETH</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  const CollectionCard: React.FC<{ collection: Collection; index: number }> = ({ collection, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-32 object-cover"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-tech font-bold text-lg">{collection.name}</h3>
          <p className="text-gray-400 text-sm">{collection.description}</p>
          <p className="text-xs text-gray-500 mt-1">by {collection.creator}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <FloatingTooltip content="最低价格">
            <div>
              <div className="text-gray-400">Floor Price</div>
              <div className="text-white font-bold">
                <CounterAnimation 
                  value={collection.floorPrice} 
                  suffix=" ETH"
                  duration={1500}
                  decimals={1}
                />
              </div>
            </div>
          </FloatingTooltip>
          <FloatingTooltip content="24小时交易量">
            <div>
              <div className="text-gray-400">24h Volume</div>
              <div className="text-white font-bold">
                <CounterAnimation 
                  value={collection.volume24h} 
                  suffix=" ETH"
                  duration={1800}
                  decimals={1}
                />
              </div>
            </div>
          </FloatingTooltip>
          <FloatingTooltip content="NFT总数">
            <div>
              <div className="text-gray-400">Items</div>
              <div className="text-white font-bold">
                <CounterAnimation 
                  value={collection.items} 
                  duration={2000}

                />
              </div>
            </div>
          </FloatingTooltip>
          <FloatingTooltip content="持有者数量">
            <div>
              <div className="text-gray-400">Owners</div>
              <div className="text-white font-bold">
                <CounterAnimation 
                  value={collection.owners} 
                  duration={2200}

                />
              </div>
            </div>
          </FloatingTooltip>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-primary-700">
          <FloatingTooltip content={`24小时价格变化: ${collection.change24h >= 0 ? '+' : ''}${collection.change24h}%`}>
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              collection.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              <AnimatedIcon 
                icon={collection.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                className="w-4 h-4" 
                animation={collection.change24h >= 0 ? "bounce" : "shake"}
              />
              <CounterAnimation 
                value={Math.abs(collection.change24h)} 
                suffix="%"
                duration={1500}
                decimals={1}
              />
            </div>
          </FloatingTooltip>
          <AnimatedButton 
            variant="primary" 
            size="sm"
            hapticFeedback
            className="text-sm px-4 py-2"
          >
            查看收藏
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  )

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
            <span className="text-gradient">NFT市场</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            发现、收集和交易独特的数字资产
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
              { id: 'explore', label: '探索NFT', icon: Search },
              { id: 'collections', label: '热门收藏', icon: Grid3X3 },
              { id: 'activity', label: '交易活动', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-neon-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-primary-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Explore Tab */}
        {activeTab === 'explore' && (
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索NFT、创作者或收藏..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-500 transition-colors"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Rarity Filter */}
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-500"
                  >
                    {rarities.map(rarity => (
                      <option key={rarity.id} value={rarity.id}>
                        {rarity.name}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'grid' ? 'bg-neon-500 text-white' : 'bg-primary-800 text-gray-400 hover:text-white'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'list' ? 'bg-neon-500 text-white' : 'bg-primary-800 text-gray-400 hover:text-white'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-400 text-sm">
              找到 {filteredNFTs.length} 个NFT
            </div>

            {/* NFT Grid */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
            )}>
              {filteredNFTs.map((nft, index) => (
                <NFTCard key={nft.id} nft={nft} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredNFTs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">未找到NFT</h3>
                <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedRarity('all')
                    setPriceRange([0, 1000])
                  }}
                  className="btn-primary"
                >
                  重置筛选
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-tech font-bold text-white mb-2">热门收藏</h2>
              <p className="text-gray-400">探索最受欢迎的NFT收藏</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">交易活动</h3>
            <p className="text-gray-500 mb-6">实时查看NFT交易动态</p>
            <button className="btn-primary">
              查看活动
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default NFTMarket