// XRayPanel - Premium RAG context visualization
'use client';

import { useState } from 'react';
import { ChevronDown, Eye, Copy, Check } from 'lucide-react';
import type { RetrievedChunk } from '@/lib/types';

interface XRayPanelProps {
  retrievedChunks: RetrievedChunk[];
  inferenceTime: number;
}

export default function XRayPanel({ retrievedChunks }: XRayPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.9) return 'border-green-500/50 bg-green-500/5';
    if (similarity > 0.8) return 'border-yellow-500/50 bg-yellow-500/5';
    return 'border-zinc-700 bg-zinc-800/30';
  };

  const getSimilarityBadge = (similarity: number) => {
    if (similarity > 0.9) return { color: 'bg-green-500', label: 'High' };
    if (similarity > 0.8) return { color: 'bg-yellow-500', label: 'Medium' };
    return { color: 'bg-zinc-600', label: 'Low' };
  };

  const handleCopyChunk = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-3 border border-purple-500/20 rounded-xl overflow-hidden bg-purple-500/5 backdrop-blur-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-500/10 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <span className="font-semibold text-sm text-purple-100">
            🔍 Context Sources
          </span>
          <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
            {retrievedChunks.length} {retrievedChunks.length === 1 ? 'chunk' : 'chunks'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-zinc-400 pb-3 border-b border-purple-500/20">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              High (&gt;90%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Medium (&gt;80%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
              Low (&lt;80%)
            </span>
          </div>

          {/* Chunks */}
          {retrievedChunks.map((chunk) => {
            const badge = getSimilarityBadge(chunk.similarity);
            return (
              <div
                key={chunk.id}
                className={`relative border rounded-xl p-4 ${getSimilarityColor(chunk.similarity)} group hover:border-purple-500/40 transition-all`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${badge.color} flex-shrink-0`}></div>
                    <span className="text-xs font-semibold text-zinc-300 truncate">
                      {chunk.sourceLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-1 rounded-md text-zinc-400 border border-white/10">
                      {(chunk.similarity * 100).toFixed(1)}%
                    </span>
                    <button
                      onClick={() => handleCopyChunk(chunk.id, chunk.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg"
                      title="Copy chunk"
                    >
                      {copiedId === chunk.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {chunk.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
