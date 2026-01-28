// SubjectCard - Subject selection card
'use client';

import Link from 'next/link';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';
import type { Subject } from '@shared/types';

interface SubjectCardProps {
  subject: Subject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link
      href={`/dashboard/${subject.id}`}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {subject.name}
      </h3>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <FileText className="w-4 h-4" />
        <span>
          {subject.documentCount} {subject.documentCount === 1 ? 'document' : 'documents'}
        </span>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all">
        <span>Chat Now</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
