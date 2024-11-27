const form = document.querySelector("form");
const messageInput = document.getElementById("message");
const responseContainer = document.getElementById("response-container");
const messageBtn = document.getElementById("message-btn");

// Fonction pour générer un ID de session unique
function generateSessionId() {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("sessionId", sessionId);
  return sessionId;
}

// Récupérer ou générer un ID de session
const sessionId = localStorage.getItem("sessionId") || generateSessionId();

// Fonction pour mettre à jour l'affichage de l'historique
function updateHistory(role, content) {
  const messageElement = document.createElement("div");
  
  // Ajouter les classes dynamiquement
  if (role === "user") {
    messageElement.classList.add("bg-blue-500", "text-white", "p-4", "mb-2", "rounded-lg");
  } else {
    messageElement.classList.add("bg-gray-300", "text-black", "p-4", "mb-2", "rounded-lg");
  }

  messageElement.textContent = content;
  responseContainer.appendChild(messageElement);
  responseContainer.scrollTop = responseContainer.scrollHeight; // Scroller vers le bas
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Afficher le message utilisateur dans l'historique
  updateHistory("user", userMessage);

  messageBtn.disabled = true;
  messageBtn.innerHTML = "Sending...";

  try {
    // Envoyer la requête au serveur
    const res = await fetch("/api/flowise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionId, // Passer l'ID de session
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    // Afficher la réponse de l'IA dans l'historique
    updateHistory("assistant", data.message);
  } catch (error) {
    // Afficher les erreurs dans l'historique
    updateHistory("assistant", `Error: ${error.message}`);
  } finally {
    messageBtn.disabled = false;
    messageBtn.innerHTML = "Send";
    messageInput.value = "";
  }
});
