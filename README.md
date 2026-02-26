 NexDo: AI-Powered Productivity

NexDo is a modern, full-stack To-Do application that leverages the power of the **Gemini 1.5 Flash AI** to help you brainstorm tasks. Built with a decoupled architecture, it offers a snappy user interface and a robust cloud-connected backend.

Live Demo
Frontend: [https://nexdo-mocha.vercel.app/](https://nexdo-mocha.vercel.app/)  
Backend API: [https://nexdo.onrender.com/tasks](https://nexdo.onrender.com/tasks)



## ✨ Key Features
* **AI Suggestions:** Feeling stuck? Use the "Suggest" button to get context-aware task ideas based on your selected category (Work, Health, Personal, etc.).
* **Cloud Persistence:** Your tasks are securely stored in **MongoDB Atlas**, meaning they stay saved even if you refresh or switch devices.
* **Decoupled Architecture:** High-performance frontend hosted on **Vercel** communicating with a **Node.js/Express** backend on **Render**.

## 🛠️ Tech Stack
* **Frontend:** React.js, CSS3 (Modern Viewport Design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Intelligence:** Google Gemini API
* **Deployment:** Vercel (Frontend) & Render (Backend)



## 🚀 How It Works
1.  **Request:** When you click "Suggest," the React frontend sends a category (e.g., "Health") to the Express server.
2.  **AI Logic:** The server prompts the **Gemini AI** to "Suggest one unique task for Health."
3.  **Response:** The AI returns a JSON object, which the server passes back to the UI.
4.  **Storage:** When you click "Add," the task is permanently recorded in the MongoDB cloud database.
