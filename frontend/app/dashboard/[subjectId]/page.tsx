// Chat Room - Premium RAG Chat Interface with Advanced UX
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Upload, ArrowLeft, FileText, Loader2, Sparkles, Menu, X, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import MessageSkeleton from '@/components/ui/MessageSkeleton';
import UploadModal from '@/components/UploadModal';
import DocumentDrawer from '@/components/DocumentDrawer';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import type { Document } from '@/lib/api';

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

  // Document Drawer State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopDrawerCollapsed, setIsDesktopDrawerCollapsed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Study-native follow-up suggestions
  const followUpSuggestions = [
    "Explain this with an example",
    "Create 5 practice MCQs",
    "Give me a short exam answer",
  ];

  // Initial suggested questions
  const initialSuggestions = [
    "Summarize the main concepts",
    "What are the key takeaways?",
    "Explain this in simple terms",
    "Give me practice questions",
  ];

  // Check if user can chat (has documents)
  const canChat = documents.length > 0;

  // Redirect if not authenticated
  useEffect(() => {
    if (isUnauthenticated) {
      router.push('/login');
    }
  }, [isUnauthenticated, router]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      loadSubjectInfo();
      loadDocuments();
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

  async function loadDocuments() {
    if (!userId) return;
    try {
      setIsLoadingDocs(true);
      const docs = await api.getDocuments(subjectId);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load docs', err);
    } finally {
      setIsLoadingDocs(false);
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    try {
      setDocuments(prev => prev.filter(d => d.id !== docId));
      await api.deleteDocument(docId);
      loadDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
      loadDocuments();
      alert('Failed to delete document. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || inputValue;
    if (!messageText.trim() || isThinking || !userId || !canChat) return;

    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await api.chat(userId, subjectId, messageText);

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
    console.log('Upload complete, refreshing documents...');
    loadDocuments();
  };

  // Show loading while checking authentication
  if (isAuthLoading || isLoadingSubject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnauthenticated || !userId) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950">
        <p className="text-red-400">{error}</p>
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
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Premium Header */}
      <header className="flex-none border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-white truncate">
                  {subjectName}
                </h1>
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Study Assistant</span>
                  {documents.length > 0 && (
                    <span className="hidden sm:inline">• {documents.length} {documents.length === 1 ? 'source' : 'sources'}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-400" />
              {documents.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {documents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
            <div className="max-w-4xl mx-auto w-full">
              {messages.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {canChat ? 'Start Your Study Session' : 'No Documents Uploaded'}
                  </h3>
                  <p className="text-zinc-400 max-w-md mx-auto mb-8">
                    {canChat
                      ? 'Ask questions about your uploaded documents. I\'ll provide answers with cited sources.'
                      : 'Upload at least one document to start chatting with AI about your study materials.'
                    }
                  </p>

                  {canChat ? (
                    <div className="max-w-2xl mx-auto">
                      <p className="text-sm text-zinc-500 mb-4">Try asking:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {initialSuggestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(question)}
                            className="px-4 py-3 bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 hover:border-purple-500/50 rounded-xl text-sm text-zinc-300 hover:text-white transition-all text-left group"
                          >
                            <span className="text-purple-400 mr-2 group-hover:scale-110 inline-block transition-transform">→</span>
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Your First Document
                    </button>
                  )}
                </div>
              )}

              {messages.map((message, index) => (
                <div key={message.id}>
                  <ChatMessage
                    message={message}
                    onSendFollowUp={handleSendMessage}
                    showSuggestions={message.role === 'assistant' && index === messages.length - 1 && !isThinking}
                    suggestions={followUpSuggestions}
                  />
                </div>
              ))}

              {isThinking && <MessageSkeleton />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Answer Scope Indicator + Input Area */}
          <div className="flex-none border-t border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-900/95 backdrop-blur-xl p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Scope Indicator */}
              {canChat && (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="flex items-center gap-2 min-w-0 flex-1 text-xs">
                    <span className="text-zinc-400">Answering using</span>
                    <span className="text-purple-400 font-semibold">
                      {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                    </span>
                    {documents.length > 0 && documents.length <= 2 && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500 truncate">
                          {documents.map(d => d.title).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-3 items-stretch">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isThinking || !canChat}
                    placeholder={
                      !canChat
                        ? 'Upload documents first to enable chat...'
                        : isThinking
                          ? 'AI is thinking...'
                          : 'Ask a question about your documents...'
                    }
                    rows={1}
                    className="w-full h-[52px] px-4 py-3.5 bg-zinc-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-zinc-500 border border-white/10 focus:border-purple-500/50 resize-none max-h-32 overflow-y-auto shadow-lg shadow-black/20"
                  />
                  {!canChat && (
                    <p className="absolute -bottom-5 left-1 text-[10px] text-red-400">
                      ⚠️ Upload at least one document to start chatting
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isThinking || !canChat}
                  className="flex-shrink-0 h-[52px] px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:shadow-none min-w-[56px] hover:scale-105 active:scale-95"
                  title={!canChat ? 'Upload documents first' : 'Send message'}
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
        </div>

        {/* Right: Document Drawer (Desktop) */}
        <div className={`hidden lg:block h-full border-l border-white/10 transition-all duration-300 relative ${isDesktopDrawerCollapsed ? 'w-12' : 'w-80'}`}>
          {isDesktopDrawerCollapsed ? (
            // Collapsed state - just expand button
            <div className="h-full bg-zinc-900 flex flex-col items-center p-2">
              <button
                onClick={() => setIsDesktopDrawerCollapsed(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="Expand sources"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white" />
              </button>
              <div className="mt-4 text-xs text-zinc-600 writing-vertical-rl rotate-180">
                Sources ({documents.length})
              </div>
            </div>
          ) : (
            // Expanded state - full drawer with toggle button
            <div className="h-full relative flex flex-col">
              {/* Collapse button inside drawer */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsDesktopDrawerCollapsed(true)}
                  className="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 rounded-lg transition-colors shadow-lg group"
                  title="Collapse sources"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </button>
              </div>
              <DocumentDrawer
                documents={documents}
                isLoading={isLoadingDocs}
                onDelete={handleDeleteDocument}
              />
            </div>
          )}
        </div>

        {/* Mobile Document Drawer */}
        {isMobileDrawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 lg:hidden transform transition-transform">
              <div className="h-full bg-zinc-900 border-l border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Sources</h3>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <DocumentDrawer
                    documents={documents}
                    isLoading={isLoadingDocs}
                    onDelete={handleDeleteDocument}
                  />
                </div>
              </div>
            </div>
          </>
        )}

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
