// Root Layout - Wrap app with SessionProvider
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KORTEX - AI Study Assistant',
  description: 'RAG-powered chat with your study materials',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
