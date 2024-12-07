



import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    setUsers(savedUsers);
    setRoles(savedRoles);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleSaveUser = (user) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...user, id: u.id } : u))
      );
      setEditingUser(null);
    } else {
      setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <button
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            onClick={() => setShowForm(true)}
          >
            {editingUser ? "Edit User" : "Add User"}
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-lg">Name</th>
                <th className="px-6 py-4 text-left text-lg">Email</th>
                <th className="px-6 py-4 text-left text-lg">Role</th>
                <th className="px-6 py-4 text-left text-lg">Status</th>
                <th className="px-6 py-4 text-left text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-blue-100 transition duration-150`}
                >
                  <td className="px-6 py-4 border">{user.name}</td>
                  <td className="px-6 py-4 border">{user.email}</td>
                  <td className="px-6 py-4 border">{user.role}</td>
                  <td className="px-6 py-4 border">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border flex gap-3">
                    <button
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg hover:scale-105 transform transition duration-300"
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:scale-105 transform transition duration-300"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Form */}
        {showForm && (
          <UserForm
            onClose={() => {
              setEditingUser(null);
              setShowForm(false);
            }}
            onSave={handleSaveUser}
            roles={roles}
            user={editingUser}
          />
        )}
      </div>
    </div>
  );
}

export default UserTable;
