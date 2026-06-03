import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
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
    });
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

  return (
    <div>
      <h1>TechBoho TaskFlow Dashboard</h1>

      {user && <h2>Welcome, {user.name}</h2>}

      <button onClick={handleLogout}>Logout</button>

      <h3>Create Task</h3>

      <form onSubmit={handleCreateTask}>
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
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      <h3>Your Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <button onClick={() => handleDeleteTask(task._id)}>
            Delete
            </button>

            <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;