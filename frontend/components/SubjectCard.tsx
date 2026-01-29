// SubjectCard - Glassmorphism Design
'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SubjectCardProps {
  subject: {
    id: string;
    userId: string;
    name: string;
    documentCount: number;
    createdAt: Date;
  };
  onDelete?: (id: string) => void;
}

export default function SubjectCard({ subject, onDelete }: SubjectCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    router.push(`/dashboard/${subject.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Delete "${subject.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(subject.id);
      }
    } catch (error) {
      console.error('Failed to delete subject:', error);
      alert('Failed to delete subject. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
    >
      {/* Card Glow Effect on Hover */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-purple-500/0 group-hover:bg-purple-500/10 blur-3xl transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 ring-1 ring-purple-400/30 transition-all group-hover:bg-purple-500/30 group-hover:ring-purple-400/50">
          <BookOpen className="h-6 w-6 text-purple-300 transition-transform group-hover:scale-110" />
        </div>

        {/* Subject Name */}
        <h3 className="mb-2 text-xl font-bold tracking-tight text-white">
          {subject.name}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{subject.documentCount} docs</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-zinc-600" />
          <span>
            {subject.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/0 hover:bg-red-500/20 border border-white/0 hover:border-red-400/50 transition-all opacity-0 group-hover:opacity-100"
          title="Delete subject"
        >
          <Trash2 className="h-4 w-4 text-zinc-400 hover:text-red-400 transition-colors" />
        </button>

        {/* Hover Arrow Indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-300 opacity-0 group-hover:opacity-100 transition-all">
          <span>Open</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
