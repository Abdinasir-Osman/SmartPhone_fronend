// ✅ TopPhonesChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopPhonesChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 col-span-2">
      <h2 className="text-lg font-bold mb-2">📱 Top 5 Ordered Phones</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#EC6325" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}