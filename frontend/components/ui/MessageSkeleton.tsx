// MessageSkeleton - Loading state for AI thinking
'use client';

export default function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}
