import React from 'react'
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

const MainDashboard = () => {
      // Sample data for dashboard cards
  const dashboardStats = [
    {
      title: 'Total Revenue',
      value: '$2,847,392',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: '14,892',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Inventory Items',
      value: '3,247',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Projects',
      value: '127',
      change: '+15.8%',
      trend: 'up',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago', type: 'order' },
    { id: 2, action: 'Invoice generated', user: 'Sarah Wilson', time: '5 min ago', type: 'invoice' },
    { id: 3, action: 'Project milestone reached', user: 'Mike Johnson', time: '12 min ago', type: 'project' },
    { id: 4, action: 'New user registered', user: 'Emily Davis', time: '1 hour ago', type: 'user' },
    { id: 5, action: 'Payment received', user: 'Robert Chen', time: '2 hours ago', type: 'payment' }
  ];

  const quickActions = [
    { title: 'Create Invoice', icon: Plus, color: 'bg-blue-500', href: '/invoices/new' },
    { title: 'Add User', icon: Users, color: 'bg-green-500', href: '/users/new' },
    { title: 'New Project', icon: BarChart3, color: 'bg-purple-500', href: '/projects/new' },
    { title: 'View Reports', icon: TrendingUp, color: 'bg-orange-500', href: '/reports' }
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Dashboard Overview</h2>
            <p className="text-slate-600">Monitor your business performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 group hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="size-6 text-white" />
                </div>
                <div className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                </div>
                </div>
                <h3 className="text-slate-600 text-sm font-medium mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Quick Actions</h3>
                <MoreHorizontal className="size-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                {quickActions.map((action, index) => (
                    <NavLink
                    key={index}
                    to={action.href}
                    className="flex items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 group"
                    >
                    <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                        <action.icon className="size-5 text-white" />
                    </div>
                    <span className="font-medium text-slate-900 group-hover:text-slate-700">{action.title}</span>
                    <ArrowUpRight className="size-4 text-slate-400 ml-auto group-hover:text-slate-600" />
                    </NavLink>
                ))}
                </div>
            </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Recent Activities</h3>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                    <Search className="size-4 text-slate-600" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                    <Filter className="size-4 text-slate-600" />
                    </button>
                </div>
                </div>
                <div className="space-y-4">
                {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                        {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-600">by {activity.user}</p>
                    </div>
                    <span className="text-sm text-slate-500">{activity.time}</span>
                    </div>
                ))}
                </div>
                <div className="mt-6 text-center">
                <NavLink
                    to="/activities"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All Activities
                    <ArrowUpRight className="ml-1 size-4" />
                </NavLink>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default MainDashboard
