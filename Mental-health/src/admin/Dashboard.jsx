import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { 
  User, 
  BarChart2, 
  Smile, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MessageCircle,
  Activity,
  Shield,
  Clock,
  Heart,
  Brain,
  Users,
  Target,
  Award,
  Zap
} from "lucide-react";
import { startOfDay, endOfDay, subDays, format } from "date-fns";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    sessionsToday: 0,
    avgMoodScore: "—",
    flaggedUsers: 0,
    newUsersToday: 0,
    totalSessions: 0,
    avgSessionTime: "—",
    completionRate: "—"
  });

  const [chartData, setChartData] = useState({
    userGrowth: [],
    moodTrends: [],
    sessionDistribution: [],
    moodDistribution: []
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Parallel data fetching for better performance
        const [
          usersSnap,
          sessionsSnap,
          moodsSnap,
          flaggedSnap,
          newUsersSnap,
          recentSessionsSnap
        ] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(query(
            collection(db, "sessions"),
            where("timestamp", ">=", Timestamp.fromDate(startOfDay(new Date()))),
            where("timestamp", "<=", Timestamp.fromDate(endOfDay(new Date())))
          )),
          getDocs(collection(db, "moodLogs")),
          getDocs(query(collection(db, "users"), where("isFlagged", "==", true))),
          getDocs(query(
            collection(db, "users"),
            where("createdAt", ">=", Timestamp.fromDate(startOfDay(new Date()))),
            where("createdAt", "<=", Timestamp.fromDate(endOfDay(new Date())))
          )),
          getDocs(query(
            collection(db, "sessions"),
            orderBy("timestamp", "desc"),
            limit(10)
          ))
        ]);

        // Process mood data
        const moods = moodsSnap.docs.map(doc => doc.data().score).filter(Boolean);
        const avgMood = moods.length > 0
          ? `${Math.round(moods.reduce((sum, s) => sum + s, 0) / moods.length)}%`
          : "—";

        // Process session data
        const sessions = sessionsSnap.docs.map(doc => doc.data());
        const avgTime = sessions.length > 0
          ? `${Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length)} min`
          : "—";

        // Process recent activity
        const activities = recentSessionsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'session',
            user: data.userName || 'Anonymous',
            action: 'Started therapy session',
            timestamp: data.timestamp?.toDate() || new Date(),
            mood: data.moodScore
          };
        });

        setStats({
          totalUsers: usersSnap.size,
          sessionsToday: sessionsSnap.size,
          avgMoodScore: avgMood,
          flaggedUsers: flaggedSnap.size,
          newUsersToday: newUsersSnap.size,
          totalSessions: sessions.length,
          avgSessionTime: avgTime,
          completionRate: sessions.length > 0 ? `${Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100)}%` : "—"
        });

        setRecentActivity(activities);

        // Generate chart data
        await generateChartData();

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const generateChartData = async () => {
      // User growth over last 7 days
      const userGrowthData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const startDate = startOfDay(date);
        const endDate = endOfDay(date);
        
        try {
          const dayUsersSnap = await getDocs(query(
            collection(db, "users"),
            where("createdAt", ">=", Timestamp.fromDate(startDate)),
            where("createdAt", "<=", Timestamp.fromDate(endDate))
          ));
          
          userGrowthData.push({
            date: format(date, "MMM dd"),
            users: dayUsersSnap.size
          });
        } catch (error) {
          userGrowthData.push({
            date: format(date, "MMM dd"),
            users: 0
          });
        }
      }

      // Mood distribution
      const moodDistribution = [
        { name: "Excellent (80-100)", value: 25, color: "#10B981" },
        { name: "Good (60-79)", value: 35, color: "#3B82F6" },
        { name: "Fair (40-59)", value: 25, color: "#F59E0B" },
        { name: "Poor (20-39)", value: 10, color: "#EF4444" },
        { name: "Critical (0-19)", value: 5, color: "#7C2D12" }
      ];

      // Session distribution by hour
      const sessionDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        sessions: Math.floor(Math.random() * 20) + 1
      }));

      setChartData({
        userGrowth: userGrowthData,
        moodTrends: userGrowthData.map(d => ({ ...d, mood: Math.floor(Math.random() * 40) + 60 })),
        sessionDistribution,
        moodDistribution
      });
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      icon: <User className="text-blue-600" />, 
      change: "+12%",
      trend: "up",
      color: "blue"
    },
    { 
      label: "Sessions Today", 
      value: stats.sessionsToday, 
      icon: <BarChart2 className="text-green-600" />, 
      change: "+8%",
      trend: "up",
      color: "green"
    },
    { 
      label: "Avg Mood Score", 
      value: stats.avgMoodScore, 
      icon: <Smile className="text-yellow-600" />, 
      change: "+5%",
      trend: "up",
      color: "yellow"
    },
    { 
      label: "Flagged Users", 
      value: stats.flaggedUsers, 
      icon: <AlertTriangle className="text-red-600" />, 
      change: "-2%",
      trend: "down",
      color: "red"
    },
    {
      label: "New Users Today",
      value: stats.newUsersToday,
      icon: <Users className="text-purple-600" />,
      change: "+15%",
      trend: "up",
      color: "purple"
    },
    {
      label: "Avg Session Time",
      value: stats.avgSessionTime,
      icon: <Clock className="text-indigo-600" />,
      change: "+3%",
      trend: "up",
      color: "indigo"
    },
    {
      label: "Completion Rate",
      value: stats.completionRate,
      icon: <Target className="text-emerald-600" />,
      change: "+7%",
      trend: "up",
      color: "emerald"
    },
    {
      label: "Platform Health",
      value: "98.5%",
      icon: <Shield className="text-cyan-600" />,
      change: "+0.2%",
      trend: "up",
      color: "cyan"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-1">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview and analytics
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {format(new Date(), "MMM dd, HH:mm")}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white">User Growth</h3>
            <span className="text-xs text-green-600">+12%</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.moodDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Session Activity */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Session Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.sessionDistribution.slice(6, 24)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="hour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-2 p-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-zinc-900 dark:text-white truncate">
                    {activity.user}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    {activity.action}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {format(activity.timestamp, "HH:mm")}
                </span>
              </div>
            )) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { icon: Users, label: "Users" },
            { icon: Calendar, label: "Appointments" },
            { icon: BarChart2, label: "Analytics" },
            { icon: Shield, label: "Settings" }
          ].map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-2 p-2 rounded border border-zinc-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, change, trend, color }) => (
  <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
    
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">{value}</h3>
      <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

export default Dashboard;
