// Chat Room - Dynamic subject chat interface with RAG + Auth
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Upload, ArrowLeft, FileText, Loader2 } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import MessageSkeleton from '@/components/ui/MessageSkeleton';
import UploadModal from '@/components/UploadModal';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import type { ChatMessage as ChatMessageType } from '@/lib/types';

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const { userId, isLoading: isAuthLoading, isUnauthenticated } = useAuth();
  const subjectId = params.subjectId as string;
  
  const [subjectName, setSubjectName] = useState<string>('');
  const [isLoadingSubject, setIsLoadingSubject] = useState(true);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isUnauthenticated) {
      router.push('/login');
    }
  }, [isUnauthenticated, router]);

  // Load subject info when userId is available
  useEffect(() => {
    if (userId) {
      loadSubjectInfo();
    }
  }, [subjectId, userId]);

  async function loadSubjectInfo() {
    if (!userId) return;
    
    try {
      setIsLoadingSubject(true);
      const subjects = await api.getSubjects(userId);
      const subject = subjects.find(s => s.id === subjectId);
      
      if (subject) {
        setSubjectName(subject.name);
      } else {
        setError('Subject not found');
      }
    } catch (err: any) {
      console.error('Failed to load subject:', err);
      setError('Failed to load subject information');
    } finally {
      setIsLoadingSubject(false);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking || !userId) return;

    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuestion = inputValue;
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await api.chat(userId, subjectId, userQuestion);

      const aiMessage: ChatMessageType = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: response.answer,
        timestamp: new Date(),
        xrayContext: {
          retrievedChunks: response.xrayContext.retrievedChunks.map(chunk => ({
            id: chunk.id,
            content: chunk.content,
            similarity: chunk.similarity,
            sourceLabel: chunk.metadata.sourceLabel,
          })),
          inferenceTime: 0,
        },
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      
      const errorMessage: ChatMessageType = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        text: `Sorry, I encountered an error: ${err.message || 'Please try again.'}`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadComplete = () => {
    console.log('Upload complete!');
  };

  // Show loading while checking authentication
  if (isAuthLoading || isLoadingSubject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (isUnauthenticated || !userId) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {subjectName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ask questions about your documents
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start a Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Upload documents and ask questions. I'll answer based strictly on your materials.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isThinking && <MessageSkeleton />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="container mx-auto max-w-4xl flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isThinking}
              placeholder={isThinking ? 'AI is thinking...' : 'Ask a question about your documents...'}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isThinking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        subjectId={subjectId}
        subjectName={subjectName}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
