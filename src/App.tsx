import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import GameCenter from './pages/GameCenter'
import GameDetail from './pages/GameDetail'
import Esports from './pages/Esports'
import Social from './pages/Social'
import NFTMarket from './pages/NFTMarket'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import Academy from './pages/Academy'
import Login from './pages/Login'
import Register from './pages/Register'
import { WalletProvider } from './contexts/WalletContext'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 公开路由 */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/games" element={<PageTransition><GameCenter /></PageTransition>} />
        <Route path="/games/:id" element={<PageTransition><GameDetail /></PageTransition>} />
        <Route path="/academy" element={<PageTransition><Academy /></PageTransition>} />
        
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

function App() {
  return (
    <AuthProvider>
      <Router>
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
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App