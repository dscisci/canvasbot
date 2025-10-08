# Chatbot Example - Google Gemini Integration

## Overview
A Flask-based chatbot web application that provides a mobile-friendly chat interface powered by Google's Gemini AI. The app features real-time streaming responses for a smooth conversational experience.

**Current Status**: Fully functional and running locally on Replit

## Project Architecture

### Technology Stack
- **Backend**: Python 3.12, Flask 2.3+
- **AI Service**: Google Gemini (gemini-2.0-flash model)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Streaming**: Server-Sent Events via NDJSON format

### Key Files & Structure
```
.
├── app.py                 # Flask application with Gemini API integration
├── templates/
│   └── index.html        # Main chat interface template
├── static/
│   ├── chat.js          # Client-side chat logic with streaming
│   └── styles.css       # Mobile-friendly styling
├── requirements.txt      # Python dependencies
└── .env.example         # Environment variable template
```

### How It Works
1. **Frontend** (`static/chat.js`): Sends full conversation history to backend on each message
2. **Backend** (`app.py`): Relays chat requests to Gemini API and streams responses back as NDJSON
3. **Streaming**: Server sends incremental text chunks as they arrive from Gemini
4. **UI Updates**: JavaScript updates the chat interface in real-time as chunks arrive

## Recent Changes (October 8, 2025)
1. Imported from GitHub repository (mcough2/chatbox-example)
2. Configured Flask to work with Replit's iframe proxy environment
3. Added cache-control headers to prevent caching issues in Replit
4. Set up Flask Server workflow on port 5000
5. Added gunicorn to requirements.txt (for future production use if needed)

## Configuration

### Required Environment Variables
- `GEMINI_API_KEY` (Required): Google AI Studio API key - already configured in Replit Secrets
- `GEMINI_MODEL` (Optional): Defaults to "gemini-2.0-flash"

### Replit-Specific Modifications
- Added `@app.after_request` handler to set no-cache headers for iframe compatibility
- Flask server configured to run on `0.0.0.0:5000` for proper Replit proxy routing

## Running the Application

### Development (Current Setup)
The Flask Server workflow is configured to run automatically:
```bash
python app.py
```
The app runs on port 5000 and is accessible via Replit's webview.

### Manual Run
```bash
pip install -r requirements.txt
python app.py
```

## Dependencies
Core packages:
- flask>=2.3,<3
- google-generativeai>=0.7,<0.8
- python-dotenv>=1.0,<2
- gunicorn>=20.1,<22 (for production deployment)

## User Preferences
- **Purpose**: Local testing only, no deployment needed
- **Testing**: Functional verification via screenshot and server logs

## API Information
- **Service**: Google AI Studio (Gemini API)
- **Model**: gemini-2.0-flash
- **API Key**: Managed via Replit Secrets
- **Documentation**: https://aistudio.google.com/app/apikey

## Notes
- The application handles streaming responses properly through NDJSON format
- Cache-control headers ensure UI updates are visible in Replit's iframe
- Error messages from Gemini API surface directly in the chat interface
- Conversation context is maintained client-side and sent with each request
