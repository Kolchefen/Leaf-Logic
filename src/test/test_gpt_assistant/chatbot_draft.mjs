import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide your OpenAI API key here
const openai = new OpenAI({
  apiKey: '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'  // Replace with your actual OpenAI API key
});

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Resolve __dirname (necessary in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global variables to store the assistant and thread ID
let assistant;
let thread;


// Serve the HTML file when accessing the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot_draft.html'));
});

// Endpoint to handle user messages and communicate with OpenAI Assistant
app.post('/ask-assistant', async (req, res) => {
  try {
    const { message } = req.body;

    // Check if the thread already exists, if not create one
    if (!thread) {
      thread = await openai.beta.threads.create();
      console.log("New thread created:", thread.id);
    }

    // Add the user's message to the existing thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // Run the assistant on the thread
    let run = await openai.beta.threads.runs.createAndPoll(thread.id, { 
      assistant_id: 'asst_CYcOKzQcQZWclLJuUH7l0V9O',
  });

    // Check the run status and send the response
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const assistantMessage = messages.data[0].content[0].text.value;
      res.json({ response: assistantMessage });
    } else {
      res.json({ response: "The assistant is still thinking. Please try again." });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
