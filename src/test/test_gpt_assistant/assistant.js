const apiKey = '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';  // Use your OpenAI API key here
const assistantId = 'asst_CYcOKzQcQZWclLJuUH7l0V9O'; // Use your OpenAI Assistant ID

// Function to send a message to OpenAI Assistant
async function sendMessage() {
    const message = document.getElementById('user-input').value;
    if (!message.trim()) return;  // Ignore empty messages

    // Display user's message in the chatbox
    displayMessage('You', message);

    // Send user message to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',  // or 'gpt-4' depending on your assistant
            messages: [{ role: 'user', content: message }]
        })
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Display assistant's response in the chatbox
    displayMessage('Leaf Loigc Assistant', assistantMessage);

    // Clear the input field
    document.getElementById('user-input').value = '';
}

// Function to display messages in the chatbox
function displayMessage(role, message) {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<p><b>${role}:</b> ${message}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to bottom
}
