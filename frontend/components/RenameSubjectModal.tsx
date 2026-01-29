// Rename Subject Modal Component
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RenameSubjectModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSubmit: (newName: string) => Promise<void>;
}

export default function RenameSubjectModal({ isOpen, currentName, onClose, onSubmit }: RenameSubjectModalProps) {
  const [subjectName, setSubjectName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when currentName changes
  useEffect(() => {
    setSubjectName(currentName);
  }, [currentName]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }

    if (subjectName.trim() === currentName) {
      // No change, just close
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(subjectName.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to rename subject');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (!isSubmitting) {
      setSubjectName(currentName); // Reset to original
      setError(null);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            Rename Subject
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="subjectName"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Subject Name
            </label>
            <input
              id="subjectName"
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Computer Science, History, Mathematics"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-white/10 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-white/10 text-zinc-300 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subjectName.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
