import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";
import rateLimit from "express-rate-limit"; // 👈 add this

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 👇 define the limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10,                  // max 10 requests per minute per IP
  message: { error: "Too many requests, please slow down." },
});

const client = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "MiniMaxAI/MiniMax-M2.5:novita";

app.post("/api/chat", limiter, async (req, res) => { // 👈 plug it in here
  try {
    const { messages } = req.body;
    if (!messages || messages.length === 0)
      return res.status(400).json({ error: "Messages required" });

    const chatCompletion = await client.chatCompletion({
      model: MODEL,
      messages: messages,
    });
    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("HF Chat error:", error);
    res.status(500).json({ error: "Hugging Face chat API request failed" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
