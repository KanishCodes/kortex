// UploadModal - PDF Upload with drag & drop + Auth
'use client';

import { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
  onUploadComplete?: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  subjectId,
  subjectName,
  onUploadComplete
}: UploadModalProps) {
  const { userId } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [chunksGenerated, setChunksGenerated] = useState(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === 'application/pdf');

    if (pdfFile) {
      handleUpload(pdfFile);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      handleUpload(file);
    } else if (file) {
      setError('Please select a PDF file');
    }
  };

  const handleUpload = async (file: File) => {
    if (!userId) {
      setError('Not authenticated');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setError(null);

    try {
      console.log(`Uploading ${file.name} to subject ${subjectId}`);
      
      const result = await api.uploadDocument(userId, subjectId, file);

      console.log('Upload successful:', result);
      setChunksGenerated(result.chunksGenerated);
      setIsUploading(false);
      setUploadComplete(true);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setIsUploading(false);
      setError(err.message || 'Failed to upload document');
    }
  };

  const resetModal = () => {
    setIsUploading(false);
    setUploadComplete(false);
    setFileName('');
    setError(null);
    setChunksGenerated(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Document</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add to <span className="font-medium text-purple-600 dark:text-purple-400">{subjectName}</span>
            </p>
          </div>
          <button
            onClick={resetModal}
            disabled={isUploading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 dark:text-red-400 underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!isUploading && !uploadComplete && (
          <div
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop your PDF here
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">or</p>
            <label className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
              Browse Files
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Maximum file size: 10MB
            </p>
          </div>
        )}

        {/* Progress */}
        {isUploading && (
          <div className="py-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{fileName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Processing PDF... This may take a few moments
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
              Extracting text, chunking, and generating embeddings...
            </p>
          </div>
        )}

        {/* Success */}
        {uploadComplete && (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Complete!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {fileName} has been processed successfully
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
              Generated {chunksGenerated} knowledge chunks • Ready to chat
            </p>
            <button
              onClick={resetModal}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
