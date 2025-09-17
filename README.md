# Chatbox Example

A minimal Python web app that provides a mobile-friendly chat interface backed by Google Gemini. Built with Flask and vanilla HTML/CSS/JS with streaming responses.

## Prerequisites

- Python 3.9+
- A Google AI Studio API key with access to a Gemini chat-capable model (e.g., `gemini-pro`)

## Step-by-step setup

1. **Clone the repository**
   ```bash
   git clone <your-fork-url>
   cd chatbox-example
   ```
2. **Create and activate a virtual environment** (recommended)
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use .venv\Scripts\activate
   ```
3. **Install project dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a Google AI Studio API key**
   - Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Generate a key and copy it (you can revoke or rotate later).
5. **Provide your credentials to the app**
   - Option A: export environment variables in your shell
     ```bash
     export GEMINI_API_KEY="your-gemini-api-key"
     export GEMINI_MODEL="gemini-pro"  # optional override
     ```
   - Option B: create a `.env` file in the project root
     ```bash
     GEMINI_API_KEY=your-gemini-api-key
     GEMINI_MODEL=gemini-pro  # optional
     ```
     The included `python-dotenv` dependency loads this file automatically on startup.
6. **Run the development server**
   ```bash
   flask --app app run
   # or: python app.py
   ```
7. **Open the app in your browser**
   - Navigate to [http://localhost:5000](http://localhost:5000)
   - Type a message and watch Gemini stream back its response live.

## How it works

- `app.py` exposes two routes: `/` serves the front-end template and `/api/chat` relays chat requests to Gemini, streaming generation chunks back to the browser as NDJSON.
- The front-end (vanilla JS + CSS) sends the full conversation history on each request so the backend can preserve context and updates the UI incrementally as streaming chunks arrive.
- Environment variables keep credentials out of source control and make it easy to run the app on another machine—just add your own key.

## Customization tips

- Update `static/styles.css` to tweak the look and feel.
- Swap `GEMINI_MODEL` to any chat-capable Gemini model you have access to.
- Adjust `static/chat.js` if you prefer a different streaming protocol (e.g., Server-Sent Events or WebSockets).

## Troubleshooting

- If you see `GEMINI_API_KEY is not set`, double-check that the variable is exported in the same shell where you run Flask, or use a `.env` file.
- Install the dependencies with `pip install -r requirements.txt` if you hit `ModuleNotFoundError` for `flask` or `google.generativeai`.
- Errors returned from Gemini surface in the chat window—handy for diagnosing quota limits or auth issues.
