require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // List of potential models from your curl output
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];

  for (const modelId of modelsToTest) {
    try {
      console.log(`Testing ${modelId}...`);
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent('Hi');
      console.log(`✅ ${modelId} works!`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ ${modelId} failed: ${err.message.substring(0, 100)}`);
    }
  }
}

test();
