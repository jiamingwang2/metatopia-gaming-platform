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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Mock data
  const courses: Course[] = [
    {
      id: 1,
      title: "Unity游戏开发完整教程",
      description: "从零开始学习Unity游戏引擎，掌握2D和3D游戏开发技能，包括物理系统、动画、UI设计等核心技术。",
      thumbnail: "/images/courses/unity-course.jpg",
      instructor: {
        id: 1,
        name: "张伟",
        avatar: "/images/instructors/zhang-wei.jpg",
        title: "资深游戏开发工程师",
        rating: 4.9
      },
      category: "Programming",
      difficulty: "Intermediate",
      duration: 45,
      lessons: 120,
      students: 2580,
      rating: 4.8,
      price: 299,
      currency: "MTP",
      tags: ["Unity", "C#", "游戏开发", "3D建模"],
      skills: ["Unity引擎", "C#编程", "游戏物理", "UI设计", "动画系统"],
      requirements: ["基础编程知识", "了解面向对象编程", "Windows或Mac电脑"],
      whatYouLearn: [
        "掌握Unity编辑器的使用",
        "学会C#脚本编程",
        "理解游戏物理系统",
        "创建游戏UI界面",
        "实现角色动画",
        "发布游戏到各平台"
      ],
      isEnrolled: true,
      progress: 65,
      lastAccessed: "2024-01-15",
      preview: {
        videoUrl: "/videos/unity-preview.mp4",
        duration: 180
      }
    },
    {
      id: 2,
      title: "区块链游戏开发入门",
      description: "学习如何将区块链技术集成到游戏中，包括智能合约开发、NFT集成、代币经济设计等前沿技术。",
      thumbnail: "/images/courses/blockchain-game.jpg",
      instructor: {
        id: 2,
        name: "李明",
        avatar: "/images/instructors/li-ming.jpg",
        title: "区块链技术专家",
        rating: 4.7
      },
      category: "Blockchain",
      difficulty: "Advanced",
      duration: 32,
      lessons: 85,
      students: 1240,
      rating: 4.6,
      price: 399,
      currency: "MTP",
      tags: ["区块链", "智能合约", "NFT", "Web3"],
      skills: ["Solidity编程", "智能合约开发", "NFT标准", "DeFi集成", "钱包连接"],
      requirements: ["基础编程经验", "了解区块链概念", "JavaScript基础"],
      whatYouLearn: [
        "理解区块链游戏架构",
        "开发智能合约",
        "创建和管理NFT",
        "设计代币经济模型",
        "集成钱包功能",
        "部署到主网"
      ],
      isEnrolled: false,
      preview: {
        videoUrl: "/videos/blockchain-preview.mp4",
        duration: 240
      }
    },
    {
      id: 3,
      title: "数字艺术与NFT创作",
      description: "学习数字艺术创作技巧，掌握Photoshop、Blender等工具，了解NFT市场和创作流程。",
      thumbnail: "/images/courses/digital-art.jpg",
      instructor: {
        id: 3,
        name: "王艺",
        avatar: "/images/instructors/wang-yi.jpg",
        title: "数字艺术家",
        rating: 4.9
      },
      category: "Art & Animation",
      difficulty: "Beginner",
      duration: 28,
      lessons: 75,
      students: 3200,
      rating: 4.7,
      price: 0,
      currency: "Free",
      tags: ["数字艺术", "NFT", "Photoshop", "Blender"],
      skills: ["数字绘画", "3D建模", "材质贴图", "NFT制作", "市场营销"],
      requirements: ["艺术基础", "创意思维", "电脑操作熟练"],
      whatYouLearn: [
        "掌握数字绘画技巧",
        "学会3D建模基础",
        "了解NFT创作流程",
        "掌握作品包装技巧",
        "学习市场推广策略",
        "建立个人品牌"
      ],
      isEnrolled: true,
      progress: 30,
      lastAccessed: "2024-01-12",
      preview: {
        videoUrl: "/videos/art-preview.mp4",
        duration: 150
      }
    },
    {
      id: 4,
      title: "电竞战术分析与训练",
      description: "深入学习电竞战术分析方法，提升团队配合能力，掌握数据分析工具的使用。",
      thumbnail: "/images/courses/esports-tactics.jpg",
      instructor: {
        id: 4,
        name: "陈强",
        avatar: "/images/instructors/chen-qiang.jpg",
        title: "前职业选手",
        rating: 4.8
      },
      category: "Esports",
      difficulty: "Intermediate",
      duration: 20,
      lessons: 50,
      students: 1800,
      rating: 4.5,
      price: 199,
      currency: "MTP",
      tags: ["电竞", "战术分析", "团队配合", "心理素质"],
      skills: ["战术分析", "数据解读", "团队沟通", "心理调节", "训练规划"],
      requirements: ["游戏基础", "团队合作精神", "学习能力强"],
      whatYouLearn: [
        "掌握战术分析方法",
        "学会数据统计分析",
        "提升团队配合能力",
        "培养心理素质",
        "制定训练计划",
        "比赛策略制定"
      ],
      isEnrolled: false,
      preview: {
        videoUrl: "/videos/esports-preview.mp4",
        duration: 200
      }
    },
    {
      id: 5,
      title: "游戏音效制作与配乐",
      description: "学习游戏音效设计和配乐制作，掌握专业音频软件的使用，创作沉浸式游戏音频体验。",
      thumbnail: "/images/courses/game-audio.jpg",
      instructor: {
        id: 5,
        name: "刘音",
        avatar: "/images/instructors/liu-yin.jpg",
        title: "音频设计师",
        rating: 4.6
      },
      category: "Music Production",
      difficulty: "Intermediate",
      duration: 35,
      lessons: 90,
      students: 950,
      rating: 4.4,
      price: 249,
      currency: "MTP",
      tags: ["音效设计", "配乐制作", "音频软件", "声音设计"],
      skills: ["音效录制", "音频编辑", "配乐创作", "混音技术", "音频优化"],
      requirements: ["音乐基础", "听觉敏感", "创意思维"],
      whatYouLearn: [
        "掌握音效录制技巧",
        "学会音频编辑软件",
        "创作游戏配乐",
        "理解音频心理学",
        "掌握混音技术",
        "优化音频性能"
      ],
      isEnrolled: false,
      preview: {
        videoUrl: "/videos/audio-preview.mp4",
        duration: 160
      }
    },
    {
      id: 6,
      title: "Python游戏编程基础",
      description: "使用Python和Pygame库开发简单游戏，适合编程初学者入门游戏开发领域。",
      thumbnail: "/images/courses/python-game.jpg",
      instructor: {
        id: 6,
        name: "赵程",
        avatar: "/images/instructors/zhao-cheng.jpg",
        title: "Python开发专家",
        rating: 4.7
      },
      category: "Programming",
      difficulty: "Beginner",
      duration: 25,
      lessons: 60,
      students: 2100,
      rating: 4.6,
      price: 0,
      currency: "Free",
      tags: ["Python", "Pygame", "编程入门", "游戏逻辑"],
      skills: ["Python语法", "Pygame库", "游戏循环", "碰撞检测", "图形绘制"],
      requirements: ["计算机基础", "逻辑思维", "学习热情"],
      whatYouLearn: [
        "掌握Python基础语法",
        "学会Pygame库使用",
        "理解游戏开发流程",
        "实现游戏逻辑",
        "处理用户输入",
        "完成完整游戏项目"
      ],
      isEnrolled: true,
      progress: 85,
      lastAccessed: "2024-01-14",
      certificate: {
        id: "cert-python-001",
        issuedAt: "2024-01-10",
        credentialId: "PYG-2024-001-ZC"
      },
      preview: {
        videoUrl: "/videos/python-preview.mp4",
        duration: 120
      }
    }
  ]

  const certificates: Certificate[] = [
    {
      id: "cert-001",
      courseId: 6,
      courseName: "Python游戏编程基础",
      instructorName: "赵程",
      issuedAt: "2024-01-10",
      credentialId: "PYG-2024-001-ZC",
      skills: ["Python编程", "Pygame开发", "游戏逻辑设计"],
      grade: "A+",
      verificationUrl: "https://academy.metatopia.com/verify/cert-001"
    },
    {
      id: "cert-002",
      courseId: 1,
      courseName: "Unity游戏开发完整教程",
      instructorName: "张伟",
      issuedAt: "2023-12-15",
      credentialId: "UGD-2023-002-ZW",
      skills: ["Unity引擎", "C#编程", "3D游戏开发"],
      grade: "A",
      verificationUrl: "https://academy.metatopia.com/verify/cert-002"
    }
  ]

  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: "游戏开发大师之路",
      description: "从编程基础到高级游戏开发，全面掌握游戏开发技能",
      thumbnail: "/images/paths/game-dev-master.jpg",
      courses: [6, 1, 2],
      duration: 102,
      difficulty: "Intermediate",
      completionRate: 45,
      isEnrolled: true
    },
    {
      id: 2,
      title: "数字创作者养成计划",
      description: "培养数字艺术创作能力，成为NFT艺术家",
      thumbnail: "/images/paths/digital-creator.jpg",
      courses: [3, 5],
      duration: 63,
      difficulty: "Beginner",
      completionRate: 20,
      isEnrolled: true
    },
    {
      id: 3,
      title: "电竞职业选手训练营",
      description: "专业电竞训练，提升竞技水平和战术素养",
      thumbnail: "/images/paths/esports-pro.jpg",
      courses: [4],
      duration: 20,
      difficulty: "Advanced",
      completionRate: 0,
      isEnrolled: false
    }
  ]

  // Categories and filters
  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'Programming', name: '编程开发' },
    { id: 'Game Design', name: '游戏设计' },
    { id: 'Art & Animation', name: '艺术动画' },
    { id: 'Music Production', name: '音乐制作' },
    { id: 'Blockchain', name: '区块链' },
    { id: 'Esports', name: '电子竞技' }
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
    { id: 'price', name: '价格' }
  ]

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id // Assuming higher ID means newer
        case 'rating':
          return b.rating - a.rating
        case 'price':
          if (a.currency === 'Free' && b.currency !== 'Free') return -1
          if (a.currency !== 'Free' && b.currency === 'Free') return 1
          return a.price - b.price
        case 'popular':
        default:
          return b.students - a.students
      }
    })

    return filtered
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const enrolledCourses = courses.filter(course => course.isEnrolled)

  // Action handlers
  const handleEnrollCourse = async (courseId: number) => {
    setLoadingAction(`enroll-${courseId}`)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('success', '课程报名成功！')
    } catch (error) {
      showToast('error', '报名失败，请重试')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleContinueLearning = async (courseId: number) => {
    setLoadingAction(`continue-${courseId}`)
    try {
      // Simulate navigation to course
      await new Promise(resolve => setTimeout(resolve, 500))
      showToast('success', '正在进入课程...')
    } catch (error) {
      showToast('error', '进入课程失败')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDownloadCertificate = async (certificateId: string) => {
    setLoadingAction(`download-${certificateId}`)
    try {
      // Simulate certificate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('success', '证书下载成功！')
    } catch (error) {
      showToast('error', '下载失败，请重试')
    } finally {
      setLoadingAction(null)
    }
  }

  // Utility functions
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}分钟`
    return `${hours}小时`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
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
      case 'A+': return 'text-neon-400'
      case 'A': return 'text-green-400'
      case 'B+': return 'text-blue-400'
      case 'B': return 'text-yellow-400'
      case 'C+': return 'text-orange-400'
      case 'C': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  // Course Card Component
  const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming group hover:scale-105 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Course Thumbnail */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-neon-500 hover:bg-neon-400 text-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6" />
            </button>
          </div>
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              getDifficultyColor(course.difficulty)
            )}>
              {course.difficulty === 'Beginner' ? '初级' : 
               course.difficulty === 'Intermediate' ? '中级' : '高级'}
            </span>
            {course.currency === 'Free' ? (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                免费
              </span>
            ) : (
              <span className="bg-neon-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {course.price} {course.currency}
              </span>
            )}
          </div>
          
          {/* Top right actions */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar for enrolled courses */}
          {course.isEnrolled && course.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
              <div className="flex justify-between text-xs text-white mb-1">
                <span>学习进度</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-neon-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Course Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-white font-tech font-bold text-lg mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {course.description}
            </p>
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
              <div className="text-gray-500 text-xs">{course.instructor.title}</div>
            </div>
          </div>
          
          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons}课时</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="bg-primary-700 text-gray-300 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{course.tags.length - 3}</span>
            )}
          </div>
          
          {/* Action Button */}
          <div className="pt-3 border-t border-primary-700">
            {course.isEnrolled ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleContinueLearning(course.id)}
                  disabled={loadingAction === `continue-${course.id}`}
                  className="w-full btn-primary"
                >
                  {loadingAction === `continue-${course.id}` ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>加载中...</span>
                    </div>
                  ) : (
                    course.progress === 100 ? '复习课程' : '继续学习'
                  )}
                </button>
                {course.lastAccessed && (
                  <div className="text-xs text-gray-500 text-center">
                    上次学习：{formatDate(course.lastAccessed)}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleEnrollCourse(course.id)}
                disabled={loadingAction === `enroll-${course.id}`}
                className={cn(
                  "w-full font-medium py-2 rounded-lg transition-colors",
                  course.currency === 'Free'
                    ? "btn-primary"
                    : "btn-secondary"
                )}
              >
                {loadingAction === `enroll-${course.id}` ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>报名中...</span>
                  </div>
                ) : (
                  course.currency === 'Free' ? '免费学习' : '立即报名'
                )}
              </button>
            )}
          </div>
          
          {/* Expanded Details */}
          {selectedCourse?.id === course.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-primary-700"
            >
              <div>
                <h4 className="text-white font-medium mb-2">你将学到：</h4>
                <ul className="space-y-1">
                  {course.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">课程要求：</h4>
                <ul className="space-y-1">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )

  // Certificate Card Component
  const CertificateCard: React.FC<{ certificate: Certificate; index: number }> = ({ certificate, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-gaming hover:scale-105 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Certificate Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-neon-500/20 p-3 rounded-lg">
              <Award className="w-6 h-6 text-neon-400" />
            </div>
            <div>
              <h3 className="text-white font-tech font-bold text-lg">{certificate.courseName}</h3>
              <p className="text-gray-400 text-sm">讲师：{certificate.instructorName}</p>
            </div>
          </div>
          <span className={cn(
            "text-lg font-bold",
            getGradeColor(certificate.grade)
          )}>
            {certificate.grade}
          </span>
        </div>
        
        {/* Certificate Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>颁发日期：{formatDate(certificate.issuedAt)}</span>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-2">掌握技能：</div>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill, i) => (
                <span key={i} className="bg-neon-500/20 text-neon-400 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
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