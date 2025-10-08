# FlexWave - Mobile Banking App Prototype with AI Assistant

## Overview
A Flask-based mobile banking app prototype featuring an integrated AI assistant powered by Google's Gemini AI. The app presents a non-functional banking interface (FlexWave) with a fully functional AI chatbot accessible via the bottom navigation.

**Current Status**: Fully functional prototype running locally on Replit

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
1. **Mobile UI**: FlexWave banking app prototype with non-functional interface elements (balance cards, quick actions, family finances)
2. **AI Assistant Access**: Click the "Assistant" tab in the bottom navigation to open the chat overlay
3. **Chat Functionality** (`static/chat.js`): Sends full conversation history to backend on each message
4. **Backend** (`app.py`): Relays chat requests to Gemini API and streams responses back as NDJSON
5. **Streaming**: Server sends incremental text chunks as they arrive from Gemini
6. **UI Updates**: JavaScript updates the chat interface in real-time as chunks arrive

## Recent Changes (October 8, 2025)
1. Imported from GitHub repository (mcough2/chatbox-example)
2. Configured Flask to work with Replit's iframe proxy environment
3. Added cache-control headers to prevent caching issues in Replit
4. Set up Flask Server workflow on port 5000
5. Added gunicorn to requirements.txt (for future production use if needed)
6. Transformed simple chat interface into FlexWave mobile banking app prototype
7. Integrated AI assistant as an overlay accessible via bottom navigation "Assistant" tab
8. Designed mobile UI matching provided FlexWave banking app screenshot with purple theme

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
- **Design**: Mobile banking app prototype (FlexWave) with non-functional UI and integrated AI assistant
- **UI/UX**: Purple theme matching provided screenshot, chatbot accessible via "Assistant" tab
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
