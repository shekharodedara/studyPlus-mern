const express = require("express");
const axios = require("axios");
const router = express.Router();

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const GEMINI =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
router.post("/ask-ai", async (req, res) => {
  const { chatHistory, question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "No valid question provided." });
  }
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": process.env.GEMINI_API_KEY,
  };
  const messages = Array.isArray(chatHistory) ? [...chatHistory] : [];
  messages.push({ role: "user", parts: [{ text: question }] });
  const payload = {
    contents: messages,
    systemInstruction: {
      parts: [
        {
          text: "You are an AI tutor on an edtech platform. Help learners explore and satisfy their curiosity. Always stay educational, but encourage exploration.",
        },
      ],
    },
  };
  for (let i = 0; i < 3; i++) {
    try {
      const { data } = await axios.post(GEMINI, payload, { headers });
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return res.json({ answer });
    } catch (err) {
      const s = err?.response?.status;
      if ((s === 503 || s === 429) && i < 2) {
        await wait(1000 * 2 ** i);
        continue;
      }
      return res
        .status(500)
        .json({ error: err?.response?.data?.error?.message || "AI failed." });
    }
  }
});

module.exports = router;
