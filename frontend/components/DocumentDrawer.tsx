'use client';

import { FileText, Calendar, Trash2 } from 'lucide-react';
import type { Document } from '@/lib/api';

interface DocumentDrawerProps {
  documents: Document[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
}

export default function DocumentDrawer({ documents, isLoading, onDelete }: DocumentDrawerProps) {
  return (
    <div className="w-80 bg-zinc-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/10 bg-zinc-900/50 backdrop-blur-sm">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <span>Sources</span>
          <span className="ml-auto text-sm font-normal text-zinc-500">({documents.length})</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Knowledge base documents</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          // Skeletons
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse border border-white/5" />
          ))
        ) : documents.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-zinc-800/50 border border-white/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-400 mb-1">No documents yet</p>
            <p className="text-xs text-zinc-600">Upload a PDF to start chatting</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="group relative p-4 rounded-xl bg-zinc-800/30 border border-white/10 hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <h4
                    className="text-sm font-medium text-zinc-100 truncate mb-1 group-hover:text-white transition-colors"
                    title={doc.title}
                  >
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/50">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${doc.title}"? This will remove it from the knowledge base.`)) {
                        onDelete(doc.id);
                      }
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/20"
                    title="Delete source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with stats */}
      {documents.length > 0 && (
        <div className="p-4 border-t border-white/10 bg-zinc-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Total Sources</span>
            <span className="text-white font-semibold">{documents.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
