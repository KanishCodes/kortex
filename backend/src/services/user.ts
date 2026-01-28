// User Service - Manages user identity mapping
// Creates user records when they first sign in via OAuth

import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  created_at: string;
}

/**
 * Get or create user by email (for OAuth sign-in)
 * This is called by the backend when it receives API requests with user info
 */
export async function getOrCreateUser(
  email: string,
  name?: string,
  image?: string
): Promise<User> {
  console.log(`👤 Looking up user: ${email}`);

  // Try to find existing user
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    console.log(`   ✅ Found existing user: ${existingUser.id}`);
    return existingUser;
  }

  // User doesn't exist - create new one
  console.log(`   ➕ Creating new user for: ${email}`);

  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      email,
      name: name || null,
      image: image || null,
    })
    .select()
    .single();

  if (createError) {
    console.error('❌ Failed to create user:', createError);
    throw new Error(`Failed to create user: ${createError.message}`);
  }

  console.log(`   ✅ Created user: ${newUser.id}`);
  return newUser;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }

  return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Failed to fetch user:', error);
    return null;
  }

  return data;
}
