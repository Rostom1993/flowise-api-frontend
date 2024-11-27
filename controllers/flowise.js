// In-memory storage for conversation history
const conversationHistory = {};

export const createPrediction = async (req, res) => {
  const { message } = req.body;
  const sessionId = req.headers["x-session-id"] || "default"; // Use a session ID from headers or a default one

  // Initialize conversation history for the session if not already present
  if (!conversationHistory[sessionId]) {
    conversationHistory[sessionId] = [];
  }

  console.log(`Session ID: ${sessionId}`);
  console.log(`Message: ${message}`);

  try {
    // Add the user message to the conversation history
    conversationHistory[sessionId].push({ role: "user", content: message });

    // Prepare the payload with the history
    const flowiseData = {
      question: message,
      history: conversationHistory[sessionId],
    };

    // Call the Flowise API endpoint
    const response = await fetch(
      `${process.env.FLOWISE_URL}/api/v1/prediction/${process.env.FLOW_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 05e63cc5-9dff-47e1-945e-569213e14cba",
        },
        body: JSON.stringify(flowiseData),
      }
    );

    const data = await response.json();

    // Add the AI response to the conversation history
    conversationHistory[sessionId].push({ role: "assistant", content: data.text });

    console.log(`Response: ${data.text}`);

    res.status(200).json({ message: data.text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
