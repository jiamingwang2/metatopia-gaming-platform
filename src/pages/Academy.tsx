import React, { useState, useMemo } from 'react'
import { Search, Filter, BookOpen, Play, Clock, Users, Star, Award, CheckCircle, Lock, Download, Eye, Calendar, TrendingUp, BarChart3, Target, Zap, Brain, Code, Gamepad2, Palette, Music, Trophy, Gift, ChevronRight, Plus, Bookmark, Share2, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { showToast } from '../utils/toast'

interface Course {
  id: number
  title: string
  description: string
  thumbnail: string
  instructor: {
    id: number
    name: string
    avatar: string
    title: string
    rating: number
  }
  category: 'Programming' | 'Game Design' | 'Art & Animation' | 'Music Production' | 'Blockchain' | 'Esports'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number // in hours
  lessons: number
  students: number
  rating: number
  price: number
  currency: 'MTP' | 'Free'
  tags: string[]
  skills: string[]
  requirements: string[]
  whatYouLearn: string[]
  isEnrolled: boolean
  progress?: number // 0-100
  lastAccessed?: string
  certificate?: {
    id: string
    issuedAt: string
    credentialId: string
  }
  preview?: {
    videoUrl: string
    duration: number
  }
}

interface Certificate {
  id: string
  courseId: number
  courseName: string
  instructorName: string
  issuedAt: string
  credentialId: string
  skills: string[]
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C'
  verificationUrl: string
}

interface LearningPath {
  id: number
  title: string
  description: string
  thumbnail: string
  courses: number[]
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  completionRate: number
  isEnrolled: boolean
}

const Academy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'my-learning' | 'certificates' | 'paths'>('courses')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const courses: Course[] = [
    {
      id: 1,
      title: 'Unity游戏开发完整教程',
      description: '从零开始学习Unity游戏引擎，掌握2D和3D游戏开发技能，包括脚本编程、物理系统、动画制作等核心技术。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Unity%20game%20development%20course%20thumbnail%20with%20game%20engine%20interface&image_size=landscape_16_9',
      instructor: {
        id: 1,
        name: 'Alex Chen',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20game%20developer%20instructor%20avatar&image_size=square',
        title: '资深游戏开发工程师',
        rating: 4.9
      },
      category: 'Game Design',
      difficulty: 'Beginner',
      duration: 45,
      lessons: 120,
      students: 15420,
      rating: 4.8,
      price: 299,
      currency: 'MTP',
      tags: ['Unity', '游戏开发', 'C#', '3D建模'],
      skills: ['Unity引擎', 'C#编程', '游戏设计', '3D建模', '动画制作'],
      requirements: ['基础计算机操作', '对游戏开发有兴趣'],
      whatYouLearn: [
        '掌握Unity引擎的核心功能',
        '学会C#脚本编程',
        '创建2D和3D游戏',
        '实现游戏物理和动画',
        '发布游戏到各平台'
      ],
      isEnrolled: true,
      progress: 65,
      lastAccessed: '2024-01-20T14:30:00Z',
      preview: {
        videoUrl: 'https://example.com/unity-preview',
        duration: 180
      }
    },
    {
      id: 2,
      title: '区块链游戏开发入门',
      description: '学习如何开发基于区块链的游戏，包括智能合约编写、NFT集成、代币经济设计等前沿技术。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20game%20development%20course%20with%20cryptocurrency%20and%20NFT%20elements&image_size=landscape_16_9',
      instructor: {
        id: 2,
        name: 'Sarah Kim',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20developer%20instructor%20avatar&image_size=square',
        title: '区块链技术专家',
        rating: 4.7
      },
      category: 'Blockchain',
      difficulty: 'Advanced',
      duration: 32,
      lessons: 85,
      students: 8750,
      rating: 4.6,
      price: 499,
      currency: 'MTP',
      tags: ['区块链', 'Solidity', 'NFT', 'Web3'],
      skills: ['智能合约开发', 'Solidity编程', 'NFT技术', 'DeFi集成', 'Web3开发'],
      requirements: ['基础编程经验', '了解区块链概念'],
      whatYouLearn: [
        '编写智能合约',
        '创建和管理NFT',
        '设计代币经济模型',
        '集成钱包功能',
        '部署到主网'
      ],
      isEnrolled: false,
      preview: {
        videoUrl: 'https://example.com/blockchain-preview',
        duration: 240
      }
    },
    {
      id: 3,
      title: '数字艺术与NFT创作',
      description: '学习数字艺术创作技巧，掌握从概念设计到NFT发布的完整流程，包括Photoshop、Blender等工具使用。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=digital%20art%20NFT%20creation%20course%20with%20artistic%20tools&image_size=landscape_16_9',
      instructor: {
        id: 3,
        name: 'Maria Rodriguez',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=digital%20artist%20instructor%20avatar&image_size=square',
        title: '知名数字艺术家',
        rating: 4.9
      },
      category: 'Art & Animation',
      difficulty: 'Intermediate',
      duration: 28,
      lessons: 75,
      students: 12300,
      rating: 4.7,
      price: 0,
      currency: 'Free',
      tags: ['数字艺术', 'NFT', 'Photoshop', 'Blender'],
      skills: ['数字绘画', '3D建模', 'NFT创作', '艺术设计', '作品集制作'],
      requirements: ['基础美术功底', '创意思维'],
      whatYouLearn: [
        '掌握数字绘画技巧',
        '学会3D建模和渲染',
        '创作独特的NFT作品',
        '了解艺术市场',
        '建立个人品牌'
      ],
      isEnrolled: true,
      progress: 100,
      lastAccessed: '2024-01-18T10:15:00Z',
      certificate: {
        id: 'cert_001',
        issuedAt: '2024-01-18T16:00:00Z',
        credentialId: 'MTP-ART-2024-001'
      }
    },
    {
      id: 4,
      title: '电竞战术分析与训练',
      description: '专业电竞教练指导，学习战术分析、团队配合、心理素质训练等电竞核心技能。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=esports%20training%20course%20with%20gaming%20setup%20and%20strategy&image_size=landscape_16_9',
      instructor: {
        id: 4,
        name: 'David Park',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20esports%20coach%20avatar&image_size=square',
        title: '职业电竞教练',
        rating: 4.8
      },
      category: 'Esports',
      difficulty: 'Intermediate',
      duration: 20,
      lessons: 50,
      students: 9850,
      rating: 4.5,
      price: 199,
      currency: 'MTP',
      tags: ['电竞', '战术分析', '团队配合', '心理训练'],
      skills: ['战术分析', '团队沟通', '反应训练', '心理调节', '比赛策略'],
      requirements: ['游戏基础', '团队合作精神'],
      whatYouLearn: [
        '分析游戏战术',
        '提升团队配合',
        '训练反应速度',
        '调节比赛心态',
        '制定比赛策略'
      ],
      isEnrolled: false,
      preview: {
        videoUrl: 'https://example.com/esports-preview',
        duration: 150
      }
    },
    {
      id: 5,
      title: '游戏音效制作与配乐',
      description: '学习游戏音效设计和配乐制作，掌握专业音频软件使用，创作沉浸式游戏音频体验。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=game%20audio%20production%20course%20with%20music%20studio%20setup&image_size=landscape_16_9',
      instructor: {
        id: 5,
        name: 'James Wilson',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=game%20audio%20composer%20instructor%20avatar&image_size=square',
        title: '游戏音频设计师',
        rating: 4.6
      },
      category: 'Music Production',
      difficulty: 'Beginner',
      duration: 25,
      lessons: 60,
      students: 6420,
      rating: 4.4,
      price: 249,
      currency: 'MTP',
      tags: ['音效设计', '游戏配乐', 'DAW', '音频制作'],
      skills: ['音效设计', '配乐创作', '音频编辑', '声音合成', '混音技术'],
      requirements: ['音乐基础', '对声音敏感'],
      whatYouLearn: [
        '设计游戏音效',
        '创作背景音乐',
        '掌握音频软件',
        '实现动态音频',
        '优化音频性能'
      ],
      isEnrolled: true,
      progress: 30,
      lastAccessed: '2024-01-19T09:45:00Z'
    },
    {
      id: 6,
      title: 'Python游戏编程基础',
      description: '使用Python和Pygame库开发简单游戏，适合编程初学者入门游戏开发领域。',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20game%20programming%20course%20with%20code%20and%20game%20elements&image_size=landscape_16_9',
      instructor: {
        id: 6,
        name: 'Lisa Zhang',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20instructor%20avatar&image_size=square',
        title: 'Python开发专家',
        rating: 4.7
      },
      category: 'Programming',
      difficulty: 'Beginner',
      duration: 18,
      lessons: 45,
      students: 11200,
      rating: 4.6,
      price: 0,
      currency: 'Free',
      tags: ['Python', 'Pygame', '编程基础', '游戏开发'],
      skills: ['Python编程', 'Pygame库', '游戏逻辑', '面向对象', '调试技巧'],
      requirements: ['无编程经验要求'],
      whatYouLearn: [
        '掌握Python基础语法',
        '使用Pygame开发游戏',
        '实现游戏逻辑',
        '处理用户输入',
        '优化游戏性能'
      ],
      isEnrolled: false,
      preview: {
        videoUrl: 'https://example.com/python-preview',
        duration: 120
      }
    }
  ]

  const certificates: Certificate[] = [
    {
      id: 'cert_001',
      courseId: 3,
      courseName: '数字艺术与NFT创作',
      instructorName: 'Maria Rodriguez',
      issuedAt: '2024-01-18T16:00:00Z',
      credentialId: 'MTP-ART-2024-001',
      skills: ['数字绘画', '3D建模', 'NFT创作', '艺术设计'],
      grade: 'A+',
      verificationUrl: 'https://academy.metatopia.com/verify/MTP-ART-2024-001'
    }
  ]

  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: '游戏开发大师之路',
      description: '从零基础到专业游戏开发者的完整学习路径',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=game%20development%20master%20path%20with%20progression%20elements&image_size=landscape_16_9',
      courses: [6, 1, 2],
      duration: 95,
      difficulty: 'Beginner',
      completionRate: 35,
      isEnrolled: true
    },
    {
      id: 2,
      title: '数字创作者养成计划',
      description: '培养全方位数字内容创作能力',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=digital%20creator%20path%20with%20creative%20tools&image_size=landscape_16_9',
      courses: [3, 5],
      duration: 53,
      difficulty: 'Intermediate',
      completionRate: 60,
      isEnrolled: true
    },
    {
      id: 3,
      title: '电竞职业选手训练营',
      description: '专业电竞技能培训和职业发展指导',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=esports%20professional%20training%20path&image_size=landscape_16_9',
      courses: [4],
      duration: 20,
      difficulty: 'Advanced',
      completionRate: 0,
      isEnrolled: false
    }
  ]

  const categories = [
    { id: 'all', name: '全部课程', icon: BookOpen },
    { id: 'Programming', name: '编程开发', icon: Code },
    { id: 'Game Design', name: '游戏设计', icon: Gamepad2 },
    { id: 'Art & Animation', name: '艺术动画', icon: Palette },
    { id: 'Music Production', name: '音乐制作', icon: Music },
    { id: 'Blockchain', name: '区块链', icon: Zap },
    { id: 'Esports', name: '电子竞技', icon: Trophy }
  ]

  const difficulties = [
    { id: 'all', name: '全部难度' },
    { id: 'Beginner', name: '初级' },
    { id: 'Intermediate', name: '中级' },
    { id: 'Advanced', name: '高级' }
  ]

  const sortOptions = [
    { id: 'popular', name: '最受欢迎' },
    { id: 'newest', name: '最新发布' },
    { id: 'rating', name: '评分最高' },
    { id: 'price_low', name: '价格：低到高' },
    { id: 'price_high', name: '价格：高到低' }
  ]

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id
        case 'rating':
          return b.rating - a.rating
        case 'price_low':
          if (a.currency === 'Free' && b.currency !== 'Free') return -1
          if (a.currency !== 'Free' && b.currency === 'Free') return 1
          return a.price - b.price
        case 'price_high':
          if (a.currency === 'Free' && b.currency !== 'Free') return 1
          if (a.currency !== 'Free' && b.currency === 'Free') return -1
          return b.price - a.price
        default: // popular
          return b.students - a.students
      }
    })

    return filtered
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const enrolledCourses = courses.filter(course => course.isEnrolled)

  const handleEnrollCourse = async (courseId: number) => {
    setLoadingAction(`enroll-${courseId}`)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const course = courses.find(c => c.id === courseId)
      if (course) {
        course.isEnrolled = true
        course.progress = 0
        course.lastAccessed = new Date().toISOString()
        showToast.success(`已成功报名 ${course.title}！`)
      }
    } catch (error) {
      showToast.error('报名失败')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleContinueLearning = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      showToast.info(`继续学习 ${course.title}`)
    }
  }

  const handleDownloadCertificate = (certificateId: string) => {
    showToast.success('证书下载已开始')
  }

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}分钟`
    }
    return `${hours}小时`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'Advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-400'
      case 'B+': case 'B': return 'text-yellow-400'
      case 'C+': case 'C': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming group hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
    >
      {/* Course Thumbnail */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            {course.preview && (
              <button className="p-3 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
                <Play className="w-5 h-5" />
              </button>
            )}
            <button className="p-3 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Difficulty Badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-bold",
            getDifficultyColor(course.difficulty)
          )}>
            {course.difficulty === 'Beginner' ? '初级' : course.difficulty === 'Intermediate' ? '中级' : '高级'}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-bold",
            course.currency === 'Free' ? 'bg-green-500 text-white' : 'bg-neon-500 text-white'
          )}>
            {course.currency === 'Free' ? '免费' : `${course.price} ${course.currency}`}
          </span>
        </div>
        
        {/* Progress Bar for Enrolled Courses */}
        {course.isEnrolled && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-neon-500 transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-tech font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
        </div>
        
        {/* Instructor */}
        <div className="flex items-center space-x-3">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-white text-sm font-medium">{course.instructor.name}</div>
            <div className="text-gray-400 text-xs">{course.instructor.title}</div>
          </div>
        </div>
        
        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{course.lessons}课时</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="bg-primary-700 text-gray-300 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="text-gray-400 text-xs">+{course.tags.length - 3}</span>
          )}
        </div>
        
        {/* Action Button */}
        <div className="pt-3 border-t border-primary-700">
          {course.isEnrolled ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">学习进度</span>
                <span className="text-neon-400">{course.progress}%</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleContinueLearning(course.id)
                }}
                className="w-full btn-primary"
              >
                {course.progress === 100 ? '复习课程' : '继续学习'}
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEnrollCourse(course.id)
              }}
              disabled={loadingAction === `enroll-${course.id}`}
              className={cn(
                "w-full btn-primary",
                loadingAction === `enroll-${course.id}` && "opacity-50 cursor-not-allowed"
              )}
            >
              {loadingAction === `enroll-${course.id}` ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>报名中...</span>
                </div>
              ) : (
                course.currency === 'Free' ? '免费学习' : `${course.price} ${course.currency} 报名`
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {selectedCourse === course.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-primary-700 space-y-4"
        >
          {/* Skills */}
          <div>
            <h4 className="text-white font-bold mb-2">你将学到</h4>
            <div className="space-y-1">
              {course.whatYouLearn.map((item, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Requirements */}
          {course.requirements.length > 0 && (
            <div>
              <h4 className="text-white font-bold mb-2">课程要求</h4>
              <div className="space-y-1">
                {course.requirements.map((req, i) => (
                  <div key={i} className="flex items-start space-x-2 text-sm">
                    <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )

  const CertificateCard: React.FC<{ certificate: Certificate; index: number }> = ({ certificate, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming hover:scale-105 transition-all duration-300"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Award className="w-12 h-12 text-yellow-400" />
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-bold",
            getGradeColor(certificate.grade)
          )}>
            {certificate.grade}
          </span>
        </div>
        
        <div>
          <h3 className="text-white font-tech font-bold text-lg mb-2">{certificate.courseName}</h3>
          <p className="text-gray-400 text-sm mb-1">讲师：{certificate.instructorName}</p>
          <p className="text-gray-500 text-xs">颁发日期：{formatDate(certificate.issuedAt)}</p>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-2">掌握技能</h4>
          <div className="flex flex-wrap gap-1">
            {certificate.skills.map((skill, i) => (
              <span key={i} className="bg-neon-500/20 text-neon-400 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="pt-3 border-t border-primary-700">
          <div className="text-xs text-gray-500 mb-3">
            证书ID：{certificate.credentialId}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDownloadCertificate(certificate.id)}
              className="flex-1 btn-primary text-sm py-2"
            >
              <Download className="w-3 h-3 mr-1" />
              下载证书
            </button>
            <button className="flex-1 btn-secondary text-sm py-2">
              <Eye className="w-3 h-3 mr-1" />
              验证证书
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const LearningPathCard: React.FC<{ path: LearningPath; index: number }> = ({ path, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming hover:scale-105 transition-all duration-300"
    >
      <div className="space-y-4">
        <img
          src={path.thumbnail}
          alt={path.title}
          className="w-full h-32 object-cover rounded-lg"
        />
        
        <div>
          <h3 className="text-white font-tech font-bold text-lg mb-2">{path.title}</h3>
          <p className="text-gray-400 text-sm">{path.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">课程数量</div>
            <div className="text-white font-bold">{path.courses.length}门课程</div>
          </div>
          <div>
            <div className="text-gray-400">总时长</div>
            <div className="text-white font-bold">{formatDuration(path.duration)}</div>
          </div>
        </div>
        
        {path.isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">完成进度</span>
              <span className="text-neon-400">{path.completionRate}%</span>
            </div>
            <div className="w-full bg-primary-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-neon-500 to-neon-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${path.completionRate}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="pt-3 border-t border-primary-700">
          <button className={cn(
            "w-full font-medium py-2 rounded-lg transition-colors",
            path.isEnrolled
              ? "btn-primary"
              : "btn-secondary"
          )}>
            {path.isEnrolled ? '继续学习路径' : '加入学习路径'}
          </button>
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
            <span className="text-gradient">学习学院</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            提升技能，掌握前沿技术，成为游戏行业专家
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
              { id: 'courses', label: '课程中心', icon: BookOpen },
              { id: 'my-learning', label: '我的学习', icon: Brain },
              { id: 'certificates', label: '我的证书', icon: Award },
              { id: 'paths', label: '学习路径', icon: Target }
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

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              {/* Search and Filters */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="搜索课程、讲师或技能..."
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

                    {/* Difficulty Filter */}
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-primary-800 border border-primary-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
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
                </div>
              </div>

              {/* Results Count */}
              <div className="text-gray-400 text-sm">
                找到 {filteredCourses.length} 门课程
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>

              {/* Empty State */}
              {filteredCourses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-16"
                >
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">未找到课程</h3>
                  <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setSelectedDifficulty('all')
                    }}
                    className="btn-primary"
                  >
                    重置筛选
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* My Learning Tab */}
          {activeTab === 'my-learning' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">我的学习</h2>
                <p className="text-gray-400">继续你的学习之旅</p>
              </div>
              
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-16"
                >
                  <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">还没有报名课程</h3>
                  <p className="text-gray-500 mb-6">开始你的学习之旅吧</p>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="btn-primary"
                  >
                    浏览课程
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">我的证书</h2>
                <p className="text-gray-400">展示你的学习成就</p>
              </div>
              
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate, index) => (
                    <CertificateCard key={certificate.id} certificate={certificate} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-16"
                >
                  <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-tech font-bold text-gray-400 mb-2">还没有获得证书</h3>
                  <p className="text-gray-500 mb-6">完成课程学习获得专业证书</p>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="btn-primary"
                  >
                    开始学习
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Learning Paths Tab */}
          {activeTab === 'paths' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-tech font-bold text-white mb-2">学习路径</h2>
                <p className="text-gray-400">系统化的技能提升方案</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => (
                  <LearningPathCard key={path.id} path={path} index={index} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Academy