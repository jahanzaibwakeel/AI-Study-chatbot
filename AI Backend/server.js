// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.post("/api/chat", async (req, res) => {
//   try {
//     const { messages } = req.body;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: messages,
//     });

//     res.json({
//       reply: completion.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Hugging Face API endpoint
const HUGGINGFACE_API = "https://router.huggingface.co/models/MiniMaxAI/MiniMax-M2.5?inference_provider=novita"; // replace with your model

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // Combine all messages into a single prompt string
    const prompt = messages.map(m => m.content).join("\n");

    const response = await axios.post(
      HUGGINGFACE_API,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Hugging Face API returns an array with generated text
    const reply = response.data[0]?.generated_text || "No reply";

    res.json({ reply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with Hugging Face API" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});