
import React, { useState, useEffect } from "react";

function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    setRoles(savedRoles);
  }, []);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const handleSaveRole = (role) => {
    if (!role.name || role.permissions.length === 0) {
      setError("Role name and permissions are required.");
      return;
    }

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...role, id: r.id } : r))
      );
      setEditingRole(null);
    } else {
      setRoles((prev) => [...prev, { ...role, id: Date.now() }]);
    }
    setShowForm(false);
    setError("");
  };

  const handleDelete = (id) => {
    const newRoles = roles.filter((r) => r.id !== id);
    setRoles(newRoles);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-100 to-indigo-200 shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-800">Role Management</h1>
          <button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
            onClick={() => setShowForm(true)}
          >
            {editingRole ? "Edit Role" : "Add Role"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500 text-white p-4 rounded-lg shadow-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-teal-400 to-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-lg">Role Name</th>
                <th className="px-6 py-3 text-left text-lg">Permissions</th>
                <th className="px-6 py-3 text-left text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr
                  key={role.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                  } hover:bg-gray-300 transition duration-150`}
                >
                  <td className="px-6 py-4 border">{role.name}</td>
                  <td className="px-6 py-4 border">
                    {role.permissions.join(", ")}
                  </td>
                  <td className="px-6 py-4 border flex gap-3">
                    <button
                      className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 transform transition duration-300"
                      onClick={() => {
                        setEditingRole(role);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:scale-105 transform transition duration-300"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Role Form */}
        {showForm && (
          <RoleForm
            onClose={() => {
              setEditingRole(null);
              setShowForm(false);
            }}
            onSave={handleSaveRole}
            role={editingRole}
          />
        )}
      </div>
    </div>
  );
}

function RoleForm({ onClose, onSave, role }) {
  const predefinedPermissions = ["Read", "Write", "Delete"];
  const [name, setName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState(role?.permissions || []);
  const [formError, setFormError] = useState("");

  const handleTogglePermission = (permission) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = () => {
    if (!name || permissions.length === 0) {
      setFormError("Role name and at least one permission are required.");
      return;
    }

    onSave({ name, permissions });
    setFormError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-800">
          {role ? "Edit Role" : "Add Role"}
        </h2>
        <input
          type="text"
          placeholder="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
        />
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Permissions
          </label>
          <div className="space-y-2">
            {predefinedPermissions.map((permission) => (
              <label
                key={permission}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={permissions.includes(permission)}
                  onChange={() => handleTogglePermission(permission)}
                  className="cursor-pointer"
                />
                <span>{permission}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Error */}
        {formError && (
          <div className="bg-rose-500 text-white p-4 rounded-md shadow-md">
            <strong>Error:</strong> {formError}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-green-400 to-lime-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleTable;
