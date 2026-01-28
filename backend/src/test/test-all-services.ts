// Quick test to verify all services are connected
import { supabase, testConnection } from '../services/supabase';
import { generateEmbedding } from '../services/cloudflare';
import { generateResponse } from '../services/groq';

async function testAllServices() {
  console.log('🧪 Testing All Backend Services...\n');

  let allPassed = true;

  // Test 1: Supabase
  console.log('1️⃣ Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('subjects').select('count');
    if (error) throw error;
    console.log('   ✅ Supabase: Connected\n');
  } catch (error: any) {
    console.log(`   ❌ Supabase: Failed - ${error.message}\n`);
    allPassed = false;
  }

  // Test 2: Cloudflare
  console.log('2️⃣ Testing Cloudflare embeddings...');
  try {
    const embedding = await generateEmbedding('Test');
    if (embedding.length === 768) {
      console.log('   ✅ Cloudflare: Working (768-dim vector)\n');
    } else {
      throw new Error('Invalid dimension');
    }
  } catch (error: any) {
    console.log(`   ❌ Cloudflare: Failed - ${error.message}\n`);
    allPassed = false;
  }

  // Test 3: Groq
  console.log('3️⃣ Testing Groq LLM...');
  try {
    const response = await generateResponse([
      { role: 'user', content: 'Say hello in 3 words' }
    ]);
    console.log(`   ✅ Groq: Working`);
    console.log(`   Response: "${response}"\n`);
  } catch (error: any) {
    console.log(`   ❌ Groq: Failed - ${error.message}\n`);
    allPassed = false;
  }

  // Summary
  console.log('━'.repeat(50));
  if (allPassed) {
    console.log('✅ ALL SERVICES OPERATIONAL!');
    console.log('🚀 Ready for Phase 3: RAG Pipeline Implementation');
  } else {
    console.log('⚠️  Some services failed. Check credentials in .env');
  }
}

testAllServices();
