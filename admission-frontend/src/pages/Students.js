import React, { useEffect, useState } from "react";
import axios from "axios";

function Students() {
  const API = "http://localhost:8086/students";

  const [students, setStudents] = useState([]);

  const [student, setStudent] = useState({
    fullname: "",
    email: "",
    phone: "",
    course: "",
  });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // GET STUDENTS
  // ===============================
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error Fetching Students:", error);
      setError("Unable to fetch students. Please check the services.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent({
      ...student,
      [name]: value,
    });
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setStudent({
      fullname: "",
      email: "",
      phone: "",
      course: "",
    });

    setEditing(false);
    setEditId(null);
  };

  // ===============================
  // ADD STUDENT
  // ===============================
  const addStudent = async (e) => {
    e.preventDefault();

    setError("");

    if (!student.fullname.trim()) {
      setError("Please enter student name.");
      return;
    }

    if (!student.email.trim()) {
      setError("Please enter email.");
      return;
    }

    if (!student.phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    if (!student.course.trim()) {
      setError("Please enter course.");
      return;
    }

    if (student.phone.length < 7 || student.phone.length > 15) {
      setError("Phone number must contain 7 to 15 digits.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API, student);

      alert("Student Added Successfully");

      resetForm();
      await getStudents();
    } catch (error) {
      console.error("Add Student Error:", error);

      if (error.response?.data) {
        setError(String(error.response.data));
      } else {
        setError("Unable to add student.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // EDIT STUDENT
  // ===============================
  const editStudent = (s) => {
    setStudent({
      fullname: s.fullname || "",
      email: s.email || "",
      phone: s.phone || "",
      course: s.course || "",
    });

    setEditId(s.id);
    setEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // UPDATE STUDENT
  // ===============================
  const updateStudent = async (e) => {
    e.preventDefault();

    setError("");

    if (!student.fullname.trim()) {
      setError("Please enter student name.");
      return;
    }

    if (!student.email.trim()) {
      setError("Please enter email.");
      return;
    }

    if (!student.phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    if (!student.course.trim()) {
      setError("Please enter course.");
      return;
    }

    if (student.phone.length < 7 || student.phone.length > 15) {
      setError("Phone number must contain 7 to 15 digits.");
      return;
    }

    try {
      setLoading(true);

      await axios.put(`${API}/${editId}`, student);

      alert("Student Updated Successfully");

      resetForm();
      await getStudents();
    } catch (error) {
      console.error("Update Student Error:", error);

      if (error.response?.data) {
        setError(String(error.response.data));
      } else {
        setError("Unable to update student.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE STUDENT
  // ===============================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.delete(`${API}/${id}`);

      alert("Student Deleted Successfully");

      await getStudents();
    } catch (error) {
      console.error("Delete Student Error:", error);

      if (error.response?.data) {
        setError(String(error.response.data));
      } else {
        setError("Unable to delete student.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredStudents = students.filter((s) => {
    const searchText = search.toLowerCase();

    return (
      String(s.id).toLowerCase().includes(searchText) ||
      String(s.fullname || "").toLowerCase().includes(searchText) ||
      String(s.email || "").toLowerCase().includes(searchText) ||
      String(s.phone || "").toLowerCase().includes(searchText) ||
      String(s.course || "").toLowerCase().includes(searchText)
    );
  });

  // ===============================
  // UI
  // ===============================
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* PAGE TITLE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1f2937",
            }}
          >
            Student Management
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
            }}
          >
            Manage student information
          </p>
        </div>

        <button
          onClick={getStudents}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "11px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* FORM CARD */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#1f2937",
          }}
        >
          {editing ? "✏️ Edit Student" : "➕ Add New Student"}
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={editing ? updateStudent : addStudent}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {/* FULL NAME */}
          <div>
            <label>Full Name</label>

            <input
              type="text"
              name="fullname"
              placeholder="Enter full name"
              value={student.fullname}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={student.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* PHONE */}
          <div>
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={student.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setStudent({
                  ...student,
                  phone: value,
                });
              }}
              required
              style={inputStyle}
            />
          </div>

          {/* COURSE */}
          <div>
            <label>Course</label>

            <input
              type="text"
              name="course"
              placeholder="Example: CSE"
              value={student.course}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: "10px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: editing ? "#f59e0b" : "#16a34a",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                marginRight: "10px",
              }}
            >
              {loading
                ? "Processing..."
                : editing
                ? "Update Student"
                : "Add Student"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* STUDENT LIST CARD */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#1f2937",
            }}
          >
            👨‍🎓 All Students ({filteredStudents.length})
          </h2>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="🔍 Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "11px 15px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              width: "280px",
              outline: "none",
            }}
          />
        </div>

        {loading && students.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading students...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                  }}
                >
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Course</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <td style={tdStyle}>{s.id}</td>

                      <td style={tdStyle}>
                        <strong>{s.fullname}</strong>
                      </td>

                      <td style={tdStyle}>{s.email}</td>

                      <td style={tdStyle}>{s.phone}</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {s.course}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() => editStudent(s)}
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            padding: "7px 13px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => deleteStudent(s.id)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "7px 13px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#6b7280",
                      }}
                    >
                      No Students Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ===============================
// STYLES
// ===============================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  marginTop: "7px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  outline: "none",
};

const thStyle = {
  padding: "13px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
  textAlign: "left",
};

export default Students;