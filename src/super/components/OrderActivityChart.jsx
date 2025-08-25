import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL;
const MAIN_COLOR = "#FB8C00";
const OTHER_COLORS = [
  "#2ECC40", "#F44336", "#3F51B5", "#00B8D9", "#9C27B0", "#FFC107"
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OrderActivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/admin/orders/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setData(res.data))
    .catch(err => setData([])); // On error, show empty chart
  }, []);

  // Always show all days, fill missing with 0
  const chartData = DAYS.map(day => {
    const found = data.find(d => d.date === day);
    return { date: day, orders: found ? found.orders : 0 };
  });

  // Chart always renders, even if all orders are 0
  const maxIndex = chartData.findIndex(d => d.orders === Math.max(...chartData.map(d => d.orders)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="orders">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === maxIndex ? MAIN_COLOR : OTHER_COLORS[index % OTHER_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
