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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState('price_low')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const nfts: NFT[] = [
    {
      id: 1,
      name: 'Cyber Warrior #001',
      description: 'A legendary cyber warrior from the digital realm, equipped with quantum armor and neural implants.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20warrior%20NFT%20art%20with%20neon%20armor%20and%20digital%20effects&image_size=square',
      creator: {
        id: 1,
        username: 'CyberArtist',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20artist%20avatar&image_size=square',
        isVerified: true
      },
      owner: {
        id: 2,
        username: 'NFTCollector',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=NFT%20collector%20avatar&image_size=square'
      },
      collection: {
        id: 1,
        name: 'Cyber Warriors',
        floorPrice: 2.5
      },
      price: 15.8,
      currency: 'ETH',
      rarity: 'Legendary',
      category: 'Gaming',
      attributes: [
        { trait_type: 'Armor Type', value: 'Quantum', rarity: 5 },
        { trait_type: 'Weapon', value: 'Plasma Sword', rarity: 8 },
        { trait_type: 'Background', value: 'Neon City', rarity: 12 }
      ],
      stats: {
        views: 1250,
        likes: 89,
        sales: 3,
        volume: 45.2
      },
      isLiked: false,
      isForSale: true,
      isAuction: false,
      lastSale: {
        price: 12.5,
        currency: 'ETH',
        date: '2024-01-15T10:30:00Z'
      },
      priceHistory: [
        { price: 8.5, date: '2024-01-01' },
        { price: 12.5, date: '2024-01-15' },
        { price: 15.8, date: '2024-01-20' }
      ]
    },
    {
      id: 2,
      name: 'Dragon Essence Crystal',
      description: 'A mystical crystal containing the essence of an ancient dragon, pulsing with magical energy.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=magical%20dragon%20crystal%20NFT%20with%20glowing%20effects&image_size=square',
      creator: {
        id: 3,
        username: 'MysticCreator',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mystical%20creator%20avatar&image_size=square',
        isVerified: true
      },
      owner: {
        id: 4,
        username: 'DragonLord',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dragon%20lord%20avatar&image_size=square'
      },
      collection: {
        id: 2,
        name: 'Mystic Artifacts',
        floorPrice: 1.8
      },
      price: 8.5,
      currency: 'ETH',
      rarity: 'Epic',
      category: 'Art',
      attributes: [
        { trait_type: 'Element', value: 'Fire', rarity: 15 },
        { trait_type: 'Power Level', value: 'Ancient', rarity: 3 },
        { trait_type: 'Glow', value: 'Crimson', rarity: 20 }
      ],
      stats: {
        views: 890,
        likes: 67,
        sales: 2,
        volume: 25.8
      },
      isLiked: true,
      isForSale: true,
      isAuction: true,
      auctionEndTime: '2024-01-25T18:00:00Z',
      lastSale: {
        price: 6.2,
        currency: 'ETH',
        date: '2024-01-10T14:20:00Z'
      },
      priceHistory: [
        { price: 4.5, date: '2024-01-01' },
        { price: 6.2, date: '2024-01-10' },
        { price: 8.5, date: '2024-01-20' }
      ]
    },
    {
      id: 3,
      name: 'Quantum Racer #777',
      description: 'A high-speed quantum racing vehicle designed for interdimensional competitions.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20quantum%20racing%20car%20NFT%20with%20energy%20trails&image_size=square',
      video: 'https://example.com/quantum-racer-animation',
      creator: {
        id: 5,
        username: 'SpeedDesigner',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=speed%20designer%20avatar&image_size=square',
        isVerified: false
      },
      owner: {
        id: 6,
        username: 'RacingFan',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=racing%20fan%20avatar&image_size=square'
      },
      collection: {
        id: 3,
        name: 'Quantum Racers',
        floorPrice: 3.2
      },
      price: 12.0,
      currency: 'ETH',
      rarity: 'Rare',
      category: 'Gaming',
      attributes: [
        { trait_type: 'Speed', value: 'Quantum', rarity: 10 },
        { trait_type: 'Engine', value: 'Fusion Core', rarity: 7 },
        { trait_type: 'Color', value: 'Plasma Blue', rarity: 25 }
      ],
      stats: {
        views: 1580,
        likes: 124,
        sales: 5,
        volume: 68.5
      },
      isLiked: false,
      isForSale: true,
      isAuction: false,
      lastSale: {
        price: 9.8,
        currency: 'ETH',
        date: '2024-01-18T09:15:00Z'
      },
      priceHistory: [
        { price: 7.2, date: '2024-01-01' },
        { price: 9.8, date: '2024-01-18' },
        { price: 12.0, date: '2024-01-20' }
      ]
    },
    {
      id: 4,
      name: 'Mech Pilot Badge',
      description: 'An exclusive badge awarded to elite mech pilots in the METATOPIA universe.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elite%20mech%20pilot%20badge%20NFT%20with%20metallic%20finish&image_size=square',
      creator: {
        id: 7,
        username: 'MechCorps',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mech%20corps%20avatar&image_size=square',
        isVerified: true
      },
      owner: {
        id: 8,
        username: 'ElitePilot',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elite%20pilot%20avatar&image_size=square'
      },
      collection: {
        id: 4,
        name: 'Mech Corps Badges',
        floorPrice: 0.8
      },
      price: 2.5,
      currency: 'ETH',
      rarity: 'Common',
      category: 'Collectibles',
      attributes: [
        { trait_type: 'Rank', value: 'Elite', rarity: 30 },
        { trait_type: 'Material', value: 'Titanium', rarity: 40 },
        { trait_type: 'Glow', value: 'Blue', rarity: 50 }
      ],
      stats: {
        views: 456,
        likes: 34,
        sales: 8,
        volume: 18.2
      },
      isLiked: true,
      isForSale: true,
      isAuction: false,
      lastSale: {
        price: 1.8,
        currency: 'ETH',
        date: '2024-01-19T16:45:00Z'
      },
      priceHistory: [
        { price: 1.2, date: '2024-01-01' },
        { price: 1.8, date: '2024-01-19' },
        { price: 2.5, date: '2024-01-20' }
      ]
    },
    {
      id: 5,
      name: 'Cosmic Symphony #42',
      description: 'A unique audio-visual NFT that combines cosmic sounds with stunning visual effects.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cosmic%20symphony%20NFT%20with%20musical%20waves%20and%20space%20theme&image_size=square',
      creator: {
        id: 9,
        username: 'CosmicComposer',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cosmic%20composer%20avatar&image_size=square',
        isVerified: true
      },
      owner: {
        id: 10,
        username: 'MusicLover',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=music%20lover%20avatar&image_size=square'
      },
      collection: {
        id: 5,
        name: 'Cosmic Symphonies',
        floorPrice: 1.5
      },
      price: 6.8,
      currency: 'ETH',
      rarity: 'Rare',
      category: 'Music',
      attributes: [
        { trait_type: 'Duration', value: '3:42', rarity: 35 },
        { trait_type: 'Key', value: 'C Major', rarity: 45 },
        { trait_type: 'Tempo', value: '120 BPM', rarity: 60 }
      ],
      stats: {
        views: 723,
        likes: 56,
        sales: 4,
        volume: 28.4
      },
      isLiked: false,
      isForSale: true,
      isAuction: true,
      auctionEndTime: '2024-01-24T12:00:00Z',
      lastSale: {
        price: 4.2,
        currency: 'ETH',
        date: '2024-01-12T11:30:00Z'
      },
      priceHistory: [
        { price: 3.5, date: '2024-01-01' },
        { price: 4.2, date: '2024-01-12' },
        { price: 6.8, date: '2024-01-20' }
      ]
    }
  ]

  const collections: Collection[] = [
    {
      id: 1,
      name: 'Cyber Warriors',
      description: 'Elite digital warriors from the cyberpunk future',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyber%20warriors%20collection%20banner&image_size=landscape_16_9',
      creator: 'CyberArtist',
      floorPrice: 2.5,
      volume24h: 156.8,
      change24h: 12.5,
      items: 10000,
      owners: 3420
    },
    {
      id: 2,
      name: 'Mystic Artifacts',
      description: 'Ancient magical items with mysterious powers',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mystic%20artifacts%20collection%20banner&image_size=landscape_16_9',
      creator: 'MysticCreator',
      floorPrice: 1.8,
      volume24h: 89.2,
      change24h: -5.2,
      items: 5000,
      owners: 1850
    },
    {
      id: 3,
      name: 'Quantum Racers',
      description: 'High-speed vehicles for interdimensional racing',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20racers%20collection%20banner&image_size=landscape_16_9',
      creator: 'SpeedDesigner',
      floorPrice: 3.2,
      volume24h: 234.5,
      change24h: 18.7,
      items: 7777,
      owners: 2890
    }
  ]

  const categories = [
    { id: 'all', name: '全部', icon: Grid3X3 },
    { id: 'Art', name: '艺术', icon: Palette },
    { id: 'Gaming', name: '游戏', icon: Gamepad2 },
    { id: 'Music', name: '音乐', icon: Music },
    { id: 'Sports', name: '体育', icon: Award },
    { id: 'Collectibles', name: '收藏品', icon: Star },
    { id: 'Virtual Worlds', name: '虚拟世界', icon: Eye }
  ]

  const rarities = [
    { id: 'all', name: '全部稀有度', color: 'text-gray-400' },
    { id: 'Common', name: '普通', color: 'text-gray-400' },
    { id: 'Rare', name: '稀有', color: 'text-blue-400' },
    { id: 'Epic', name: '史诗', color: 'text-purple-400' },
    { id: 'Legendary', name: '传说', color: 'text-orange-400' },
    { id: 'Mythic', name: '神话', color: 'text-red-400' }
  ]

  const sortOptions = [
    { id: 'price_low', name: '价格：低到高' },
    { id: 'price_high', name: '价格：高到低' },
    { id: 'newest', name: '最新上架' },
    { id: 'oldest', name: '最早上架' },
    { id: 'most_liked', name: '最多喜欢' },
    { id: 'most_viewed', name: '最多浏览' }
  ]

  const filteredNFTs = useMemo(() => {
    let filtered = nfts.filter(nft => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory
      const matchesRarity = selectedRarity === 'all' || nft.rarity === selectedRarity
      const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesRarity && matchesPrice
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'most_liked':
          return b.stats.likes - a.stats.likes
        case 'most_viewed':
          return b.stats.views - a.stats.views
        default:
          return b.id - a.id
      }
    })

    return filtered
  }, [nfts, searchTerm, selectedCategory, selectedRarity, priceRange, sortBy])

  const handleLikeNFT = async (nftId: number) => {
    setLoadingAction(`like-${nftId}`)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const nft = nfts.find(n => n.id === nftId)
      if (nft) {
        nft.isLiked = !nft.isLiked
        nft.stats.likes += nft.isLiked ? 1 : -1
        showToast.success(nft.isLiked ? '已添加到收藏' : '已从收藏移除')
      }
    } catch (error) {
      showToast.error('操作失败')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleBuyNFT = async (nftId: number) => {
    setLoadingAction(`buy-${nftId}`)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const nft = nfts.find(n => n.id === nftId)
      if (nft) {
        showToast.success(`成功购买 ${nft.name}！`)
        nft.isForSale = false
      }
    } catch (error) {
      showToast.error('购买失败')
    } finally {
      setLoadingAction(null)
    }
  }

  const handlePlaceBid = async (nftId: number) => {
    setLoadingAction(`bid-${nftId}`)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const nft = nfts.find(n => n.id === nftId)
      if (nft) {
        showToast.success(`成功出价 ${nft.name}！`)
      }
    } catch (error) {
      showToast.error('出价失败')
    } finally {
      setLoadingAction(null)
    }
  }

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp)
    const now = new Date()
    const diff = time.getTime() - now.getTime()
    
    if (diff <= 0) return '已结束'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}天 ${hours}小时`
    if (hours > 0) return `${hours}小时 ${minutes}分钟`
    return `${minutes}分钟`
  }

  const getRarityColor = (rarity: string) => {
    const rarityObj = rarities.find(r => r.id === rarity)
    return rarityObj?.color || 'text-gray-400'
  }

  const NFTCard: React.FC<{ nft: NFT; index: number }> = ({ nft, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming group hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedNFT(selectedNFT === nft.id ? null : nft.id)}
    >
      {/* NFT Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleLikeNFT(nft.id)
              }}
              disabled={loadingAction === `like-${nft.id}`}
              className={cn(
                "p-2 rounded-lg transition-colors",
                nft.isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              <Heart className={cn("w-4 h-4", nft.isLiked && "fill-current")} />
            </button>
            <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Rarity Badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-bold bg-black/70",
            getRarityColor(nft.rarity)
          )}>
            {nft.rarity}
          </span>
        </div>
        
        {/* Auction Timer */}
        {nft.isAuction && nft.auctionEndTime && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3 h-3 inline mr-1" />
            {formatTime(nft.auctionEndTime)}
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-tech font-bold text-lg mb-1">{nft.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{nft.description}</p>
        </div>
        
        {/* Creator & Collection */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <img
              src={nft.creator.avatar}
              alt={nft.creator.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-400">by</span>
            <span className="text-neon-400">{nft.creator.username}</span>
            {nft.creator.isVerified && (
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Collection: <span className="text-gray-400">{nft.collection.name}</span>
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