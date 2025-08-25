import UserRow from "./UserRow";
const API_BASE = import.meta.env.VITE_API_URL;

export default function UserTable({ users, refresh }) {
  // Filter: ha soo bandhigin superadmin id=1
  const filteredUsers = users.filter(u => !(u.role === "superadmin" && u.id === 1));
  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-light dark:bg-dark rounded shadow font-segoe">
        <table className="w-full min-w-[700px] text-left border-collapse font-segoe">
          <thead className="bg-dark dark:bg-primary text-sm text-light dark:text-dark">
            <tr>
              <th className="p-2 border dark:border-light">Profile</th>
              <th className="p-2 border dark:border-light">Name</th>
              <th className="p-2 border dark:border-light">Email</th>
              <th className="p-2 border dark:border-light">Role</th>
              <th className="p-2 border dark:border-light">Status</th>
              <th className="p-2 border dark:border-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} refresh={refresh} />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="block md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <UserRow key={user.id} user={user} refresh={refresh} mobile />
        ))}
      </div>
    </>
  );
}
