import { useOutletContext } from "react-router-dom";
import OrderSummaryCard from "../components/OrderSummaryCard";
import OrderActivityChart from "../components/OrderActivityChart";

export default function AdminDashboard() {
  const { profile } = useOutletContext();

  return (
    <div className="space-y-6 font-segoe bg-light dark:bg-dark p-4 rounded-xl shadow">

      {/* ✅ Order Summary Cards */}
      <OrderSummaryCard />

      {/* ✅ Order Activity Chart */}
      <OrderActivityChart />
    </div>
  );
}
