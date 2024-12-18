const { expect } = require('chai');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('Plant Care Assistant Chatbox', () => {
    let document;
    let window;
    let userInput;
    let chatbox;
    let sendMessage;

    beforeEach(() => {
        const dom = new JSDOM(`
            <div id="chatbox"></div>
            <input type="text" id="user-input" placeholder="Ask about plant care..." />
            <button id="send-button">Send</button>
        `);
        window = dom.window;
        document = window.document;
        userInput = document.getElementById('user-input');
        chatbox = document.getElementById('chatbox');

        // Mock sendMessage function
        sendMessage = async () => {
            const message = userInput.value;
            const data = { response: "This is a sample response. How can I help with your plant care?" };

            chatbox.innerHTML += `<p><b>You:</b> ${message}</p>`;
            chatbox.innerHTML += `<p><b>Assistant:</b> ${data.response}</p>`;
            userInput.value = '';
            chatbox.scrollTop = chatbox.scrollHeight;
        };
    });

    it('should add user message to chatbox when sendMessage is called', async () => {
        userInput.value = 'How do I water my plant?';
        await sendMessage();
        
        const chatContent = chatbox.innerHTML;
        expect(chatContent).to.contain('<p><b>You:</b> How do I water my plant?</p>');
    });

    it('should add assistant response to chatbox after user message', async () => {
        userInput.value = 'How much sunlight do my plants need?';
        await sendMessage();
        
        const chatContent = chatbox.innerHTML;
        expect(chatContent).to.contain('<p><b>Assistant:</b> This is a sample response. How can I help with your plant care?</p>');
    });

    it('should clear the input field after sending a message', async () => {
        userInput.value = 'Tell me more about plant care';
        await sendMessage();
        
        expect(userInput.value).to.equal('');
    });

    it('should scroll chatbox to the bottom after sending a message', async () => {
        const initialScrollTop = chatbox.scrollTop;
        
        userInput.value = 'How often should I water my plant?';
        await sendMessage();
        
        expect(chatbox.scrollTop).to.be.greaterThan(initialScrollTop);
    });
});
