// ✅ UserStatusChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function UserStatusChart({ data }) {
  const pieData = [
    { name: "Active", value: data.active },
    { name: "Inactive", value: data.inactive },
  ];
  const COLORS = ["#003060", "#FF4500"];

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
      <h2 className="text-lg font-bold mb-2">👤 User Status</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}