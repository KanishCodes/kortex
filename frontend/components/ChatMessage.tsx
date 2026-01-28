// ChatMessage - Individual message component
'use client';

import { User, Bot } from 'lucide-react';
import XRayPanel from './XRayPanel';
import type { ChatMessage as ChatMessageType } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-blue-500'
            : 'bg-gradient-to-br from-purple-500 to-blue-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-2xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-tr-none'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* XRay Panel (only for assistant messages) */}
        {!isUser && message.xrayContext && (
          <div className="w-full mt-2">
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
