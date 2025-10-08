const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const messageTemplate = document.getElementById("messageTemplate");
const chatOverlay = document.getElementById("chatOverlay");
const assistantTab = document.getElementById("assistantTab");
const closeChatBtn = document.getElementById("closeChatBtn");

const conversation = [];

// Toggle chat overlay
assistantTab.addEventListener("click", () => {
  chatOverlay.classList.add("active");
  setTimeout(() => chatInput.focus(), 100);
});

closeChatBtn.addEventListener("click", () => {
  chatOverlay.classList.remove("active");
});

function appendMessage(role, content = "") {
  const fragment = messageTemplate.content.cloneNode(true);
  const bubble = fragment.querySelector(".bubble");
  const roleEl = fragment.querySelector(".bubble__role");
  const textEl = fragment.querySelector(".bubble__text");

  bubble.classList.add(role === "user" ? "bubble--user" : "bubble--assistant");
  roleEl.textContent = role;
  textEl.textContent = content;

  chatLog.appendChild(fragment);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });

  return { bubble, roleEl, textEl };
}

function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  chatInput.disabled = isLoading;
  sendButton.textContent = isLoading ? "Sending..." : "Send";
}

async function sendMessage(message) {
  conversation.push({ role: "user", content: message });
  appendMessage("user", message);

  setLoadingState(true);

  const assistantNodes = appendMessage("assistant", "");
  let assistantText = "";
  let errorMessage = null;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: conversation }),
    });

    if (!response.ok) {
      let payload;
      try {
        payload = await response.json();
      } catch (err) {
        // ignore JSON parse errors and fall back to status text
      }
      const error = payload?.error || response.statusText || "Something went wrong.";
      throw new Error(error);
    }

    if (!response.body) {
      throw new Error("Streaming is not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const handleData = (data) => {
      if (data.delta) {
        assistantText += data.delta;
        assistantNodes.textEl.textContent = assistantText;
      }

      if (data.reply) {
        assistantText = data.reply;
        assistantNodes.textEl.textContent = assistantText;
      }

      if (data.error) {
        errorMessage = data.error;
      }
    };

    const processBuffer = (text) => {
      buffer += text;
      const parts = buffer.split("\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        if (!part.trim()) {
          continue;
        }

        try {
          handleData(JSON.parse(part));
        } catch (err) {
          continue;
        }
      }
    };

    const flushBuffer = () => {
      if (!buffer.trim()) {
        buffer = "";
        return;
      }

      try {
        handleData(JSON.parse(buffer));
      } catch (err) {
        // ignore malformed trailing data
      }

      buffer = "";
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      processBuffer(decoder.decode(value, { stream: true }));
    }

    processBuffer(decoder.decode());
    flushBuffer();
  } catch (err) {
    errorMessage = err.message || "Unexpected error.";
  } finally {
    setLoadingState(false);
  }

  if (errorMessage) {
    conversation.pop();
    assistantNodes.textEl.textContent = `⚠️ ${errorMessage}`;
    return;
  }

  if (!assistantText.trim()) {
    conversation.pop();
    assistantNodes.textEl.textContent = "⚠️ No reply returned from the assistant.";
    return;
  }

  conversation.push({ role: "assistant", content: assistantText });
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) {
    return;
  }

  chatInput.value = "";
  chatInput.style.height = "auto";
  sendMessage(value);
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
