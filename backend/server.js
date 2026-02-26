require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors({origin: "https://nexdo-mocha.vercel.app"}));
app.use(express.json());

// 1. CLOUD DATABASE CONNECTION
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("☁️ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Cloud Connection Error:", err));

// 2. DATA SCHEMA
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, default: "General" },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

// 3. API ROUTES
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    category: req.body.category || "General",
  });
  const savedTask = await newTask.save();
  res.json(savedTask);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted from cloud." });
});

// AI SUGGEST ROUTE (Category-Aware)
app.get("/suggest", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const requestedCategory = req.query.category || "General";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;

    const prompt = `Suggest one unique, specific task for: ${requestedCategory}. 
    Return ONLY JSON: {"text": "specific task", "category": "${requestedCategory}"}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 1.0 }
      }),
    });

    const data = await response.json();
    const aiRawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const jsonMatch = aiRawText.match(/\{[\s\S]*\}/);
    res.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    res.json({ text: "Review your cloud tasks", category: "General" });
  }
});

app.listen(PORT, () => console.log(`🚀 Core live on http://localhost:${PORT}`));