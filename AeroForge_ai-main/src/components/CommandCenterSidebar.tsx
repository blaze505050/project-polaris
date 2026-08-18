import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FolderOpen,
  BookOpen,
  Microscope,
  Cpu,
  Database,
  ChevronDown,
  Menu,
  X,
  Settings,
  Wind,
  Layers,
  Rocket,
  Thermometer,
  Wrench,
  Orbit,
  Gauge,
  Workflow,
  Zap,
  Activity,
  FileCode,
  FlaskConical,
  BarChart3,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-4 h-4 text-cyan-400" />,
    path: '/dashboard',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderOpen className="w-4 h-4 text-cyan-400" />,
    path: '/projects',
  },
  {
    id: 'labs',
    label: 'Labs',
    icon: <Microscope className="w-4 h-4 text-cyan-400" />,
    children: [
      {
        id: 'aerodynamics',
        label: 'Aerodynamics',
        icon: <Wind className="w-3.5 h-3.5 text-cyan-400" />,
        path: '/labs/aerodynamics',
      },
      {
        id: 'aerolab',
        label: 'AeroLab Suite',
        icon: <Rocket className="w-3.5 h-3.5 text-pink-400" />,
        path: '/aerolab',
      },
      {
        id: 'structures',
        label: 'Structures & Materials',
        icon: <Layers className="w-3.5 h-3.5 text-amber-400" />,
        path: '/mechlab',
      },
      {
        id: 'thermal',
        label: 'Thermal',
        icon: <Thermometer className="w-3.5 h-3.5 text-red-400" />,
        path: '/astrolab/hypersonic-reentry',
      },
      {
        id: 'space',
        label: 'Space & Orbital',
        icon: <Orbit className="w-3.5 h-3.5 text-purple-400" />,
        path: '/astrolab',
      },
      {
        id: 'controls',
        label: 'Controls & Dynamics',
        icon: <Gauge className="w-3.5 h-3.5 text-blue-400" />,
        path: '/astrolab/astrodynamics-sandbox',
      },
    ],
  },
  {
    id: 'notebook',
    label: 'Notebook',
    icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
    path: '/documentation',
  },
  {
    id: 'results',
    label: 'Results',
    icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
    path: '/projects',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4 text-white/50" />,
    path: '/settings',
  },
];

interface CommandCenterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CommandCenterSidebar({
  isOpen = true,
}: CommandCenterSidebarProps) {
  const location = useLocation();
  const { currentProject } = useProjectStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['labs'])
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path?: string) => {
    if (!path) return false;
    // Exact match or starts-with for nested routes
    if (location.pathname === path) return true;
    // For routes with query params, check the base path
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      return location.pathname === basePath;
    }
    return false;
  };

  const isGroupActive = (item: NavItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isGroupActive(child));
    }
    return false;
  };

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedItems(next);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.path);

    return (
      <div key={item.id} className="w-full">
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all ${
              isExpanded || isGroupActive(item)
                ? 'bg-white/5 text-cyan-400 font-semibold'
                : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/40 transition-transform ${
                isExpanded ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
              active
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-3 mt-1 space-y-0.5 border-l border-white/10 pl-2">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#050914] border-r border-white/10 text-white font-mono">
      {/* Header Title */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          AEROFORGE OS
        </h2>
        <p className="text-[10px] text-white/40 mt-0.5">
          Engineering Workspace
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {MAIN_NAV.map((item) => renderNavItem(item))}
      </div>

      {/* Current Project Context Card */}
      {currentProject && (
        <div className="p-3 border-t border-white/10 bg-[#070D1B]">
          <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">
            ACTIVE PROJECT
          </div>
          <Link
            to={`/projects/${currentProject._id}`}
            className="block bg-[#0A1224] rounded-lg p-2.5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
          >
            <p className="font-semibold text-xs text-white truncate">
              {currentProject.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-white/50">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {currentProject.status.charAt(0).toUpperCase() +
                  currentProject.status.slice(1)}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
        <Link
          to="/settings"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Settings</span>
        </Link>
        <span className="text-[9px] text-white/30">v1.0-BETA</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-12 h-[calc(100vh-3rem)] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 rounded-full bg-cyan-500 text-black shadow-2xl hover:bg-cyan-400 transition-colors"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          className="lg:hidden fixed left-0 top-0 w-64 h-screen z-40 shadow-2xl"
        >
          {sidebarContent}
        </motion.aside>
      )}

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
