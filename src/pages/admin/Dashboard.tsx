import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GamepadIcon, 
  TrendingUp, 
  Activity, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  totalTransactions: number;
  monthlyRevenue: number;
  activeUsers: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalInvestments: 0,
    totalTransactions: 0,
    monthlyRevenue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // 模拟数据
  const monthlyData = [
    { month: '1月', users: 120, revenue: 45000, transactions: 89 },
    { month: '2月', users: 180, revenue: 67000, transactions: 134 },
    { month: '3月', users: 250, revenue: 89000, transactions: 198 },
    { month: '4月', users: 320, revenue: 112000, transactions: 267 },
    { month: '5月', users: 410, revenue: 145000, transactions: 345 },
    { month: '6月', users: 520, revenue: 178000, transactions: 423 }
  ];

  const projectTypeData = [
    { name: 'RPG游戏', value: 35, color: '#3B82F6' },
    { name: '策略游戏', value: 25, color: '#10B981' },
    { name: 'NFT项目', value: 20, color: '#F59E0B' },
    { name: '元宇宙', value: 15, color: '#EF4444' },
    { name: '其他', value: 5, color: '#8B5CF6' }
  ];

  useEffect(() => {
    // 模拟API调用
    const fetchStats = async () => {
      setLoading(true);
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1247,
        totalProjects: 89,
        totalInvestments: 156,
        totalTransactions: 2341,
        monthlyRevenue: 178000,
        activeUsers: 892
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              value
            )}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据仪表板</h1>
          <p className="text-gray-600 mt-1">平台运营数据总览</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          最后更新：{new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总用户数"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={24} className="text-white" />}
          trend={12.5}
          color="bg-blue-500"
        />
        <StatCard
          title="项目总数"
          value={stats.totalProjects}
          icon={<GamepadIcon size={24} className="text-white" />}
          trend={8.2}
          color="bg-green-500"
        />
        <StatCard
          title="投资总额"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={<TrendingUp size={24} className="text-white" />}
          trend={15.3}
          color="bg-yellow-500"
        />
        <StatCard
          title="活跃用户"
          value={stats.activeUsers.toLocaleString()}
          icon={<Activity size={24} className="text-white" />}
          trend={-2.1}
          color="bg-purple-500"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度趋势图 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">月度增长趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="新增用户"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 项目类型分布 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">项目类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {projectTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '占比']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {projectTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 收入统计 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">月度收入统计</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, '收入']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="月度收入"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;