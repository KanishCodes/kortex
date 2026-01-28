// NextAuth.js Configuration & API Route with Database User Mapping
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Helper to get or create user in our database
async function getOrCreateUser(email: string, name?: string, image?: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  try {
    // Call backend to get or create user
    const response = await fetch(`${API_URL}/users/get-or-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, image }),
    });

    if (!response.ok) {
      throw new Error('Failed to get or create user');
    }

    const user = await response.json();
    return user.id; // Return database UUID
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // When user signs in, get or create them in our database
      if (user.email) {
        try {
          const dbUserId = await getOrCreateUser(
            user.email,
            user.name || undefined,
            user.image || undefined
          );
          // Store database ID in user object for jwt callback
          (user as any).dbId = dbUserId;
        } catch (error) {
          console.error('Failed to create user in database:', error);
          return false; // Reject sign in if we can't create user
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // First time jwt callback is run, user object is available
      if (user) {
        token.dbId = (user as any).dbId;
        token.email = user.email!;
      }
      return token;
    },

    async session({ session, token }) {
      // Add database user ID to session
      if (session.user) {
        session.user.id = token.dbId as string; // This is now our database UUID!
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
