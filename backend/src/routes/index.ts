import { Router } from 'express';
import { healthCheck } from '../middleware/security';

// 导入各个路由模块
import authRoutes from './auth';
import newsRoutes from './news';
import teamRoutes from './team';
import roadmapRoutes from './roadmap';
import contactRoutes from './contact';
import tokensRoutes from './tokens';
import usersRoutes from './users';
import projectsRoutes from './projects';
import investmentsRoutes from './investments';
import transactionsRoutes from './transactions';
import daoRoutes from './dao';
import esportsRoutes from './esports';
import { nftRoutes } from './nft';
import adminRoutes from './admin';

const router = Router();

// 健康检查路由
router.get('/health', healthCheck);

// API路由
router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/team', teamRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/contact', contactRoutes);
router.use('/tokens', tokensRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectsRoutes);
router.use('/investments', investmentsRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/dao', daoRoutes);
router.use('/esports', esportsRoutes);
router.use('/nft', nftRoutes);
router.use('/admin', adminRoutes);

// API根路径信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Metatopia API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      news: '/api/news',
      team: '/api/team',
      roadmap: '/api/roadmap',
      contact: '/api/contact',
      tokens: '/api/tokens',
      users: '/api/users',
      projects: '/api/projects',
      investments: '/api/investments',
      transactions: '/api/transactions',
      dao: '/api/dao',
      esports: '/api/esports',
      nft: '/api/nft',
      admin: '/api/admin',
    },
    documentation: 'https://docs.metatopia.com/api',
  });
});

export default router;
