/* 
 * API Environment Variables
 * IMPORTANT: In a production environment, you should never expose API keys in frontend JS.
 * Since this is purely a frontend deployment request, replace these strings with your actual keys.
 */
const OPENROUTER_API_KEY = "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"; 
const HF_API_TOKEN = "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";

// --- DOM References ---
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const clearChatBtn = document.getElementById('clear-chat-btn');
const modeToggleBtn = document.getElementById('toggle-mode-btn');
const modeIcon = document.getElementById('mode-icon');
const modeText = document.getElementById('mode-text');

// --- Component State ---
let isImageMode = false; // By default we start in Text Mode

// --- Initialization & UX Enhancements ---
chatInput.addEventListener('input', () => {
    // Disable send button if input layout is empty
    sendBtn.disabled = chatInput.value.trim().length === 0;
});

// Auto-focus input for quick engagement
window.addEventListener('load', () => chatInput.focus());

// --- Core Features: Layout Toggles ---

// Target Bonus Feature: Toggle between Text (OpenRouter) & Image (Huggingface) modes
modeToggleBtn.addEventListener('click', () => {
    isImageMode = !isImageMode;
    
    if (isImageMode) {
        modeIcon.className = "fa-solid fa-image";
        modeText.textContent = "Image Mode";
        modeToggleBtn.classList.replace('text-mode', 'image-mode');
        chatInput.placeholder = "Describe an image to generate...";
    } else {
        modeIcon.className = "fa-solid fa-message";
        modeText.textContent = "Text Mode";
        modeToggleBtn.classList.replace('image-mode', 'text-mode');
        chatInput.placeholder = "Type your message...";
    }
    chatInput.focus();
});

// Target Bonus Feature: Clear chat history
clearChatBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the entire chat history?")) {
        chatBox.innerHTML = '';
        // Automatically hide typing indicator if it was stuck
        setTypingStatus(false);
    }
});

// --- UI Messaging Rendering API ---

// Create formatted timestamp locally 
const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Main dispatcher function to append bubbles sequentially to the chatBox
const appendMessage = (role, content, type = 'text', isError = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    if (isError) {
        contentDiv.classList.add('error-content');
    }

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = content; // Provided content represents the blob URL
        img.alt = "Generated AI Graphic";
        
        // Wait for image to load to scroll completely past it
        img.onload = () => scrollToBottom();
        contentDiv.appendChild(img);
    } else {
        // Simple sanitization mapping `\n` safely to HTML breaks
        contentDiv.innerHTML = content.replace(/\n/g, '<br>');
    }

    // Appending dynamic bonus timestamp
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-timestamp');
    timeDiv.textContent = getTimestamp();

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    chatBox.appendChild(messageDiv);
    scrollToBottom();
};

const scrollToBottom = () => {
    chatBox.scrollTop = chatBox.scrollHeight;
};

// Simple visibility toggle for "Bot is typing..." 
const setTypingStatus = (isTyping) => {
    if (isTyping) {
        typingIndicator.classList.remove('hidden');
        scrollToBottom();
    } else {
        typingIndicator.classList.add('hidden');
    }
};

// --- Form & Submit Workflows ---
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (!prompt) return; // Prevent empty injections

    // 1. Immediately inject Users Request Bubble
    appendMessage('user', prompt, 'text');
    
    // 2. Refresh client UI states
    chatInput.value = '';
    sendBtn.disabled = true;
    setTypingStatus(true); // Engages "typing..." UI

    // 3. Dispatch specific functional logic relying on UI toggle state
    if (isImageMode) {
        await fetchImageResponse(prompt);
    } else {
        await fetchTextResponse(prompt);
    }

    // 4. Return UI to normal sequence
    setTypingStatus(false);
    chatInput.focus();
});


// --- Internal HTTP AI Integrations ---

// Feature: HuggingFace Text Generation Integration (Replaced OpenRouter)
const fetchTextResponse = async (prompt) => {
    // API verification check - if no key is provided, we simulate the chat UX!
    if (HF_API_TOKEN === "YOUR_HF_TOKEN") {
        
        // Simulate network delay to see "Bot is typing..." indicator
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Dynamic simulated responses for testing the UI
        const mockResponses = [
            `I'm currently in Offline Simulation Mode! You said: "${prompt}"`,
            "That's very interesting! Remember to add your HuggingFace Token to chat with the real Llama model.",
            "Testing, testing! The chat interface is working perfectly.",
            "I'm an echo bot until you supply an API key! 🤖"
        ];
        const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        appendMessage('bot', reply, 'text');
        return;
    }

    try {
        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            let serverError = `Error ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.error && errData.error.metadata && errData.error.metadata.raw) {
                    serverError = errData.error.metadata.raw;
                } else if (errData.error && errData.error.message) {
                    serverError = errData.error.message;
                }
            } catch (e) {
                // Ignore parse errors on raw dumps
            }
            throw new Error(serverError);
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content; // Extract target payload
        
        appendMessage('bot', botReply, 'text');

    } catch (error) {
        appendMessage('bot', `⚠️ API Limit Hit: ${error.message}`, 'text', true);
    }
};


// Feature: HuggingFace Image Generation Integration
const fetchImageResponse = async (prompt) => {
    // API verification check - simulate rendering if no key exists
    if (HF_API_TOKEN === "YOUR_HF_TOKEN") {
        
        // Simulate rendering delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fallback to random Unsplash images
        const fallbackId = Math.floor(Math.random() * 1000);
        appendMessage('bot', `https://picsum.photos/seed/${fallbackId}/400/300`, 'image');
        return;
    }

    try {
        const response = await fetch('https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) {
            let errorMsg = `HuggingFace Error: ${response.status}`;
            try {
                const errData = await response.json();
                errorMsg = errData.error || errorMsg;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        // Specifically consume output stream resolving directly into Blob format 
        const blob = await response.blob();
        
        // Dynamically instantiate an Object URL for arbitrary JS rendering inside DOM `<img src="...">` tag
        const imageUrl = URL.createObjectURL(blob);
        
        // Append response as a verified Image Payload
        appendMessage('bot', imageUrl, 'image');

    } catch (error) {
        appendMessage('bot', error.message || "Failed to process stability AI node query.", 'text', true);
    }
};
