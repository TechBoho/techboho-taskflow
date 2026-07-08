import Task from "../models/Task.js";

// @desc    Get logged-in user's tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// @desc    Create new task for logged-in user
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
      category,
    });

        res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// @desc    Update logged-in user's task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

// @desc    Delete logged-in user's task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};