// ✅ OrdersTrendChart.jsx - Responsive Chart
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function OrdersTrendChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 col-span-2">
      <h2 className="text-lg font-bold mb-2">📈 Orders Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#EC6325" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
