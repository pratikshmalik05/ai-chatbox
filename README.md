# Ultimate AI Chatbot Assistant 🤖

A powerfully designed, pure frontend web application that seamlessly integrates advanced state-of-the-art Artificial Intelligence models directly inside your browser! Built entirely with **HTML**, **CSS**, and Vanilla **JavaScript**.

No backend, no complex `npm` setups, and no dependencies required. Simply drag the files into your browser and launch.

## ✨ Features

- **Blazing Fast UI**: Custom-built Dark-mode aesthetic with bouncy CSS animations, fluid chat bubbles, scroll management, and clean input handling.
- **Text Mode (`meta-llama/Meta-Llama-3-8B-Instruct`)**: Toggle into Text Mode to engage in deep conversational queries using an uncensored OpenAI-compatible payload schema natively routed to Llama-3.
- **Image Mode (`black-forest-labs/FLUX.1-schnell`)**: Toggle to invoke a powerful Stable-Diffusion pipeline! Type an image concept, and the bot will cleanly render the High-Res result as a blob natively returned into a beautiful chat bubble.

## 🚀 Getting Started

To run this application properly, you must use a free **Hugging Face API Token** because the models run natively via their Serverless Inference Router endpoints.

### Step 1: Getting your token
1. Go to [HuggingFace](https://huggingface.co/) and create a free account.
2. Go to **Settings > Access Tokens** and click **"Create new token"**.
3. *CRUCIAL REQUIREMENT*: Under the **"Permissions"** checklist, scroll down and explicitly ✅ check the box that says: **Make calls to the Serverless Inference API**. *(If you do not check this, the token will be rejected by the endpoint).*
4. Generate and copy the token.

### Step 2: Injecting your token
1. Open up the `app.js` file in any code or text editor.
2. Locate line 7:
   ```javascript
   const HF_API_TOKEN = "YOUR_HF_TOKEN";
   ```
3. Replace the placeholder string with your real token. 

### Step 3: Run the app!
Simply double-click `index.html` to open it in Chrome, Safari, or Brave. You can jump directly into Text Mode or Image Mode and start conversing with the Neural Networks!

## 🛠️ File Structure
- `index.html`: The semantic backbone containing the main container, headers, mode-switchers, and the empty chat viewport.
- `style.css`: Contains the CSS variables dictating the unified Dark Theme, message bubble logic, and dynamic typing indicator animations. 
- `app.js`: Connects your interface clicks to the underlying `router.huggingface.co/v1/` infrastructure using standard `fetch()` callbacks, cleanly parsing raw JSON and `blob()` URLs.
