// Test script for embedding generation
import { generateEmbedding } from '../services/cloudflare';

async function testEmbedding() {
  console.log('🧪 Testing Cloudflare Embedding Generation...\n');

  const testText = 'Hello, this is a test sentence for embedding generation.';

  try {
    console.log(`📝 Input text: "${testText}"`);
    console.log('⏳ Generating embedding...\n');

    const startTime = Date.now();
    const embedding = await generateEmbedding(testText);
    const duration = Date.now() - startTime;

    console.log('✅ SUCCESS!\n');
    console.log(`📊 Results:`);
    console.log(`   - Vector dimension: ${embedding.length}`);
    console.log(`   - First 5 values: [${embedding.slice(0, 5).join(', ')}...]`);
    console.log(`   - Last 5 values: [...${embedding.slice(-5).join(', ')}]`);
    console.log(`   - Generation time: ${duration}ms\n`);

    // Verify dimension
    if (embedding.length === 768) {
      console.log('✅ Dimension check PASSED (768 expected, 768 received)');
    } else {
      console.log(`❌ Dimension check FAILED (768 expected, ${embedding.length} received)`);
    }

    // Verify all values are numbers
    const allNumbers = embedding.every((val) => typeof val === 'number' && !isNaN(val));
    if (allNumbers) {
      console.log('✅ Type check PASSED (all values are valid numbers)');
    } else {
      console.log('❌ Type check FAILED (some values are not numbers)');
    }

  } catch (error: any) {
    console.error('❌ TEST FAILED\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check that CLOUDFLARE_ACCOUNT_ID is set in .env');
    console.error('2. Check that CLOUDFLARE_API_TOKEN is set in .env');
    console.error('3. Verify your Cloudflare API token has Workers AI permissions');
    process.exit(1);
  }
}

// Run test
testEmbedding();
