import { convertToCSV, downloadCSV } from "@/utils/csvHelper";

export default function ExportCSVButton({ data }) {
  const handleExport = () => {
    const filtered = data
      .filter(user => user.role !== "superadmin")
      .map(user => ({
        ...user,
        created_at: user.created_at
          ? new Date(user.created_at).toLocaleString()
          : "N/A",
      }));

    const csv = convertToCSV(filtered);

    const today = new Date();
    const filename = `users-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.csv`;

    downloadCSV(csv, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded"
    >
      📄 Export CSV
    </button>
  );
}
