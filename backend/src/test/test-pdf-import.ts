// Quick test to determine correct pdf-parse import for Bun
const pdfLib = require('pdf-parse');

console.log('pdf-parse module structure:');
console.log('Type:', typeof pdfLib);
console.log('Has default?', 'default' in pdfLib);
console.log('Keys:', Object.keys(pdfLib));
console.log('Is function?', typeof pdfLib === 'function');
console.log('default is function?', typeof pdfLib.default === 'function');

// Try to determine the correct way to call it
if (typeof pdfLib === 'function') {
  console.log('\n✅ Use: require("pdf-parse") directly');
} else if (typeof pdfLib.default === 'function') {
  console.log('\n✅ Use: require("pdf-parse").default');
} else {
  console.log('\n❌ Neither approach works - need different solution');
  console.log('Full module:', pdfLib);
}
