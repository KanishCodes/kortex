# KORTEX - AI Study Assistant with Cloud-Native RAG

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-pink)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

Full-stack AI study assistant that answers questions strictly from user-uploaded documents using Cloud-Native RAG architecture.

## 🚀 Features

- **Subject-Isolated RAG**: Strict SQL-based data boundaries per subject
- **X-Ray Mode**: Visualize the "black box" of AI retrieval
- **Cloud-Native Embeddings**: Cloudflare Workers AI for zero local resource strain
- **Streaming Responses**: Real-time AI answers with typewriter effect
- **100% Privacy**: Your documents never leave your control

## 🏗️ Architecture

```
kortex/
├── frontend/         # Next.js 14 (App Router) + TypeScript + Tailwind
├── backend/          # Bun + Express + TypeScript
├── shared/           # Shared types and constants
└── docs/             # Documentation
```

## 🛠️ Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, NextAuth.js  
**Backend**: Bun runtime, Express, TypeScript  
**AI**: Cloudflare Workers AI (embeddings), Groq (LLM)  
**Database**: Supabase (PostgreSQL + pgvector)  
**PDF**: pdf-parse

## 📦 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- [Supabase](https://supabase.com/) account
- [Cloudflare](https://cloudflare.com/) account (Workers AI)
- [Groq](https://groq.com/) API key

### Installation

1. **Clone and setup environment**
   ```bash
   cd kortex
   cp .env.example frontend/.env.local
   cp .env.example backend/.env
   # Edit both .env files with your API keys
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   bun install
   ```

3. **Setup Supabase database**
   - Run the SQL schema from `plan.txt` (lines 72-131) in Supabase SQL Editor
   - Enable pgvector extension
   - Create tables: subjects, documents, chunks
   - Create match_chunks_by_subject function

4. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   bun run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000/health

## 📝 Environment Variables

See `.env.example` for complete list. Required variables:

**Frontend**:
- `NEXT_PUBLIC_API_URL`: Backend URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth credentials

**Backend**:
- `SUPABASE_URL/KEYS`: Supabase credentials
- `CLOUDFLARE_ACCOUNT_ID/API_TOKEN`: Cloudflare Workers AI
- `GROQ_API_KEY`: Groq LLM API key

## 🎯 Development Phases

This project follows a **Frontend-First** approach:

1. ✅ **Phase 1**: Frontend UI with mock data
2. ⏳ **Phase 2**: Backend API integration
3. ⏳ **Phase 3**: RAG pipeline (embeddings + vector search)
4. ⏳ **Phase 4**: Streaming responses + UX polish

## 📚 Documentation

- See `plan.txt` for complete technical specification
- See `docs/api.md` for API documentation (coming soon)

## 🤝 Contributing

This is a personal project for learning Cloud-Native RAG architecture.

## 📄 License

MIT
