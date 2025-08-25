export default function StatusFilter({ onStatusChange }) {
  return (
    <select
      className="border px-8 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      onChange={(e) => onStatusChange(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}
