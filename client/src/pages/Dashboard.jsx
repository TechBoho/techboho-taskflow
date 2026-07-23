import { useEffect, useState } from "react";
import API from "../services/api";
import TaskCharts from "../components/TaskCharts";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editingTask, setEditingTask] = useState(null);

  const [editData, setEditData] = useState({
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  category: "personal",
});

  const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
  category: "personal",
});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser?.token) {
      fetchTasks(storedUser.token);
    }
  }, []);

  const fetchTasks = async (token) => {
    const response = await API.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(response.data);
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const response = await API.post("/tasks", taskData, {
      headers: { Authorization: `Bearer ${storedUser.token}` },
    });

    setTasks([response.data, ...tasks]);

    setTaskData({
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
  category: "personal",
});
  };

  const startEditing = (task) => {
    setEditingTask(task);

    setEditData({
  title: task.title,
  description: task.description,
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
  category: task.category || "personal",
});
  };

  const cancelEditing = () => {
    setEditingTask(null);

    setEditData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const response = await API.put(
      `/tasks/${editingTask._id}`,
      editData,
      {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      }
    );

    setTasks(
      tasks.map((task) =>
        task._id === editingTask._id ? response.data : task
      )
    );

    cancelEditing();
  };

  const handleDeleteTask = async (taskId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    await API.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${storedUser.token}` },
    });

    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const response = await API.put(
      `/tasks/${taskId}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      }
    );

    setTasks(
      tasks.map((task) =>
        task._id === taskId ? response.data : task
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const filteredTasks = tasks
  .filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((task) =>
    categoryFilter === "all"
      ? true
      : task.category === categoryFilter
  )
  .sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }

    if (sortBy === "dueDate") {
      return (
        new Date(a.dueDate || "9999-12-31") -
        new Date(b.dueDate || "9999-12-31")
      );
    }

    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <h1>TechBoho TaskFlow</h1>
          {user && <p>Welcome back, {user.name}</p>}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalTasks}</h3>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h3>{pendingTasks}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h3>{inProgressTasks}</h3>
          <p>In Progress</p>
        </div>

        <div className="stat-card">
          <h3>{completedTasks}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="progress-card">
  <div className="progress-header">
    <h3>Task Completion Progress</h3>
    <span>{completionPercentage}%</span>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${completionPercentage}%` }}
    ></div>
  </div>
  </div>

  <TaskCharts tasks={tasks} />

      <form className="task-form" onSubmit={handleCreateTask}>
        <h2>Create New Task</h2>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={taskData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Task description"
          value={taskData.description}
          onChange={handleChange}
        />

  <select
  name="priority"
  value={taskData.priority}
  onChange={handleChange}
>
  <option value="low">Low Priority</option>
  <option value="medium">Medium Priority</option>
  <option value="high">High Priority</option>
</select>

<select
  name="category"
  value={taskData.category}
  onChange={handleChange}
>
  <option value="personal">Personal</option>
  <option value="work">Work</option>
  <option value="fitness">Fitness</option>
  <option value="trading">Trading</option>
  <option value="learning">Learning</option>
</select>

        <input
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
        />

        <button className="submit-btn" type="submit">
          Add Task
        </button>
      </form>

      {editingTask && (
        <form className="task-form edit-form" onSubmit={handleSaveEdit}>
          <h2>Edit Task</h2>

          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            required
          />

          <input
            type="text"
            name="description"
            value={editData.description}
            onChange={handleEditChange}
          />

          <select
            name="priority"
            value={editData.priority}
            onChange={handleEditChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
          name="category"
          value={editData.category}
          onChange={handleEditChange}
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="fitness">Fitness</option>
          <option value="trading">Trading</option>
          <option value="learning">Learning</option>
        </select>

          <input
            type="date"
            name="dueDate"
            value={editData.dueDate}
            onChange={handleEditChange}
          />

          <button className="submit-btn" type="submit">
            Save Changes
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={cancelEditing}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="search-controls">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="search-input"
  >
    <option value="newest">Newest</option>
    <option value="priority">Priority</option>
    <option value="dueDate">Due Date</option>
    <option value="status">Status</option>
  </select>
  <select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="search-input"
>
  <option value="all">All Categories</option>
  <option value="trading">Trading</option>
  <option value="fitness">Fitness</option>
  <option value="work">Work</option>
  <option value="personal">Personal</option>
  <option value="learning">Learning</option>
</select>
  </div>

      <h2>Your Tasks</h2>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks found.</p>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>

              <div className="task-meta">
                <span className={`badge priority-${task.priority}`}>
                  {task.priority}
                </span>

                <span className="badge">
                {task.category || "personal"}
              </span>

                <span className={`badge status-${task.status}`}>
                  {task.status}
                </span>
              </div>

              <select
                value={task.status}
                onChange={(e) =>
                  handleUpdateStatus(task._id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                type="button"
                className="edit-btn"
                onClick={() => startEditing(task)}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;