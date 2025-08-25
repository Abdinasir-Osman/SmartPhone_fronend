export default function RoleFilter({ onRoleChange }) {
  return (
    <select
      className="border px-9 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      onChange={(e) => onRoleChange(e.target.value)}
    >
      <option value="">All Roles</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="superadmin">superadmin</option>
    </select>
  );
}
