import { supabase } from '../lib/supabase';

// 交易接口定义
export interface Transaction {
  id: string;
  user_id: string;
  project_id: string;
  type: 'investment' | 'withdrawal' | 'transfer' | 'reward';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

// 安全警报接口定义
export interface Alert {
  id: string;
  type: 'suspicious_activity' | 'large_transaction' | 'failed_kyc' | 'multiple_attempts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id?: string;
  transaction_id?: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  transaction?: {
    id: string;
    amount: number;
    currency: string;
  };
}

// 交易统计接口定义
export interface TransactionStats {
  total_transactions: number;
  total_volume: number;
  pending_transactions: number;
  failed_transactions: number;
  high_risk_transactions: number;
  active_alerts: number;
}

// 获取交易列表
export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  risk_level?: string;
  user_id?: string;
  project_id?: string;
}) => {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        user:users(id, email, full_name),
        project:projects(id, title)
      `);

    // 应用过滤条件
    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.type) {
      query = query.eq('type', params.type);
    }
    if (params?.risk_level) {
      query = query.eq('risk_level', params.risk_level);
    }
    if (params?.user_id) {
      query = query.eq('user_id', params.user_id);
    }
    if (params?.project_id) {
      query = query.eq('project_id', params.project_id);
    }

    // 分页
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data as Transaction[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error('获取交易列表失败:', error);
    throw error;
  }
};

// 获取交易统计数据
export const getTransactionStats = async () => {
  try {
    // 获取总交易数
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // 获取总交易量
    const { data: volumeData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed');

    const totalVolume = volumeData?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // 获取待处理交易数
    const { count: pendingTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 获取失败交易数
    const { count: failedTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    // 获取高风险交易数
    const { count: highRiskTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('risk_level', 'high');

    // 获取活跃警报数
    const { count: activeAlerts } = await supabase
      .from('security_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return {
      success: true,
      data: {
        total_transactions: totalTransactions || 0,
        total_volume: totalVolume,
        pending_transactions: pendingTransactions || 0,
        failed_transactions: failedTransactions || 0,
        high_risk_transactions: highRiskTransactions || 0,
        active_alerts: activeAlerts || 0,
      } as TransactionStats,
    };
  } catch (error) {
    console.error('获取交易统计失败:', error);
    throw error;
  }
};

// 获取单个交易详情
export const getTransactionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        user:users(id, email, full_name),
        project:projects(id, title)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Transaction,
    };
  } catch (error) {
    console.error('获取交易详情失败:', error);
    throw error;
  }
};

// 更新交易状态
export const updateTransactionStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Transaction,
    };
  } catch (error) {
    console.error('更新交易状态失败:', error);
    throw error;
  }
};

// 获取安全警报列表
export const getAlerts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  severity?: string;
}) => {
  try {
    let query = supabase
      .from('security_alerts')
      .select(`
        *,
        user:users(id, email, full_name),
        transaction:transactions(id, amount, currency)
      `);

    // 应用过滤条件
    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.type) {
      query = query.eq('type', params.type);
    }
    if (params?.severity) {
      query = query.eq('severity', params.severity);
    }

    // 分页
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data as Alert[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error('获取安全警报失败:', error);
    throw error;
  }
};

// 更新警报状态
export const updateAlertStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Alert,
    };
  } catch (error) {
    console.error('更新警报状态失败:', error);
    throw error;
  }
};