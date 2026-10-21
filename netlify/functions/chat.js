// netlify/functions/chat.js
//
// Uses Google's Gemini API free tier -- no cost, no credit card, 1,000-1,500
// requests/day on Gemini Flash (Google's published limits, subject to change).
//
// Setup:
// 1. Get a free key: https://aistudio.google.com/apikey (Google account, no card)
// 2. Netlify dashboard -> Site settings -> Environment variables ->
//    add GEMINI_API_KEY with that key.
// 3. Put public_brain.md at your SITE ROOT (same level as index.html)
// 4. Keep the netlify.toml from before -- it already bundles public_brain.md

const fs = require("fs");
const path = require("path");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let userMessage;
  try {
    const body = JSON.parse(event.body);
    userMessage = body.message;
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  if (!userMessage || typeof userMessage !== "string") {
    return { statusCode: 400, body: "Missing 'message' field" };
  }

  if (!process.env.GEMINI_API_KEY) {
    return { statusCode: 503, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Extended chat is not configured. Portfolio answers remain available." }) };
  }

  let publicBrain = "";
  try {
    publicBrain = fs.readFileSync(
      path.join(__dirname, "..", "..", "public_brain.md"),
      "utf-8"
    );
  } catch (err) {
    console.error("Could not read public_brain.md:", err);
  }

  const systemPrompt = `You are Ajaw, a chatbot on this person's portfolio site.
Answer questions about them using ONLY the information below. If something
isn't covered here, say you don't have that information and suggest the
visitor use the Contact section instead. Never make up project details,
client names, or specifics not present below.

${publicBrain}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return { statusCode: 502, body: "AI service error" };
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: "Internal error" };
  }
};
