// Landing Page
import Link from 'next/link';
import { Sparkles, Brain, Eye, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-purple-900 dark:text-purple-100">KORTEX</span>
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Your AI Study Assistant
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Powered by Your Notes
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Upload your study materials and get instant answers—strictly from your documents. 
            No hallucinations, just transparent AI reasoning.
          </p>

          {/* CTA */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Get Started
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Cloud-Native RAG
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Zero local resource strain. All processing happens on edge GPUs in the cloud.
            </p>
          </div>

          <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              X-Ray Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See exactly which parts of your documents were used to generate each answer.
            </p>
          </div>

          <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Subject Isolation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Organize by topic. Each subject maintains strict data boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
