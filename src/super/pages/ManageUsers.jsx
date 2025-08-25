import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserTable from "../components/UserTable";
import SearchBar from "../components/SearchBar";
import RoleFilter from "../components/RoleFilter";
import StatusFilter from "../components/StatusFilter";
import ExportCSVButton from "@/super/components/ExportCSVButton";
const API_BASE = import.meta.env.VITE_API_URL;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(0); // ✅ Trigger refresh manually

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/super/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          role: role,
          status: status,
        },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto fetch when search/role/status/refresh changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, role, status, triggerRefresh]);

  // ✅ Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const refresh = () => {
    setTriggerRefresh((prev) => prev + 1);
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow font-segoe text-dark dark:text-light">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white font-segoe">Manage Users</h2>

      {/* ✅ Filters in the center */}
      <div className="flex justify-center items-center flex-wrap gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <RoleFilter onRoleChange={handleRoleChange} />
        <StatusFilter onStatusChange={handleStatusChange} />
        <ExportCSVButton data={users} />

      </div>

      {/* ✅ Table + Auto refresh */}
      <UserTable users={users} refresh={refresh} />

    </div>
  );
}
