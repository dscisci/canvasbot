import json
import os
from typing import Dict, List, Optional, Tuple

from flask import Flask, Response, jsonify, render_template, request, stream_with_context

try:
    import google.generativeai as genai
except ImportError as exc:  # pragma: no cover - import guard for clearer error message
    raise RuntimeError("The 'google-generativeai' package is required. Install dependencies from requirements.txt.") from exc

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    # python-dotenv is optional; environment variables can be set manually instead.
    pass

app = Flask(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-pro")


def _ensure_gemini_configured() -> None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Create an API key in Google AI Studio and set the env var before running."
        )

    genai.configure(api_key=api_key)


def _build_messages(payload: Dict) -> List[Dict[str, str]]:
    messages = payload.get("messages")
    if isinstance(messages, list):
        cleaned: List[Dict[str, str]] = []
        for item in messages:
            if not isinstance(item, dict):
                continue
            role = item.get("role")
            content = item.get("content")
            if role in {"user", "assistant", "system"} and isinstance(content, str) and content.strip():
                cleaned.append({"role": role, "content": content.strip()})
        if cleaned:
            return cleaned

    user_message = payload.get("message")
    if isinstance(user_message, str) and user_message.strip():
        return [{"role": "user", "content": user_message.strip()}]

    raise ValueError("No valid message provided.")


def _translate_for_gemini(messages: List[Dict[str, str]]) -> Tuple[Optional[str], List[Dict]]:
    system_instruction: Optional[str] = None
    contents: List[Dict] = []

    for entry in messages:
        role = entry["role"]
        text = entry["content"]

        if role == "system" and system_instruction is None:
            system_instruction = text
            continue

        gemini_role = "user" if role == "user" else "model"
        contents.append({"role": gemini_role, "parts": [{"text": text}]})

    if not contents:
        raise ValueError("Conversation history is empty after filtering messages.")

    if contents[-1]["role"] != "user":
        raise ValueError("The latest message must come from the user.")

    return system_instruction, contents


def _gemini_stream(messages: List[Dict[str, str]]):
    try:
        system_instruction, contents = _translate_for_gemini(messages)
        model = genai.GenerativeModel(model_name=GEMINI_MODEL, system_instruction=system_instruction)
        response = model.generate_content(contents, stream=True)

        full_reply_parts: List[str] = []
        for chunk in response:
            text = getattr(chunk, "text", None)
            if not text:
                continue
            full_reply_parts.append(text)
            yield json.dumps({"delta": text}) + "\n"

        yield json.dumps({"reply": "".join(full_reply_parts), "done": True}) + "\n"
    except Exception as exc:  # pragma: no cover - surface API/library errors to the client
        yield json.dumps({"error": str(exc), "done": True}) + "\n"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat_completion():
    try:
        _ensure_gemini_configured()
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500

    payload = request.get_json(silent=True) or {}

    try:
        messages = _build_messages(payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    stream = stream_with_context(_gemini_stream(messages))
    return Response(stream, mimetype="application/x-ndjson")


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
