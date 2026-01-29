'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  Library,
  MessageSquare,
  Activity,
  BarChart3,
  Database,
  ChevronLeft,
  LogOut,
  User as UserIcon
} from 'lucide-react';

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onSignOut?: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export default function Sidebar({ user, onSignOut, isMobileMenuOpen = false, onMobileMenuClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      <aside
        className={`fixed lg:relative h-screen bg-zinc-950 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'w-72'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* 1. Header & Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center ring-1 ring-white/20 shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              <h1 className="font-serif font-bold text-lg tracking-tight text-white">KORTEX</h1>
            </div>
          </div>

          {/* Collapse Toggle - Hidden on Mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:block absolute -right-3 top-6 p-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all z-50 ${isCollapsed ? 'rotate-180' : ''
              }`}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>

        {/* 2. Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">

          {/* Group: Primary Operations */}
          <div className="space-y-2">
            {!isCollapsed && (
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">
                Main Operations
              </p>
            )}
            <NavItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Overview"
              href="/dashboard"
              isActive={pathname === '/dashboard'}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<Library className="w-5 h-5" />}
              label="Knowledge Base"
              href="/dashboard/subjects"
              isActive={pathname.includes('/subjects')}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="Study Sessions"
              href="/dashboard/chats"
              isActive={pathname.includes('/chats')}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Group: System Intelligence */}
          <div className="space-y-2">
            {!isCollapsed && (
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">
                System Intelligence
              </p>
            )}
            <NavItem
              icon={<Activity className="w-5 h-5" />}
              label="Activity Log"
              href="/dashboard/activity"
              isActive={pathname === '/dashboard/activity'}
              isCollapsed={isCollapsed}
              badge={!isCollapsed ? "12ms" : undefined}
            />
            <NavItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Performance"
              href="/dashboard/performance"
              isActive={pathname === '/dashboard/performance'}
              isCollapsed={isCollapsed}
            />
          </div>

        </div>

        {/* 3. Footer: Storage & User */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/30">

          {/* Storage Widget */}
          <div className={`mb-6 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400 font-medium flex items-center gap-2 group cursor-help" title="Storage used for document embeddings">
                <Database className="w-3 h-3 text-purple-400" />
                Vector Index
              </span>
              <span className="text-zinc-500">45%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-[45%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
            </div>
            <p className="mt-2 text-[10px] text-zinc-600 font-mono text-center">
              12.4 MB / 100 MB Used
            </p>
          </div>

          {/* User Profile */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative group cursor-pointer">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-lg ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                </div>
              )}

              {/* Online Status Dot */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-zinc-950 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-500 truncate">Free Plan</p>
                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group"
                      title="Sign out"
                    >
                      <LogOut className="w-3 h-3 text-zinc-500 group-hover:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// --- Sub Component: Nav Item ---

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  badge?: string;
}

function NavItem({ icon, label, href, isActive, isCollapsed, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
        ? 'bg-purple-500/10 text-purple-300'
        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
        } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {/* Active Indicator Line (Left) */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
      )}

      {/* Icon */}
      <span className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>

      {/* Label (Collapsed: Hidden) */}
      {!isCollapsed && (
        <span className="font-medium text-sm flex-1 truncate">
          {label}
        </span>
      )}

      {/* Badge (Collapsed: Hidden) */}
      {!isCollapsed && badge && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-400">
          {badge}
        </span>
      )}

      {/* Tooltip for Collapsed Mode */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
          {label}
        </div>
      )}
    </Link>
  );
}