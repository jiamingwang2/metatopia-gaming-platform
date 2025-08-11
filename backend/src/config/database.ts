import { createClient } from '@supabase/supabase-js';
import { config } from './index';

// 创建Supabase客户端实例
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// 创建具有服务角色权限的客户端（用于管理操作）
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

// 数据库表名常量
export const TABLES = {
  NEWS: 'news_articles',
  NEWS_CATEGORIES: 'news_categories',
  NEWS_TAGS: 'news_tags',
  TEAM_MEMBERS: 'team_members',
  ROADMAP_ITEMS: 'roadmap_items',
  CONTACT_SUBMISSIONS: 'contact_submissions',
} as const;

// 数据库连接测试
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.NEWS_CATEGORIES)
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default supabase
