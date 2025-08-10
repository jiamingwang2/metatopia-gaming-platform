import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Gamepad2, Trophy, Users, ShoppingBag, GraduationCap, User, HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { authState, logout } = useAuth()

  const navItems = [
    { name: '首页', href: '/', icon: null },
    { name: '游戏中心', href: '/games', icon: Gamepad2 },
    { name: '电竞竞技', href: '/esports', icon: Trophy },
    { name: '社交广场', href: '/social', icon: Users },
    { name: 'NFT市场', href: '/nft', icon: ShoppingBag },
    { name: '学习学院', href: '/academy', icon: GraduationCap },
    { name: '个人中心', href: '/profile', icon: User },
    { name: '帮助支持', href: '/help', icon: HelpCircle },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-900/95 backdrop-blur-md border-b border-neon-500/20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-500 to-esports-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-gaming font-bold text-gradient">METATOPIA</span>
              <span className="text-xs text-gray-400 -mt-1">MTP</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors duration-300 group",
                    isActive 
                      ? "text-neon-500" 
                      : "text-gray-300 hover:text-neon-500"
                  )}
                >
                  {Icon && <Icon className={cn(
                    "w-4 h-4",
                    isActive ? "animate-pulse" : "group-hover:animate-pulse"
                  )} />}
                  <span className="font-tech font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {authState.isAuthenticated && authState.user ? (
              <div className="relative">
                {/* User Info */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-primary-800/50 hover:bg-primary-700/50 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-500 to-esports-500 flex items-center justify-center">
                    {authState.user.avatar ? (
                      <img 
                        src={authState.user.avatar} 
                        alt={authState.user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{authState.user.nickname || authState.user.username}</div>
                    <div className="text-xs text-gray-400">Lv.{authState.user.level}</div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-primary-800/95 backdrop-blur-lg rounded-lg shadow-xl border border-neon-500/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-500 to-esports-500 flex items-center justify-center">
                          {authState.user.avatar ? (
                            <img 
                              src={authState.user.avatar} 
                              alt={authState.user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{authState.user.nickname || authState.user.username}</div>
                          <div className="text-sm text-gray-400">{authState.user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-neon-500 hover:bg-primary-700/50 transition-all duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>个人中心</span>
                      </Link>
                      
                      <Link
                        to="/profile?tab=wallet"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-neon-500 hover:bg-primary-700/50 transition-all duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>我的钱包</span>
                      </Link>
                      
                      <button
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-neon-500 hover:bg-primary-700/50 transition-all duration-200 w-full text-left"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          // TODO: 打开设置页面
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>设置</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                          navigate('/')
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  登录
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-neon-500 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                    isActive
                      ? "text-neon-500 bg-primary-800/50"
                      : "text-gray-300 hover:text-neon-500 hover:bg-primary-800/50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {Icon && <Icon className={cn(
                    "w-5 h-5",
                    isActive && "animate-pulse"
                  )} />}
                  <span className="font-tech font-medium">{item.name}</span>
                </Link>
              )
            })}
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-neon-500/20">
              {authState.isAuthenticated && authState.user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-primary-800/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-500 to-esports-500 flex items-center justify-center">
                      {authState.user.avatar ? (
                        <img 
                          src={authState.user.avatar} 
                          alt={authState.user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{authState.user.nickname || authState.user.username}</div>
                      <div className="text-xs text-gray-400">Lv.{authState.user.level}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                      navigate('/')
                    }}
                    className="flex items-center justify-center space-x-2 btn-secondary text-sm py-2 px-4 w-full text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm py-2 px-4 w-full text-center" onClick={() => setIsMenuOpen(false)}>
                    登录
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4 w-full text-center" onClick={() => setIsMenuOpen(false)}>
                    注册
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header