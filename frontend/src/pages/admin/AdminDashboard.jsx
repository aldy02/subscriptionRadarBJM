import { useState, useEffect } from "react";
import { getAllTransactions } from "../../api/transactionApi";
import { getActiveSubscriptions } from "../../api/subscriptionPlanApi";
import { getUsers } from "../../api/userApi";
import { getAllAdvertisementContents } from "../../api/advertisementApi";
import {
  BarChart3,
  Users,
  UserCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Megaphone,
  Crown,
  TrendingUp,
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalTransactions: 0,
    acceptedTransactions: 0,
    rejectedTransactions: 0,
    pendingTransactions: 0,
    advertisementPurchases: 0,
    subscriptionPurchases: 0,
    totalUsers: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
    dailyRevenue: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [transactionsResponse, usersResponse, advertisementsResponse] = await Promise.all([
          getAllTransactions().catch(err => {
            return { data: [] };
          }),
          getUsers(1, 10000).catch(err => {
            return { data: [] };
          }),
          getAllAdvertisementContents().catch(err => {
            return { data: [] };
          })
        ]);

        let activeSubscriptions = [];
        try {
          const subsResponse = await getActiveSubscriptions();
          activeSubscriptions = subsResponse?.data?.data || [];
        } catch (err) {
          console.log('Could not fetch active subscriptions, will calculate from transactions');
        }

        const transactions = transactionsResponse?.data || [];
        const users = usersResponse?.data?.data || usersResponse?.data || [];
        const advertisements = advertisementsResponse?.data || [];

        console.log('Processed data:', {
          transactionsLength: transactions.length,
          usersLength: users.length,
          advertisementsLength: advertisements.length
        });

        // Calculate transaction statistics
        const totalTransactions = transactions.length;
        const acceptedTransactions = transactions.filter(t => t.status === 'accepted').length;
        const rejectedTransactions = transactions.filter(t => t.status === 'rejected').length;
        const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

        // Calculate advertisement and subscription purchases
        const advertisementPurchases = transactions.filter(t => t.type === 'advertisement').length;
        const subscriptionPurchases = transactions.filter(t => t.type === 'subscription').length;

        // Calculate user statistics
        const totalUsers = users.length;

        // Calculate subscribers
        let totalSubscribers = 0;
        if (activeSubscriptions.length > 0) {
          totalSubscribers = [...new Set(activeSubscriptions.map(sub => sub.user_id))].length;
        } else {
          const subscriberTransactions = transactions.filter(t =>
            t.type === 'subscription' && t.status === 'accepted'
          );
          totalSubscribers = [...new Set(subscriberTransactions.map(t => t.user_id))].length;
        }

        // Calculate total revenue from accepted transactions
        const totalRevenue = transactions
          .filter(t => t.status === 'accepted')
          .reduce((sum, t) => {
            const amount = parseFloat(t.total_price || 0);
            return sum + amount;
          }, 0);

        // Calculate daily revenue for chart
        const dailyRevenueMap = new Map();
        const acceptedTransactionsList = transactions.filter(t => t.status === 'accepted');

        // Initialize last 7 days with 0 revenue
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          dailyRevenueMap.set(dateStr, { date: dateStr, revenue: 0, transactions: 0 });
        }

        acceptedTransactionsList.forEach(transaction => {
          const transactionDate = new Date(transaction.created_at).toISOString().split('T')[0];
          if (dailyRevenueMap.has(transactionDate)) {
            const existing = dailyRevenueMap.get(transactionDate);
            existing.revenue += parseFloat(transaction.total_price || 0);
            existing.transactions += 1;
          }
        });

        const dailyRevenue = Array.from(dailyRevenueMap.values()).map(item => ({
          ...item,
          formattedDate: new Date(item.date).toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric'
          })
        }));

        setDashboardData({
          totalTransactions,
          acceptedTransactions,
          rejectedTransactions,
          pendingTransactions,
          advertisementPurchases,
          subscriptionPurchases,
          totalUsers,
          totalSubscribers,
          totalRevenue,
          dailyRevenue
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Gagal memuat data dashboard. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency to IDR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const MetricCard = ({ title, value, icon: Icon, trend, subtitle, gradient }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const StatusCard = ({ title, value, percentage, color, icon: Icon }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 text-${color}-500`} />
        <span className={`text-sm font-semibold text-${color}-600`}>{percentage}%</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const totalTransactions = dashboardData.totalTransactions || 1;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Monitor performa platform Anda secara real-time</p>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Revenue Harian</h3>
              <p className="text-gray-600">7 hari terakhir</p>
            </div>
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-green-700">
                {formatCurrency(dashboardData.totalRevenue)}
              </span>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.dailyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight={500}
                  tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Transaksi"
            value={formatNumber(dashboardData.totalTransactions)}
            icon={CreditCard}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />

          <MetricCard
            title="Total User"
            value={formatNumber(dashboardData.totalUsers)}
            icon={Users}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />

          <MetricCard
            title="Total Subscriber"
            value={formatNumber(dashboardData.totalSubscribers)}
            icon={Crown}
            subtitle={`${((dashboardData.totalSubscribers / (dashboardData.totalUsers || 1)) * 100).toFixed(1)}% dari total user`}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          />

          <MetricCard
            title="Total Revenue"
            value={formatCurrency(dashboardData.totalRevenue)}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Transaction Status */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              Status Transaksi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatusCard
                title="Diterima"
                value={formatNumber(dashboardData.acceptedTransactions)}
                percentage={((dashboardData.acceptedTransactions / totalTransactions) * 100).toFixed(1)}
                color="green"
                icon={CheckCircle}
              />
              <StatusCard
                title="Pending"
                value={formatNumber(dashboardData.pendingTransactions)}
                percentage={((dashboardData.pendingTransactions / totalTransactions) * 100).toFixed(1)}
                color="yellow"
                icon={Clock}
              />
              <StatusCard
                title="Ditolak"
                value={formatNumber(dashboardData.rejectedTransactions)}
                percentage={((dashboardData.rejectedTransactions / totalTransactions) * 100).toFixed(1)}
                color="red"
                icon={XCircle}
              />
            </div>
          </div>

          {/* Purchase Types */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              Tipe Pembelian
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-4">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Subscription</p>
                    <p className="text-sm text-gray-500">Paket berlangganan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.subscriptionPurchases)}</p>
                  <p className="text-sm text-indigo-600">
                    {((dashboardData.subscriptionPurchases / totalTransactions) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg mr-4">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Advertisement</p>
                    <p className="text-sm text-gray-500">Paket iklan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.advertisementPurchases)}</p>
                  <p className="text-sm text-pink-600">
                    {((dashboardData.advertisementPurchases / totalTransactions) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}