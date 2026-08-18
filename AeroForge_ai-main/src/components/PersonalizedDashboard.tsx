import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Zap, Target, Clock, Award, ArrowRight, BarChart3 } from 'lucide-react';

interface DashboardStats {
  toolsUsed: number;
  projectsCompleted: number;
  learningProgress: number;
  hoursSpent: number;
}

interface RecentActivity {
  id: string;
  type: 'tool_used' | 'project_completed' | 'learning_milestone';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
}

interface PersonalizedDashboardProps {
  userId?: string;
  userName?: string;
}

export default function PersonalizedDashboard({
  userId = 'user-123',
  userName = 'Engineer',
}: PersonalizedDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    toolsUsed: 5,
    projectsCompleted: 12,
    learningProgress: 65,
    hoursSpent: 48,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'tool_used',
      title: 'CAD Compiler',
      description: 'Completed aerospace wing design',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: Zap,
    },
    {
      id: '2',
      type: 'learning_milestone',
      title: 'Advanced Path Progress',
      description: 'Completed "Optimization Techniques" module',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: Award,
    },
    {
      id: '3',
      type: 'project_completed',
      title: 'Mechanical Assembly',
      description: 'Finished robotic arm design project',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      icon: Target,
    },
  ]);

  const [recommendedTools, setRecommendedTools] = useState([
    {
      id: '1',
      name: 'Simulation Suite',
      category: 'Analysis',
      reason: 'Based on your recent projects',
      match: 92,
    },
    {
      id: '2',
      name: 'Optimization Engine',
      category: 'Design',
      reason: 'Complements your workflow',
      match: 87,
    },
    {
      id: '3',
      name: 'Collaboration Hub',
      category: 'Team',
      reason: 'Popular with users like you',
      match: 78,
    },
  ]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-r from-aerospace-blue/10 to-aerospace-accent/10 border border-aerospace-blue/30 rounded-lg"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
          Welcome back, {userName}!
        </h2>
        <p className="font-paragraph text-foreground/70">
          Continue your engineering journey with personalized recommendations.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Tools Used',
            value: stats.toolsUsed,
            icon: Zap,
            color: 'aerospace-blue',
          },
          {
            label: 'Projects',
            value: stats.projectsCompleted,
            icon: Target,
            color: 'aerospace-accent',
          },
          {
            label: 'Learning Progress',
            value: `${stats.learningProgress}%`,
            icon: BookOpen,
            color: 'aerospace-success',
          },
          {
            label: 'Hours Spent',
            value: stats.hoursSpent,
            icon: Clock,
            color: 'aerospace-warning',
          },
        ].map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-primary border border-secondary/30 rounded-lg hover:border-aerospace-blue/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${stat.color}/15 rounded-lg`}>
                  <StatIcon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="font-heading text-3xl font-bold text-foreground">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-8 bg-primary border border-secondary/30 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-aerospace-blue" />
            <h3 className="font-heading text-xl font-bold text-foreground">
              Recent Activity
            </h3>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, idx) => {
              const ActivityIcon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:border-aerospace-blue/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors shrink-0">
                      <ActivityIcon className="w-5 h-5 text-aerospace-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-foreground group-hover:text-aerospace-blue transition-colors">
                        {activity.title}
                      </p>
                      <p className="font-paragraph text-sm text-foreground/70 mt-1">
                        {activity.description}
                      </p>
                      <p className="font-mono text-xs text-foreground/50 mt-2">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-aerospace-blue transition-colors shrink-0 mt-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommended Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-primary border border-secondary/30 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-aerospace-blue" />
            <h3 className="font-heading text-xl font-bold text-foreground">
              Recommended
            </h3>
          </div>

          <div className="space-y-4">
            {recommendedTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:border-aerospace-blue/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-heading font-bold text-foreground group-hover:text-aerospace-blue transition-colors">
                      {tool.name}
                    </p>
                    <p className="font-mono text-xs text-aerospace-blue uppercase tracking-wider mt-1">
                      {tool.category}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-aerospace-success">
                    {tool.match}%
                  </span>
                </div>
                <p className="font-paragraph text-xs text-foreground/70">
                  {tool.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Learning Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-8 bg-primary border border-secondary/30 rounded-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-aerospace-blue" />
            <h3 className="font-heading text-xl font-bold text-foreground">
              Learning Paths Progress
            </h3>
          </div>
          <span className="font-mono text-sm text-aerospace-blue font-bold">
            {stats.learningProgress}%
          </span>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Beginner Path', progress: 100 },
            { name: 'Intermediate Path', progress: 65 },
            { name: 'Expert Path', progress: 20 },
          ].map((path, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-paragraph text-sm text-foreground">{path.name}</p>
                <p className="font-mono text-xs text-foreground/60">{path.progress}%</p>
              </div>
              <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${path.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
