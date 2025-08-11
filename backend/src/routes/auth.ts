import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth routes
router.use(rateLimiter);

// Authentication routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Password reset routes (if needed in the future)
// router.post('/forgot-password', UserController.forgotPassword);
// router.post('/reset-password', UserController.resetPassword);

export default router;
