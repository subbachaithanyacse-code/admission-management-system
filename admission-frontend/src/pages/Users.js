import React, { useState } from "react";

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Administrator",
      email: "admin@college.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Admission Staff",
      email: "staff@college.com",
      role: "Staff",
      status: "Active",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Staff",
    status: "Active",
  });

  // Open Add User
  const openAddUser = () => {
    setEditingUser(null);

    setForm({
      name: "",
      email: "",
      role: "Staff",
      status: "Active",
    });

    setShowModal(true);
  };

  // Open Edit User
  const openEditUser = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setShowModal(true);
  };

  // Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // Save User
  const saveUser = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Please enter name and email.");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...form,
              }
            : user
        )
      );

      alert("User updated successfully.");
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
      };

      setUsers([...users, newUser]);

      alert("User added successfully.");
    }

    setShowModal(false);
  };

  // Delete User
  const deleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers(users.filter((user) => user.id !== id));

    alert("User deleted successfully.");
  };

  // Toggle Status
  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  // Search + Filter
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.role.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "All" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header">

        <div>
          <h1>👤 Users Management</h1>
          <p>Manage system users and their access roles</p>
        </div>

        <button
          className="add-user-btn"
          onClick={openAddUser}
        >
          ➕ Add User
        </button>

      </div>

      {/* Statistics */}
      <div className="user-stats">

        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <span>Total Users</span>
            <h2>{users.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔐</div>

          <div>
            <span>Admins</span>
            <h2>
              {
                users.filter(
                  (user) => user.role === "Admin"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>

          <div>
            <span>Staff</span>
            <h2>
              {
                users.filter(
                  (user) => user.role === "Staff"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🟢</div>

          <div>
            <span>Active Users</span>
            <h2>
              {
                users.filter(
                  (user) => user.status === "Active"
                ).length
              }
            </h2>
          </div>
        </div>

      </div>

      {/* User Table */}
      <div className="users-container">

        <div className="table-header">

          <div>
            <h2>📋 User List</h2>
            <p>{filteredUsers.length} users found</p>
          </div>

          <div className="filters">

            <input
              type="text"
              placeholder="🔍 Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="search-box"
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="role-filter"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>

          </div>

        </div>

        <div className="table-wrapper">

          <table className="users-table">

            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="no-users"
                  >
                    No users found.
                  </td>
                </tr>

              ) : (

                filteredUsers.map((user, index) => (

                  <tr key={user.id}>

                    <td>{index + 1}</td>

                    <td>
                      <div className="user-name">

                        <div className="avatar">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {user.name}
                        </strong>

                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`role-badge ${user.role.toLowerCase()}`}
                      >
                        {user.role === "Admin"
                          ? "🔐"
                          : "👨‍💼"}{" "}
                        {user.role}
                      </span>
                    </td>

                    <td>

                      <button
                        className={`status-btn ${
                          user.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                        onClick={() =>
                          toggleStatus(user.id)
                        }
                      >
                        {user.status === "Active"
                          ? "🟢 Active"
                          : "🔴 Inactive"}
                      </button>

                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditUser(user)
                          }
                          title="Edit User"
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                          title="Delete User"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add/Edit Modal */}
      {showModal && (

        <div className="modal-overlay">

          <div className="user-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingUser
                    ? "✏️ Edit User"
                    : "➕ Add User"}
                </h2>

                <p>
                  {editingUser
                    ? "Update user information"
                    : "Create a new system user"}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ✕
              </button>

            </div>

            <form onSubmit={saveUser}>

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>Role</label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="Staff">
                      Staff
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>

                </div>

                <div className="form-group">

                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingUser
                    ? "💾 Update User"
                    : "💾 Save User"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* CSS */}
      <style>{`

        .users-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 25px;
          box-sizing: border-box;
        }

        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .users-header h1 {
          margin: 0;
          font-size: 30px;
          color: #1f2937;
        }

        .users-header p {
          margin: 6px 0 0;
          color: #6b7280;
        }

        .add-user-btn {
          border: none;
          background: #2563eb;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .add-user-btn:hover {
          background: #1d4ed8;
        }

        .user-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.06);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .stat-card span {
          color: #6b7280;
          font-size: 13px;
        }

        .stat-card h2 {
          margin: 5px 0 0;
          font-size: 27px;
          color: #111827;
        }

        .users-container {
          background: white;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.06);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
        }

        .table-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 21px;
        }

        .table-header p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .search-box,
        .role-filter {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background: white;
        }

        .search-box {
          width: 230px;
        }

        .search-box:focus,
        .role-filter:focus {
          border-color: #2563eb;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f3f4f6;
          padding: 13px;
          text-align: left;
          font-size: 14px;
          color: #374151;
        }

        .users-table td {
          padding: 13px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #374151;
        }

        .users-table tbody tr:hover {
          background: #f9fafb;
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .role-badge {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .role-badge.admin {
          background: #ede9fe;
          color: #6d28d9;
        }

        .role-badge.staff {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-btn {
          border: none;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .status-btn.active {
          background: #dcfce7;
          color: #15803d;
        }

        .status-btn.inactive {
          background: #fee2e2;
          color: #b91c1c;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 7px;
          cursor: pointer;
        }

        .edit-btn {
          background: #dbeafe;
        }

        .delete-btn {
          background: #fee2e2;
        }

        .no-users {
          text-align: center;
          padding: 30px !important;
          color: #6b7280;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .user-modal {
          width: 100%;
          max-width: 520px;
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-sizing: border-box;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .close-btn {
          border: none;
          background: #f3f4f6;
          width: 34px;
          height: 34px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 17px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 11px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-sizing: border-box;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #2563eb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-btn,
        .save-btn {
          border: none;
          padding: 11px 17px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancel-btn {
          background: #e5e7eb;
          color: #374151;
        }

        .save-btn {
          background: #2563eb;
          color: white;
        }

        @media (max-width: 900px) {
          .user-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .filters {
            width: 100%;
          }

          .search-box {
            flex: 1;
            width: auto;
          }
        }

        @media (max-width: 600px) {
          .users-page {
            padding: 15px;
          }

          .users-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .user-stats {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

      `}</style>

    </div>
  );
}

export default Users;