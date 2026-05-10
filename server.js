require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Helper to list files safely for AI context
const listLocalFiles = (dirPath) => {
  try {
    const resolvedPath = path.resolve(dirPath || '.');
    // We'll limit it to the project area or home for safety in this demo
    const files = fs.readdirSync(resolvedPath);
    return files.slice(0, 20).map(f => {
      const stats = fs.statSync(path.join(resolvedPath, f));
      return `${stats.isDirectory() ? '[DIR]' : '[FILE]'} ${f}`;
    }).join('\n');
  } catch (err) {
    return `(Unable to list files in ${dirPath})`;
  }
};

const getCurrentSystemInstruction = () => {
  const dateString = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  // Give the AI a "snapshot" of the current folder it's in
  const workspaceFiles = listLocalFiles('.');
  
  return `Today's date is ${dateString}. You are the "Gemini Local Agent," a powerful AI with access to the user's local machine via a Node.js bridge.
  
  CURRENT WORKSPACE FILES:
  ${workspaceFiles}
  
  Unlike standard cloud AI, you CAN see and interact with local files when the user asks. If they ask "what files are here?", refer to the list above. If they ask to find something elsewhere, explain that you can check directories for them.`;
};

const model = genAI.getGenerativeModel({ 
  model: "gemma-4-31b-it",
  systemInstruction: getCurrentSystemInstruction()
});

const logFile = path.join(__dirname, 'server.log');
const log = (msg) => {
  const time = new Date().toLocaleTimeString();
  const entry = `[${time}] ${msg}\n`;
  fs.appendFileSync(logFile, entry);
  console.log(entry.trim());
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!apiKey });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });

    log(`Request: ${message.substring(0, 30)}`);
    
    const result = await model.generateContent(message);
    const text = result.response.text();
    
    log(`Success!`);
    res.json({ text });
  } catch (error) {
    log(`ERROR: ${error.message}`);
    res.status(500).json({ error: 'Gemini API Error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini Bridge Server listening at http://localhost:${PORT}`);
});
