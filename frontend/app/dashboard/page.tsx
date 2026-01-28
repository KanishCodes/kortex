// Dashboard - Subject Grid
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, User, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import SubjectCard from '@/components/SubjectCard';
import NewSubjectModal from '@/components/NewSubjectModal';
import { Subject } from '@/lib/api';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const { userId, user, isLoading: isAuthLoading, isUnauthenticated } = useAuth();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isUnauthenticated) {
      router.push('/login');
    }
  }, [isUnauthenticated, router]);

  // Fetch subjects when userId is available
  useEffect(() => {
    if (userId) {
      loadSubjects();
    }
  }, [userId]);

  async function loadSubjects() {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedSubjects = await api.getSubjects(userId);
      setSubjects(fetchedSubjects);
    } catch (err: any) {
      console.error('Failed to load subjects:', err);
      setError(err.message || 'Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSubject(name: string) {
    if (!userId) throw new Error('Not authenticated');
    
    try {
      const newSubject = await api.createSubject(userId, name);
      setSubjects([newSubject, ...subjects]);
      setIsNewSubjectModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create subject:', err);
      throw err;
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (isUnauthenticated || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            KORTEX
          </h1>
          
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full"
                title={user.email || ''}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Subjects
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a subject to start chatting with your documents
            </p>
          </div>
          
          <button
            onClick={() => setIsNewSubjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Subject
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={loadSubjects}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No subjects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first subject to start uploading documents
            </p>
            <button
              onClick={() => setIsNewSubjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Subject
            </button>
          </div>
        ) : (
          /* Subject Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={{
                  id: subject.id,
                  userId: userId,
                  name: subject.name,
                  documentCount: 0,
                  createdAt: new Date(subject.created_at),
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Subject Modal */}
      <NewSubjectModal
        isOpen={isNewSubjectModalOpen}
        onClose={() => setIsNewSubjectModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
}
