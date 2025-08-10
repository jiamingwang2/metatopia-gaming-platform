import React from 'react'
import { Gamepad2, Twitter, Github, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: '游戏中心', href: '/games' },
      { name: '电竞竞技', href: '/esports' },
      { name: 'NFT市场', href: '/marketplace' },
      { name: '学习学院', href: '/academy' },
    ],
    community: [
      { name: '社交广场', href: '/social' },
      { name: '开发者社区', href: '/developers' },
      { name: '合作伙伴', href: '/partners' },
      { name: '活动中心', href: '/events' },
    ],
    support: [
      { name: '帮助中心', href: '/help' },
      { name: '用户指南', href: '/guide' },
      { name: '技术支持', href: '/support' },
      { name: '反馈建议', href: '/feedback' },
    ],
    legal: [
      { name: '服务条款', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
      { name: '免责声明', href: '/disclaimer' },
      { name: '版权声明', href: '/copyright' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/metatopia' },
    { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/metatopia' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/metatopia' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@metatopia.com' },
  ]

  return (
    <footer className="bg-primary-950 border-t border-neon-500/20">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-500 to-esports-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-gaming font-bold text-gradient">METATOPIA</span>
                <span className="text-xs text-gray-400 -mt-1">MTP</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              AI驱动的GameFi平台，连接全球游戏玩家，创造无限可能的游戏体验。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-neon-500" />
                <span>新加坡科技园区</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-neon-500" />
                <span>+65 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-neon-500" />
                <span>contact@metatopia.com</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-tech font-semibold mb-4">平台功能</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-neon-500 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-tech font-semibold mb-4">社区</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-neon-500 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-tech font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-neon-500 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-tech font-semibold mb-4">法律</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-neon-500 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-neon-500/20">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h3 className="text-white font-tech font-semibold mb-2">订阅我们的资讯</h3>
              <p className="text-gray-400 text-sm">获取最新的游戏资讯和平台更新</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 lg:w-80 px-4 py-2 bg-primary-800 border border-neon-500/30 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-500"
              />
              <button className="btn-primary rounded-l-none">
                订阅
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-neon-500/20 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="text-gray-400 text-sm">
            &copy; {currentYear} METATOPIA (MTP). 保留所有权利。
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-500 hover:bg-primary-700 transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer