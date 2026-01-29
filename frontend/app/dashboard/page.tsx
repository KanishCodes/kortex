// Dashboard - Mission Control Center Design
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  MessageSquare,
  FileText,
  Database,
  MoreVertical,
  Clock,
  Upload,
  Search,
  Library,
  Pencil,
  Trash2,
  Menu
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import NewSubjectModal from '@/components/NewSubjectModal';
import RenameSubjectModal from '@/components/RenameSubjectModal';
import { Subject, DashboardStats, ActivityLog } from '@/lib/api';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const { userId, user, isLoading: isAuthLoading, isUnauthenticated } = useAuth();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ subjects: 0, documents: 0, queries: 0 });
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subject menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [subjectToRename, setSubjectToRename] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Gradient colors for subjects
  const subjectGradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-orange-500',
  ];

  useEffect(() => {
    if (isUnauthenticated) {
      router.push('/login');
    }
  }, [isUnauthenticated, router]);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadDashboardData() {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Load Subjects (Critical)
      try {
        const subjectsData = await api.getSubjects(userId);
        setSubjects(subjectsData);
      } catch (err: any) {
        console.error('Failed to load subjects:', err);
        setError('Failed to load subjects');
      }

      // 2. Load Stats & Activity (Non-critical)
      // We run these in parallel but independently from subjects
      Promise.allSettled([
        api.getDashboardStats(userId),
        api.getRecentActivity(userId)
      ]).then((results) => {
        const [statsResult, activityResult] = results;

        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value);
        } else {
          console.error('Failed to load stats:', statsResult.reason);
        }

        if (activityResult.status === 'fulfilled') {
          setActivities(activityResult.value);
        } else {
          console.error('Failed to load activity:', activityResult.reason);
        }
      });

    } catch (err: any) {
      // Catch-all for unexpected errors
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSubject(name: string) {
    if (!userId) throw new Error('Not authenticated');

    try {
      const newSubject = await api.createSubject(userId, name);
      setSubjects([newSubject, ...subjects]);
      // Optimistic update for stats
      setStats(prev => ({ ...prev, subjects: prev.subjects + 1 }));
      setIsNewSubjectModalOpen(false);
      // Reload activity to show "Created Subject" log
      api.getRecentActivity(userId).then(setActivities);
    } catch (err: any) {
      console.error('Failed to create subject:', err);
      throw err;
    }
  }

  async function handleDeleteSubject(subjectId: string) {
    if (!userId) return;

    try {
      // Optimistic update
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      setStats(prev => ({ ...prev, subjects: prev.subjects - 1 }));
      setSubjectToDelete(null);

      await api.deleteSubject(userId, subjectId);

      // Reload activity to show "Deleted Subject" log
      api.getRecentActivity(userId).then(setActivities);
    } catch (err: any) {
      console.error('Failed to delete subject:', err);
      // Rollback optimistic update
      loadDashboardData();
    }
  }

  async function handleRenameSubject(subjectId: string, newName: string) {
    if (!userId) return;

    try {
      const updatedSubject = await api.updateSubject(userId, subjectId, newName);
      // Update local state
      setSubjects(prev => prev.map(s => s.id === subjectId ? updatedSubject : s));
      setSubjectToRename(null);
      // Reload activity
      api.getRecentActivity(userId).then(setActivities);
    } catch (err: any) {
      console.error('Failed to rename subject:', err);
      throw err;
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnauthenticated || !userId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar
        user={user}
        onSignOut={handleSignOut}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="relative z-10 border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-shrink-0">
              <p className="text-sm text-zinc-500">Dashboard</p>
              <h1 className="text-xl sm:text-2xl font-serif">Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
            </div>

            {/* Global Search Bar - Hidden on small screens */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search across all subjects..."
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsNewSubjectModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Subject</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - Bento Grid */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Hero Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Subjects"
                value={stats.subjects.toString()}
                icon={<Library className="w-5 h-5" />}
                gradient="from-purple-500/20 to-pink-500/20"
              />
              <StatCard
                title="Documents Indexed"
                value={stats.documents.toString()}
                subtitle="PDFs"
                icon={<Database className="w-5 h-5" />}
                gradient="from-blue-500/20 to-cyan-500/20"
              />
              <StatCard
                title="Queries Answered"
                value={stats.queries.toString()}
                icon={<MessageSquare className="w-5 h-5" />}
                gradient="from-green-500/20 to-emerald-500/20"
              />
            </div>

            {/* Main Grid - Recent Activity + Subjects */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Recent Activity - Left Column */}
              <div className="lg:col-span-4">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 h-[400px] sm:h-[500px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </div>

                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {activities.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 px-4">
                        <p className="text-sm">Upload a document or ask your first question to get started.</p>
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-4 h-4 text-purple-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{activity.topic}</p>
                              <p className="text-xs text-zinc-500">{activity.subject}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-2 ml-11">
                            {new Date(activity.time).toLocaleDateString()} • {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Subjects Grid - Right Column */}
              <div className="lg:col-span-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Your Subjects</h3>
                  <p className="text-sm text-zinc-500">Manage your knowledge base</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Create New Card */}
                  <button
                    onClick={() => setIsNewSubjectModalOpen(true)}
                    className="group relative h-48 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500" />
                    <div className="relative h-full flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-medium">Create New Subject</p>
                    </div>
                  </button>

                  {/* Subject Cards */}
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-48 bg-zinc-900/50 border border-white/10 rounded-2xl animate-pulse"
                        />
                      ))}
                    </>
                  ) : (
                    subjects.map((subject, index) => (
                      <div
                        key={subject.id}
                        className="group relative h-48 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 hover:border-white/20 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden"
                        onClick={() => router.push(`/dashboard/${subject.id}`)}
                      >
                        {/* Gradient Orb */}
                        <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br ${subjectGradients[index % subjectGradients.length]} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                        <div className="relative h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-auto">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subjectGradients[index % subjectGradients.length]} flex items-center justify-center`}>
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="relative" ref={openMenuId === subject.id ? menuRef : null}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === subject.id ? null : subject.id);
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <MoreVertical className="w-4 h-4 text-zinc-400" />
                              </button>

                              {/* Dropdown Menu */}
                              {openMenuId === subject.id && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSubjectToRename(subject);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Rename
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSubjectToDelete(subject);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div>
                            <h4 className="text-base font-semibold mb-1 truncate">{subject.name}</h4>
                            <p className="text-xs text-zinc-500 mb-3">{subject.document_count || 0} Files</p>

                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/dashboard/${subject.id}`);
                                }}
                                className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                              >
                                Chat
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Upload action logic - ideally open upload modal here
                                }}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Empty State */}
                {!isLoading && subjects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-500 mb-4">No subjects yet. Create your first one to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <NewSubjectModal
        isOpen={isNewSubjectModalOpen}
        onClose={() => setIsNewSubjectModalOpen(false)}
        onSubmit={handleCreateSubject}
      />

      <RenameSubjectModal
        isOpen={!!subjectToRename}
        currentName={subjectToRename?.name || ''}
        onClose={() => setSubjectToRename(null)}
        onSubmit={(newName) => handleRenameSubject(subjectToRename!.id, newName)}
      />

      {/* Delete Confirmation Dialog */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-2">Delete Subject?</h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">{subjectToDelete.name}</span>?
              This will also delete all documents and chat history associated with this subject.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSubjectToDelete(null)}
                className="flex-1 px-4 py-2 border border-white/10 text-zinc-300 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubject(subjectToDelete.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all hover:bg-white/5">
      <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-40`} />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-0.5">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
