// Login Page - Glassmorphism Style
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FileText, Brain, Zap, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Scoped Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-zinc-900 to-blue-900/20 opacity-60"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 10%, black 90%, transparent)",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo Badge */}
          <div className="animate-fade-in delay-100 mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-bold tracking-tight">KORTEX</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="animate-fade-in delay-200 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            {/* Card Glow Effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Heading */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-zinc-400">
                  Sign in to access your AI study assistant
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <Feature
                  icon={<FileText className="w-4 h-4 text-purple-400" />}
                  title="Upload & Process PDFs"
                />
                <Feature
                  icon={<Brain className="w-4 h-4 text-purple-400" />}
                  title="AI-Powered Q&A"
                />
                <Feature
                  icon={<Zap className="w-4 h-4 text-purple-400" />}
                  title="Instant Answers with Citations"
                />
              </div>

              <div className="h-px w-full bg-white/10 mb-8" />

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Footer Note */}
              <p className="mt-6 text-center text-xs text-zinc-500">
                By signing in, you agree to our Terms of Service
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="animate-fade-in delay-300 mt-8 text-center text-sm text-zinc-400">
            New to KORTEX?{' '}
            <span className="text-purple-400 font-medium">Getting started is free</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center ring-1 ring-purple-400/20">
        {icon}
      </div>
      <span className="text-zinc-300">{title}</span>
    </div>
  );
}
