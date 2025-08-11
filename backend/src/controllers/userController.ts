import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(50).optional(),
  display_name: z.string().max(100).optional(),
  user_type: z.enum(['player', 'esports_player', 'developer', 'investor', 'community']).default('player')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  display_name: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  avatar_url: z.string().url().optional(),
  user_type: z.enum(['player', 'esports_player', 'developer', 'investor', 'community']).optional()
});

const connectWalletSchema = z.object({
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
});

export class UserController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, password, username, display_name, user_type } = validatedData;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Check username uniqueness if provided
      if (username) {
        const { data: existingUsername } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .single();

        if (existingUsername) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          username: username || null,
          display_name: display_name || null,
          user_type,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id, email, username, display_name, user_type, created_at')
        .single();

      if (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues
        });
      }

      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, password_hash, username, display_name, user_type, is_active')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues
        });
      }

      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select(`
          id, email, username, display_name, avatar_url, bio, user_type,
          kyc_level, total_investment, total_earnings, reputation_score,
          is_active, last_login_at, created_at, updated_at
        `)
        .eq('id', userId)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const validatedData = updateProfileSchema.parse(req.body);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Check username uniqueness if being updated
      if (validatedData.username) {
        const { data: existingUsername } = await supabase
          .from('users')
          .select('id')
          .eq('username', validatedData.username)
          .neq('id', userId)
          .single();

        if (existingUsername) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id, email, username, display_name, avatar_url, bio, user_type,
          kyc_level, total_investment, total_earnings, reputation_score,
          is_active, last_login_at, created_at, updated_at
        `)
        .single();

      if (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile'
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues
        });
      }

      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Connect wallet address
  static async connectWallet(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const validatedData = connectWalletSchema.parse(req.body);
      const { wallet_address } = validatedData;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Check if wallet address is already connected to another user
      const { data: existingWallet } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet_address)
        .neq('id', userId)
        .single();

      if (existingWallet) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address already connected to another account'
        });
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          wallet_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, username, wallet_address')
        .single();

      if (error) {
        console.error('Connect wallet error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to connect wallet'
        });
      }

      return res.json({
        success: true,
        message: 'Wallet connected successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues
        });
      }

      console.error('Connect wallet error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user achievements
  static async getAchievements(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { data: achievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Get achievements error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch achievements'
        });
      }

      return res.json({
        success: true,
        data: { achievements }
      });
    } catch (error) {
      console.error('Get achievements error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user statistics
  static async getStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Get user basic stats
      const { data: user } = await supabase
        .from('users')
        .select('total_investment, total_earnings, reputation_score')
        .eq('id', userId)
        .single();

      // Get investment count
      const { count: investmentCount } = await supabase
        .from('investments')
        .select('*', { count: 'exact', head: true })
        .eq('investor_id', userId);

      // Get transaction count
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get achievement count
      const { count: achievementCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get NFT count
      const { count: nftCount } = await supabase
        .from('nft_assets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);

      return res.json({
        success: true,
        data: {
          stats: {
            total_investment: user?.total_investment || 0,
            total_earnings: user?.total_earnings || 0,
            reputation_score: user?.reputation_score || 0,
            investment_count: investmentCount || 0,
            transaction_count: transactionCount || 0,
            achievement_count: achievementCount || 0,
            nft_count: nftCount || 0
          }
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
