// ChatMessage - Premium message bubble with Markdown and follow-ups
'use client';

import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import XRayPanel from './XRayPanel';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import type { Components } from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
  onSendFollowUp?: (message: string) => void;
  showSuggestions?: boolean;
  suggestions?: string[];
}

export default function ChatMessage({
  message,
  onSendFollowUp,
  showSuggestions = false,
  suggestions = []
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom components for markdown rendering
  const components: Components = {
    h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-3 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2 first:mt-0">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base font-semibold text-white mt-3 mb-2 first:mt-0">{children}</h4>,
    h5: ({ children }) => <h5 className="text-sm font-semibold text-white mt-3 mb-2 first:mt-0">{children}</h5>,
    h6: ({ children }) => <h6 className="text-sm font-semibold text-zinc-300 mt-2 mb-2 first:mt-0">{children}</h6>,
    p: ({ children }) => <p className="text-sm text-zinc-100 leading-relaxed my-3 first:mt-0 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-outside pl-6 my-3 space-y-1.5 text-zinc-100">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-outside pl-6 my-3 space-y-1.5 text-zinc-100">{children}</ol>,
    li: ({ children }) => <li className="text-sm text-zinc-100 leading-relaxed">{children}</li>,
    code: ({ node, ...props }) => {
      const isInline = !node || node.tagName !== 'code';
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30" {...props} />
        );
      }
      return (
        <code className="block px-4 py-3 rounded-lg bg-zinc-900 text-zinc-300 text-xs font-mono border border-white/10 my-3 overflow-x-auto" {...props} />
      );
    },
    pre: ({ children }) => <pre className="my-3">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-3 italic text-zinc-300">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-purple-400 underline hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
    hr: () => <hr className="border-white/10 my-4" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-white/10 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-zinc-800">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-white/10 last:border-0">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2 text-left text-sm font-semibold text-white border-r border-white/10 last:border-r-0">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 text-sm text-zinc-200 border-r border-white/10 last:border-r-0">{children}</td>,
  };

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${isUser
          ? 'bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-zinc-800/30'
          : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/20 animate-pulse-slow'
          }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Message bubble */}
        <div
          className={`relative px-5 py-4 rounded-2xl ${isUser
            ? 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-white rounded-tr-md shadow-lg shadow-zinc-800/20'
            : 'rounded-tl-md'
            }`}
        >
          {isUser ? (
            // User message - plain text
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
          ) : (
            // AI message - rendered markdown
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}

          {/* Copy button for AI messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg flex items-center gap-1"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[10px] text-green-400 font-medium">Copied ✓</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-2 mt-2 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[11px] text-zinc-600">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <span className="text-[10px] text-zinc-700 px-2 py-0.5 rounded-full bg-zinc-800/50">
              AI
            </span>
          )}
        </div>

        {/* Follow-up Suggestions */}
        {!isUser && showSuggestions && suggestions.length > 0 && onSendFollowUp && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <p className="text-xs text-zinc-400 mb-3 flex items-center gap-2">
              <span className="text-purple-400">💡</span>
              Ask follow-ups:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendFollowUp(suggestion)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs text-zinc-300 hover:text-white transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* XRay Panel (only for assistant messages) */}
        {!isUser && message.xrayContext && (
          <div className="w-full mt-3">
            <XRayPanel
              retrievedChunks={message.xrayContext.retrievedChunks}
              inferenceTime={message.xrayContext.inferenceTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}
