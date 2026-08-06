import axios from "axios";

// Sends the complete conversation to the AI model
// and returns only the generated text response.
export const askAi = async (messages) => {
  try {

    // Validate the input.
    // The OpenRouter API expects a non-empty array of message objects.
    // This prevents unnecessary API calls and runtime errors.
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array is empty.");
    }

    // Make a POST request to the OpenRouter Chat Completions API.
    // The request body contains:
    // 1. model    -> AI model to generate the response.
    // 2. messages -> Conversation history in ChatGPT format.
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages,
      },
      {
        headers: {
          // Bearer token authenticates our request.
          // The API key is stored in .env to avoid exposing secrets.
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          // Tell the server that we're sending JSON data.
          "Content-Type": "application/json",
        },
      }
    );

    // Optional chaining (?.) safely accesses nested properties.
    // If any property is missing, it returns undefined instead of throwing an error.
    const content = response?.data?.choices?.[0]?.message?.content;

    // Even if the request succeeds, verify that the AI actually
    // returned meaningful text instead of an empty response.
    if (!content || !content.trim()) {
      throw new Error("AI returned an empty response.");
    }

    // Return only the AI-generated text.
    // The caller doesn't need the full API response object.
    return content;

  } catch (error) {

    // Log the most useful error information for debugging.
    // If the API returned an error response, print that;
    // otherwise print the JavaScript error message.
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );

    // Re-throw the error so the calling function
    // can decide how to handle it (show toast, retry, etc.).
    throw error;
  }
};