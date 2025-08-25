import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OrderActivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/admin/orders/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error("Activity fetch failed:", err));
  }, []);

  if (!data.length) return <p className="text-gray-500 dark:text-gray-300">Loading chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        style={{
          backgroundColor: 'transparent'
        }}
      >
        <XAxis 
          dataKey="date"
          stroke="#999" 
        />
        <YAxis 
          allowDecimals={false}
          stroke="#999"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#111',
            color: '#fff',
            borderRadius: '4px',
            border: 'none',
          }}
        />
        <Bar dataKey="orders" fill="#FB8C00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
