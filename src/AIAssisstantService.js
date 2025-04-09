import plantService from './PlantService';

class AIAssistantService {
  constructor() {
    this.baseUrl = 'http://localhost:3000'; // Update with your actual API endpoint
    this.threadId = null;
  }

  /**
   * Send a user message to the AI assistant
   * @param {string} message - User's message
   * @returns {Promise<string>} Assistant's response
   */
  async sendMessage(message) {
    try {
      // Get plant context to enrich the AI's knowledge
      const plantContext = await plantService.getPlantContext();
      
      // Create a request payload with the user message and plant context
      const payload = {
        message,
        plantContext,
        threadId: this.threadId // Include the thread ID if we have one
      };

      // Send the request to the backend
      const response = await fetch(`${this.baseUrl}/ask-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}`);
      }

      // Parse the response JSON
      const data = await response.json();
      
      // Store the thread ID for future messages
      if (data.threadId) {
        this.threadId = data.threadId;
      }
      
      return data.response;
    } catch (error) {
      console.error('Error sending message to AI assistant:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation thread with the AI assistant
   * @returns {Promise<string>} New thread ID
   */
  async createNewThread() {
    try {
      const response = await fetch(`${this.baseUrl}/create-thread`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.threadId = data.threadId;
      return data.threadId;
    } catch (error) {
      console.error('Error creating new thread:', error);
      throw error;
    }
  }

  /**
   * Clear the current conversation thread
   */
  clearThread() {
    this.threadId = null;
  }
}

// Create and export a singleton instance
const aiAssistantService = new AIAssistantService();
export default aiAssistantService;