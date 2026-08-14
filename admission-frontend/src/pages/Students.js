import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = "http://127.0.0.1:8086";
const PAGE_SIZE = 10;

function Students() {
  const [students, setStudents] = useState([]);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // ===============================
  // LOAD STUDENTS
  // ===============================

  useEffect(() => {
    loadStudents(currentPage);
  }, [currentPage]);

  const loadStudents = async (page = currentPage) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/students?page=${page}&limit=${PAGE_SIZE}`
      );

      console.log("Students Response:", response.data);

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data.students)) {
        data = response.data.students;
      } else if (Array.isArray(response.data.data)) {
        data = response.data.data;
      }

      setStudents(data);

      // If 10 records returned, there may be another page
      setHasNextPage(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Load Students Error:", error);
      alert("Unable to load students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ADD STUDENT
  // ===============================

  const addStudent = async (e) => {
    e.preventDefault();

    if (
      !fullname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !course.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/students`, {
        fullname: fullname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course: course.trim(),
      });

      console.log("Add Student Response:", response.data);

      alert("Student added successfully.");

      clearForm();

      // Go to first page to see newly added student
      setCurrentPage(1);

      await loadStudents(1);
    } catch (error) {
      console.error("Add Student Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            error.response.data ||
            "Unable to add student."
        );
      } else {
        alert("Unable to connect to API Gateway.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // EDIT STUDENT
  // ===============================

  const editStudent = (student) => {
    setEditingId(student.id);

    setFullname(student.fullname || "");
    setEmail(student.email || "");
    setPhone(student.phone || "");
    setCourse(student.course || "");

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

    if (
      !fullname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !course.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/students/${editingId}`,
        {
          fullname: fullname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          course: course.trim(),
        }
      );

      console.log("Update Student Response:", response.data);

      alert("Student updated successfully.");

      clearForm();

      await loadStudents(currentPage);
    } catch (error) {
      console.error("Update Student Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            error.response.data ||
            "Unable to update student."
        );
      } else {
        alert("Unable to connect to API Gateway.");
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

      await axios.delete(`${API_URL}/students/${id}`);

      alert("Student deleted successfully.");

      // Reload current page
      await loadStudents(currentPage);

      // If current page becomes empty, go back one page
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Delete Student Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            error.response.data ||
            "Unable to delete student."
        );
      } else {
        alert("Unable to connect to API Gateway.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CLEAR FORM
  // ===============================

  const clearForm = () => {
    setFullname("");
    setEmail("");
    setPhone("");
    setCourse("");
    setEditingId(null);
  };

  // ===============================
  // SEARCH
  // ===============================

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase().trim();

    return (
      String(student.id || "")
        .toLowerCase()
        .includes(value) ||
      String(student.fullname || "")
        .toLowerCase()
        .includes(value) ||
      String(student.email || "")
        .toLowerCase()
        .includes(value) ||
      String(student.phone || "")
        .toLowerCase()
        .includes(value) ||
      String(student.course || "")
        .toLowerCase()
        .includes(value)
    );
  });

  // ===============================
  // REFRESH
  // ===============================

  const handleRefresh = () => {
    setSearch("");
    loadStudents(currentPage);
  };

  // ===============================
  // NEXT PAGE
  // ===============================

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
      setSearch("");
    }
  };

  // ===============================
  // PREVIOUS PAGE
  // ===============================

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSearch("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Navbar />

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <div
        style={{
          flex: 1,
          padding: "30px",
          boxSizing: "border-box",
          overflowX: "auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
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
              Students Management
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#6b7280",
              }}
            >
              Add, update, search and manage students
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "11px 20px",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {/* ===============================
            ADD / EDIT FORM
        =============================== */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#1f2937",
            }}
          >
            {editingId ? "Edit Student" : "Add New Student"}
          </h2>

          <form
            onSubmit={editingId ? updateStudent : addStudent}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {/* NAME */}

              <div>
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullname}
                  onChange={(e) =>
                    setFullname(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              {/* EMAIL */}

              <div>
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              {/* PHONE */}

              <div>
                <label>Phone</label>

                <input
                  type="text"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              {/* COURSE */}

              <div>
                <label>Course</label>

                <input
                  type="text"
                  placeholder="Example: CSE"
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: editingId
                    ? "#f59e0b"
                    : "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "6px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {loading
                  ? "Please wait..."
                  : editingId
                  ? "Update Student"
                  : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
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

        {/* ===============================
            STUDENT LIST
        =============================== */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* LIST HEADER */}

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
              Students - Page {currentPage}
            </h2>

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search current page..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                padding: "11px 15px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                width: "280px",
                outline: "none",
              }}
            />
          </div>

          {/* INFO */}

          <div
            style={{
              marginBottom: "15px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Showing {filteredStudents.length} record(s)
            on page {currentPage}
          </div>

          {/* TABLE */}

          {loading && students.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Loading students...
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
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
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        style={{
                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >
                        <td style={tdStyle}>
                          {student.id}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {student.fullname}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {student.email}
                        </td>

                        <td style={tdStyle}>
                          {student.phone}
                        </td>

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
                            {student.course}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              editStudent(student)
                            }
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
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteStudent(student.id)
                            }
                            style={{
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "7px 13px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
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

          {/* ===============================
              PAGINATION
          =============================== */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={previousPage}
              disabled={currentPage === 1 || loading}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "6px",
                backgroundColor:
                  currentPage === 1
                    ? "#d1d5db"
                    : "#374151",
                color: "white",
                cursor:
                  currentPage === 1 || loading
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "600",
              }}
            >
              ← Previous
            </button>

            <span
              style={{
                fontWeight: "600",
                color: "#374151",
                padding: "8px 15px",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
              }}
            >
              Page {currentPage}
            </span>

            <button
              onClick={nextPage}
              disabled={!hasNextPage || loading}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: !hasNextPage
                  ? "#d1d5db"
                  : "#2563eb",
                color: "white",
                cursor:
                  !hasNextPage || loading
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "600",
              }}
            >
              Next →
            </button>
          </div>
        </div>
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