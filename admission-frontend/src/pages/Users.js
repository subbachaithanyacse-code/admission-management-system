import React, { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Staff");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("admissionUsers");

    if (data) {
      setUsers(JSON.parse(data));
    } else {
      const initialUsers = [
        {
          id: 1,
          name: "Administrator",
          email: "admin@college.edu",
          role: "Admin",
          status: "Active"
        },
        {
          id: 2,
          name: "Admission Staff",
          email: "staff@college.edu",
          role: "Staff",
          status: "Active"
        }
      ];

      setUsers(initialUsers);
      localStorage.setItem(
        "admissionUsers",
        JSON.stringify(initialUsers)
      );
    }
  }, []);

  const saveUsers = (data) => {
    setUsers(data);
    localStorage.setItem(
      "admissionUsers",
      JSON.stringify(data)
    );
  };

  const addUser = (e) => {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "") {
      alert("Please enter name and email");
      return;
    }

    const newUser = {
      id: users.length === 0 ? 1 : users[users.length - 1].id + 1,
      name: name,
      email: email,
      role: role,
      status: status
    };

    saveUsers([...users, newUser]);

    setName("");
    setEmail("");
    setRole("Staff");
    setStatus("Active");
  };

  const deleteUser = (id) => {
    if (window.confirm("Delete this user?")) {
      const data = users.filter((user) => user.id !== id);
      saveUsers(data);
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.role.toLowerCase().includes(text)
    );
  });

  return (
    <div>

      <h1>Users</h1>

      <p style={{ color: "#64748b" }}>
        Manage system users
      </p>

      <div
        style={{
          background: "white",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px"
        }}
      >

        <h2>Add User</h2>

        <form onSubmit={addUser}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Student">Student</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Add User
          </button>

        </form>

      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px"
        }}
      >

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            boxSizing: "border-box",
            border: "1px solid #cbd5e1",
            borderRadius: "6px"
          }}
        />

      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px"
        }}
      >

        <h2>User List</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >

          <thead>
            <tr>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Role</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (
              <tr key={user.id}>

                <td style={cellStyle}>
                  {user.id}
                </td>

                <td style={cellStyle}>
                  {user.name}
                </td>

                <td style={cellStyle}>
                  {user.email}
                </td>

                <td style={cellStyle}>
                  {user.role}
                </td>

                <td style={cellStyle}>
                  {user.status}
                </td>

                <td style={cellStyle}>

                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const inputStyle = {
  padding: "10px",
  marginRight: "10px",
  marginBottom: "10px",
  border: "1px solid #cbd5e1",
  borderRadius: "6px"
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "left"
};

export default Users;
