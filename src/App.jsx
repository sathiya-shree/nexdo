import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // UPDATED: Now accepts the current category to send to the AI
  const suggestIdea = async () => {
    setLoading(true);
    try {
      // We pass the current category state to the backend route
      const res = await fetch(`http://localhost:5000/suggest?category=${category}`);
      const data = await res.json();
      
      // Update the input field with the AI's response
      setTask(data.text);
      // Synchronize the category (in case the AI suggests a slight change)
      setCategory(data.category || category);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    const res = await fetch("http://localhost:5000/tasks", {
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
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="main-viewport">
      <div className="app-card">
        <header className="header">
          <div className="brand">
            <h1>NexDo</h1>
            <p className="subtitle">Organize smarter. Execute better.</p>
          </div>
          {/* Button label now shows which category the AI will help with */}
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
            <div key={t.id} className={`task-item cat-${t.category?.toLowerCase()}`}>
              <div className="task-info">
                <div className="category-icon">{t.category?.[0] || 'G'}</div>
                <span>{t.text}</span>
              </div>
              <button onClick={() => deleteTask(t.id)} className="delete-btn">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;