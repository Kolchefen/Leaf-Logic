// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
// Import and configure dotenv
require('dotenv').config();

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname))); // Serve static files from current directory

// Initialize OpenAI client with API key from .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Verify API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found in .env file');
  console.error('Please create a .env file in the root directory with your OpenAI API key:');
  console.error('OPENAI_API_KEY=your_openai_api_key_here');
  process.exit(1);
}

// Store active threads in memory (for demo)
// In production, use a database
const activeThreads = new Map();

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot_draft.html'));
});

// Create a new thread endpoint
app.post('/create-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    console.log("New thread created:", thread.id);
    res.status(200).json({ 
      threadId: thread.id,
      message: "New conversation thread created"
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// Process message endpoint
app.post('/ask-assistant', async (req, res) => {
  try {
    const { message, threadId } = req.body;

    // Get or create a thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log("New thread created:", currentThreadId);
    }

    // Add the user message to the thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message
    });

    // Run the assistant on the thread
    // Use assistant ID from .env file
    const assistantId = process.env.OPENAI_ASSISTANT_ID || 'asst_CYcOKzQcQZWclLJuUH7l0V9O';
    
    const run = await openai.beta.threads.runs.create(currentThreadId, { 
      assistant_id: assistantId
    });

    // Check status and wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(
      currentThreadId,
      run.id
    );

    // Simple polling to wait for completion
    // In production, use a more sophisticated approach like webhooks
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
      runStatus = await openai.beta.threads.runs.retrieve(
        currentThreadId,
        run.id
      );
    }

    if (runStatus.status === 'completed') {
      // Get the messages after completion
      const messages = await openai.beta.threads.messages.list(currentThreadId);
      
      // Get the most recent assistant message
      const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
      const latestMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
      
      if (latestMessage && latestMessage.content.length > 0) {
        const textContent = latestMessage.content[0].text.value;
        res.json({ 
          response: textContent,
          threadId: currentThreadId 
        });
      } else {
        res.json({ 
          response: "I'm having trouble responding right now. Please try again.",
          threadId: currentThreadId
        });
      }
    } else {
      res.json({ 
        response: "Sorry, I couldn't process your request. Please try again.",
        threadId: currentThreadId
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Using OpenAI API key: ${process.env.OPENAI_API_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log(`Using Assistant ID: ${process.env.OPENAI_ASSISTANT_ID || 'asst_CYcOKzQcQZWclLJuUH7l0V9O'}`);
});
