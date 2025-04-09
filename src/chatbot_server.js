import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express app
const app = express();
const port = 3000;

// Configure middleware
app.use(express.json());
app.use(cors());

// Setup static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// Serve the HTML file at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot_draft.html'));
});

// Store active threads in memory (for demo purposes)
// In production, you might want to use a database
const activeThreads = new Map();

// Create a new thread
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

// Process user message and get AI response
app.post('/ask-assistant', async (req, res) => {
  try {
    const { message, plantContext, threadId } = req.body;

    // Get or create a thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log("New thread created:", currentThreadId);
    }

    // Create the user message
    let formattedMessage = message;

    // If we have plant context, include it in a hidden way that only the AI sees
    if (plantContext && plantContext.plantCount > 0) {
      // Create a formatted context string
      const plantContextString = JSON.stringify(plantContext, null, 2);
      
      // Add the context to the message in a way that the AI understands
      // but doesn't include in its final response
      formattedMessage = `
      
        My question is: ${message}

        [For AI assistant context only - do not mention directly unless relevant:
        User has ${plantContext.plantCount} plants in their garden:
        ${plantContextString}
        Use this information only if relevant to my question. Don't list my plants unless I specifically ask about them.]
        
        `;
    }

    // Add the user message to the thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: formattedMessage
    });

    // Run the assistant on the thread
    const run = await openai.beta.threads.runs.createAndPoll(currentThreadId, { 
      assistant_id: 'asst_CYcOKzQcQZWclLJuUH7l0V9O',
    });

    // Check the run status and send the response
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(currentThreadId);
      const assistantMessage = messages.data[0].content[0].text.value;
      
      res.json({ 
        response: assistantMessage,
        threadId: currentThreadId 
      });
    } else {
      res.json({ 
        response: "The assistant is still thinking. Please try again.",
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
});