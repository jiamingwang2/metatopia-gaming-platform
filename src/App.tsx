import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorProvider } from './contexts/ErrorContext'
import { LoadingProvider, useGlobalLoading } from './contexts/LoadingContext'
import ErrorBoundary from './components/ErrorBoundary'
import { LoadingOverlay } from './components/ui/LoadingOverlay'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import { logApiConfig, isDebugMode } from './config/api'
import { getNetworkDiagnostics } from './utils/networkUtils'
import Home from './pages/Home'
import GameCenter from './pages/GameCenter'
import GameDetail from './pages/GameDetail'
import Esports from './pages/Esports'
import Social from './pages/Social'
import NFTMarket from './pages/NFTMarket'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import Academy from './pages/Academy'
import Projects from './pages/Projects'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminRoutes from './pages/admin/AdminRoutes'
import { WalletProvider } from './contexts/WalletContext'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 管理员路由 - 独立的路由系统 */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* 公开路由 */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/games" element={<PageTransition><GameCenter /></PageTransition>} />
        <Route path="/games/:id" element={<PageTransition><GameDetail /></PageTransition>} />
        <Route path="/academy" element={<PageTransition><Academy /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        
        {/* 认证路由 */}
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        } />
        
        {/* 需要登录的路由 */}
        <Route path="/esports" element={
          <ProtectedRoute>
            <PageTransition><Esports /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/social" element={
          <ProtectedRoute>
            <PageTransition><Social /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/nft" element={
          <ProtectedRoute>
            <PageTransition><NFTMarket /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <WalletProvider>
              <PageTransition><Wallet /></PageTransition>
            </WalletProvider>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const isGlobalLoading = useGlobalLoading()
  
  // 初始化网络诊断
  useEffect(() => {
    // 记录API配置
    logApiConfig();
    
    // 在调试模式下进行网络诊断
    if (isDebugMode()) {
      getNetworkDiagnostics().then(diagnostics => {
        console.log('🔍 网络诊断结果:', diagnostics);
        
        if (!diagnostics.apiConnectivity.success) {
          console.warn('⚠️ API连接异常:', diagnostics.apiConnectivity.message);
          console.log('📋 诊断详情:', diagnostics.apiConnectivity.details);
        }
      }).catch(error => {
        console.error('❌ 网络诊断失败:', error);
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <Header />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
      <Toast />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      {/* 全局加载覆盖层 */}
      <LoadingOverlay
        isVisible={isGlobalLoading}
        message="加载中..."
        size="lg"
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <LoadingProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </LoadingProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
