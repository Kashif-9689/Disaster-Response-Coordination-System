// Enable dragging of chat window
const chatWindow = document.getElementById("chatbot-container");
let isDragging = false;
let offsetX, offsetY;

chatWindow.addEventListener("mousedown", function (e) {
  if (e.target.classList.contains("chatbot-header")) {
    isDragging = true;
    offsetX = e.clientX - chatWindow.offsetLeft;
    offsetY = e.clientY - chatWindow.offsetTop;
  }
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    chatWindow.style.left = (e.clientX - offsetX) + "px";
    chatWindow.style.top = (e.clientY - offsetY) + "px";
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
});

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  document.getElementById("chatbox").appendChild(typing);
  scrollToBottom();
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// Auto suggestions
const suggestions = [
  "How to report a disaster?",
  "How can I register as a volunteer?",
  "Where is the Admin Dashboard?",
  "Show me recent reports."
];

function populateSuggestions() {
  const sugDiv = document.getElementById("suggestions");
  sugDiv.innerHTML = "";
  suggestions.forEach(text => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => sendMessage(text);
    sugDiv.appendChild(btn);
  });
}

function sendMessage(inputText = null) {
  const inputField = document.getElementById("user-input");
  const message = inputText || inputField.value.trim();
  if (message === "") return;

  appendMessage("You", message);
  inputField.value = "";
  showTyping();

  setTimeout(() => {
    hideTyping();
    const botReply = generateBotResponse(message);
    appendMessage("Bot", botReply);
  }, 1000);
}

function appendMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "Bot" ? "bot-message" : "user-message";
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(msgDiv);
  scrollToBottom();
}

function scrollToBottom() {
  const chatbox = document.getElementById("chatbox");
  chatbox.scrollTop = chatbox.scrollHeight;
}

function generateBotResponse(userInput) {
  const msg = userInput.toLowerCase();
  if (msg.includes("report")) return "To report a disaster, click on 'Report a Disaster' on the homepage.";
  if (msg.includes("volunteer")) return "You can register as a volunteer on the 'Volunteer/NGO Registration' page.";
  if (msg.includes("dashboard")) return "Access the Admin Dashboard via the respective button on the homepage.";
  if (msg.includes("help")) return "I'm here to assist you. Ask anything related to disaster reporting or volunteering.";
  return "Sorry, I didn't quite understand. Try asking about reporting, volunteering, or dashboard access.";
}

// Allow Enter key to send message
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  populateSuggestions();
});
