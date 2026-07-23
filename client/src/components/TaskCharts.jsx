import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#38bdf8", "#f59e0b", "#22c55e"];

function TaskCharts({ tasks }) {
  const statusData = [
    {
      name: "Pending",
      value: tasks.filter((t) => t.status === "pending").length,
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "in-progress").length,
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
    },
  ];

  const categoryData = [
    {
      category: "Work",
      total: tasks.filter((t) => t.category === "work").length,
    },
    {
      category: "Trading",
      total: tasks.filter((t) => t.category === "trading").length,
    },
    {
      category: "Fitness",
      total: tasks.filter((t) => t.category === "fitness").length,
    },
    {
      category: "Personal",
      total: tasks.filter((t) => t.category === "personal").length,
    },
    {
      category: "Learning",
      total: tasks.filter((t) => t.category === "learning").length,
    },
  ];

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Task Status</h3>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              outerRadius={90}
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Tasks by Category</h3>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="category" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#38bdf8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TaskCharts;