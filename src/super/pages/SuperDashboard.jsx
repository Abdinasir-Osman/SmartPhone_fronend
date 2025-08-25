import { useState, useEffect } from "react";
import OrderSummaryCard from "../components/OrderSummaryCard";
import OrderActivityChart from "../components/OrderActivityChart";
import AnalyticsSummaryCard from "../components/AnalyticsSummaryCard";

export default function SuperDashboard() {
  return (
    <div className="grid gap-6 font-segoe">
      <OrderSummaryCard />
      <div className="bg-light dark:bg-dark p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-dark dark:text-light font-segoe">
          Order Activity
        </h2>
        <OrderActivityChart />
      </div>
    </div>
  );
}
