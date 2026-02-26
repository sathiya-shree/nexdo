import { useState, useEffect } from "react";
import "./App.css";

// STEP 1: Define your live backend URL here
const API_BASE = "https://nexdo.onrender.com";

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH TASKS FROM CLOUD
  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  const suggestIdea = async () => {
    setLoading(true);
    try {
      // UPDATED URL
      const res = await fetch(`${API_BASE}/suggest?category=${category}`);
      const data = await res.json();
      setTask(data.text);
      setCategory(data.category || category);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task, category: category }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask("");
    setCategory("General");
  };

  const deleteTask = async (id) => {
    // UPDATED URL - Note the backticks for the ID
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    // IMPORTANT: MongoDB uses _id, so we filter by _id
    setTasks(tasks.filter((t) => (t._id || t.id) !== id));
  };

  return (
    <div className="main-viewport">
      <div className="app-card">
        <header className="header">
          <div className="brand">
            <h1>NexDo</h1>
            <p className="subtitle">Organize smarter. Execute better.</p>
          </div>
          <button 
            onClick={suggestIdea} 
            className={`suggest-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "..." : `✨ SUGGEST ${category.toUpperCase()}`}
          </button>
        </header>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={`Initialize ${category} task...`}
            />
            <button onClick={addTask} className="push-btn">ADD</button>
          </div>

          <div className="category-chips">
            {['Work', 'Health', 'Personal', 'Urgent', 'General'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={category === cat ? "active" : ""}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="task-list">
          {tasks.map((t) => (
            /* IMPORTANT: We use t._id here because MongoDB provides _id */
            <div key={t._id || t.id} className={`task-item cat-${t.category?.toLowerCase()}`}>
              <div className="task-info">
                <div className="category-icon">{t.category?.[0] || 'G'}</div>
                <span>{t.text}</span>
              </div>
              <button onClick={() => deleteTask(t._id || t.id)} className="delete-btn">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;