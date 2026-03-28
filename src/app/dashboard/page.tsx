// app/dashboard/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Book, GraduationCap, Users, Clock, FileText, BarChart2, AlertCircle, CheckCircle } from 'lucide-react';

// Custom Card Component
const InstitutionCard = ({ 
  title,
  value,
  icon,
  trend,
  className = ''
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}) => {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
    down: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30',
    neutral: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${trendColors[trend]}`}>
          {icon}
        </div>
      </div>
      {trend !== 'neutral' && (
        <div className={`mt-4 flex items-center text-sm ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>5.2% {trend === 'up' ? 'increase' : 'decrease'} from last month</span>
        </div>
      )}
    </motion.div>
  );
};

// Status Indicator Component
const StatusPill = ({ status }: { status: 'alert' | 'success' | 'pending' }) => {
  const config = {
    alert: {
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
      icon: <AlertCircle className="h-4 w-4 mr-2" />
    },
    success: {
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      icon: <CheckCircle className="h-4 w-4 mr-2" />
    },
    pending: {
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      icon: <Clock className="h-4 w-4 mr-2" />
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config[status].color}`}>
      {config[status].icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function InstitutionDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      icon: <Users className="h-5 w-5" />,
      trend: 'up' as const
    },
    {
      title: "Active Courses",
      value: "24",
      icon: <Book className="h-5 w-5" />,
      trend: 'neutral' as const
    },
    {
      title: "Graduation Rate",
      value: "92%",
      icon: <GraduationCap className="h-5 w-5" />,
      trend: 'up' as const
    },
    {
      title: "Pending Approvals",
      value: "17",
      icon: <FileText className="h-5 w-5" />,
      trend: 'down' as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New student applications received",
      time: "10 minutes ago",
      status: 'pending' as const
    },
    {
      id: 2,
      title: "Course curriculum updated",
      time: "2 hours ago",
      status: 'success' as const
    },
    {
      id: 3,
      title: "System maintenance scheduled",
      time: "Yesterday",
      status: 'alert' as const
    },
    {
      id: 4,
      title: "Faculty meeting completed",
      time: "2 days ago",
      status: 'success' as const
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Institution Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of academic performance and operations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <InstitutionCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Academic Performance
              </h2>
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800">
                <option>This Semester</option>
                <option>Last Semester</option>
                <option>This Academic Year</option>
              </select>
            </div>
            <div className="h-80 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800 rounded-lg flex items-center justify-center">
              <BarChart2 className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <StatusPill status={activity.status} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Simple arrow components (add these to your file)
const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v8a1 1 0 01-2 0V8H5a1 1 0 010-2h6a1 1 0 011 1z" clipRule="evenodd" />
  </svg>
);

const ArrowDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H9v-8a1 1 0 012 0v8h2a1 1 0 010 2h-6a1 1 0 010-2h2z" clipRule="evenodd" />
  </svg>
);