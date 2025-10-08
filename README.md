# Chatbot Example

A minimal Python web app that provides a mobile-friendly chat interface backed by Google Gemini. Built with Flask and vanilla HTML/CSS/JS with streaming responses.

## Prerequisites

- macOS, Linux, or Windows
- Python 3.9+
- A Google AI Studio API key with access to a Gemini chat-capable model (e.g., `gemini-2.0-flash`)

### Installing Python and pip on macOS with Homebrew

1. Install Apple Command Line Tools (required by Homebrew)
   ```bash
   xcode-select --install
   ```
   - If they are already installed, you'll see a message indicating so. You can verify with:
     ```bash
     xcode-select -p
     ```
     which should print a path like `/Library/Developer/CommandLineTools`.

2. Install [Homebrew](https://brew.sh/) if you do not already have it.
3. Verify whether Python is already available:
   ```bash
   python3 --version
   pip3 --version
   ```
4. If either command fails, install Python (which includes pip) via Homebrew:
   ```bash
   brew update
   brew install python
   ```
5. Open a new terminal (or reload your shell) and confirm the installation again:
   ```bash
   python3 --version
   pip3 --version
   ```

## Step-by-step setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mcough2/chatbox-example.git canvasbot
   cd canvasbot
   ```
2. **Create and activate a virtual environment** (recommended)
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. **Install project dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a Google AI Studio API key**
   - Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">https://aistudio.google.com/app/apikey</a>
   - Generate a key and copy it (you can revoke or rotate later).
5. **Add your Gemini API key**
   ```bash
   cp .env.example .env
   ```
   - Open the new `.env` file in your editor and replace `your-gemini-api-key` with the key you created earlier.
     - On macOS you can run `open .env` to edit it with TextEdit from the terminal.
   - Save the changes after updating the file.
   - Leave `GEMINI_MODEL` as `gemini-2.0-flash` unless you've enabled and prefer another Gemini model.
   The included `python-dotenv` dependency loads this file automatically on startup.
6. **Run the development server**
   ```bash
   flask --app app run
   # or: python app.py  # inside the virtualenv `python` points to Python 3
   ```
7. **Open the app in your browser**
   - Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000)
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
