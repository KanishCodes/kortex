import {
  ArrowRight,

  Star,
  // Tech Stack Icons
  FileText,
  Brain,
  Zap,
  Database,
  Cloud,
  Sparkles
} from "lucide-react";

// --- TECH STACK BRANDS ---
const TECH_STACK = [
  { name: "Next.js", icon: Zap },
  { name: "Supabase", icon: Database },
  { name: "Groq AI", icon: Brain },
  { name: "Cloudflare", icon: Cloud },
  { name: "Bun Runtime", icon: Sparkles },
  { name: "RAG System", icon: FileText },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

// --- MAIN COMPONENT ---
export default function HeroSection() {
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* 
        SCOPED ANIMATIONS 
      */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .fade-bottom {
          display: inline-block;
          background: linear-gradient(
            to bottom,
            #ffffff 0%,
            #ffffff 55%,
            rgba(255,255,255,0.85) 70%,
            rgba(255,255,255,0.45) 85%,
            rgba(255,255,255,0.1) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-zinc-900 to-blue-900/20 opacity-60"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 md:pt-16 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  AI-Powered Study Assistant
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.95]"
            >
              Transform Your<br />
              <span className="bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Study Materials
              </span><br />
              <span className="fade-bottom">Into Knowledge</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
              KORTEX uses advanced RAG technology to help you understand and interact with your documents.
              Upload PDFs, ask questions, and get instant AI-powered answers with source citations.
            </p>

            {/* Use Case */}
            <p className="animate-fade-in delay-300 max-w-xl text-sm text-purple-300/80 leading-relaxed italic">
              Perfect for exam prep, revision, and quick concept lookups.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <a
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#features"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                See How It Works
              </a>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">

            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 ring-1 ring-purple-400/30">
                    <FileText className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">Document-Aware AI</div>
                    <div className="text-sm text-zinc-400">Unlimited Documents Supported</div>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Context-Verified Answers</span>
                    <span className="text-white font-medium">Source-Cited</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-6" />

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="PDF" label="Upload" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="Chat" label="AI Assistant" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="Cite" label="Sources" />
                </div>

                {/* Tag Pills */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    FREE TO USE
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Marquee Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Powered By Modern Tech Stack</h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {/* Triple list for seamless loop */}
                  {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                    >
                      <tech.icon className="h-6 w-6 text-purple-300" />
                      <span className="text-lg font-bold text-white tracking-tight">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
