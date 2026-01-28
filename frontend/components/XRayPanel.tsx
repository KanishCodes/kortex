// XRayPanel - Visualizes RAG retrieval context
'use client';

import { useState } from 'react';
import { ChevronDown, Eye, Zap } from 'lucide-react';
import type { RetrievedChunk } from '@/lib/types';

interface XRayPanelProps {
  retrievedChunks: RetrievedChunk[];
  inferenceTime: number;
}

export default function XRayPanel({ retrievedChunks, inferenceTime }: XRayPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.9) return 'border-green-500 bg-green-50 dark:bg-green-950';
    if (similarity > 0.8) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
    return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
  };

  const getSimilarityDot = (similarity: number) => {
    if (similarity > 0.9) return '🟢';
    if (similarity > 0.8) return '🟡';
    return '⚪';
  };

  return (
    <div className="mt-3 border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden bg-purple-50/50 dark:bg-purple-950/20">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-sm text-purple-900 dark:text-purple-100">
            🔍 Kortex Vision
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {inferenceTime.toFixed(2)}s
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pb-2 border-b border-purple-200 dark:border-purple-800">
            <span className="flex items-center gap-1">
              🟢 High (&gt;0.9)
            </span>
            <span className="flex items-center gap-1">
              🟡 Medium (&gt;0.8)
            </span>
            <span className="flex items-center gap-1">
              ⚪ Low (&lt;0.8)
            </span>
          </div>

          {/* Chunks */}
          {retrievedChunks.map((chunk) => (
            <div
              key={chunk.id}
              className={`border-l-4 p-3 rounded-r ${getSimilarityColor(chunk.similarity)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {chunk.sourceLabel}
                </span>
                <span className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
                  {getSimilarityDot(chunk.similarity)} {(chunk.similarity * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
