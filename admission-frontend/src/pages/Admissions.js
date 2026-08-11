import React, { useEffect, useState } from "react";

function Admissions() {
  const API = "http://127.0.0.1:8086";

  const [admissions, setAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    admission_date: "",
    status: "Pending",
  });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD ALL DATA
  // =========================
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      getAdmissions(),
      getStudents(),
      getCourses(),
    ]);
  };

  // =========================
  // GET ADMISSIONS
  // =========================
  const getAdmissions = async () => {
    try {
      const response = await fetch(`${API}/admissions`);

      if (!response.ok) {
        throw new Error("Failed to load admissions");
      }

      const data = await response.json();

      setAdmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Admissions Error:", error);
      setMessage("Error: Unable to load admissions");
    }
  };

  // =========================
  // GET STUDENTS
  // =========================
  const getStudents = async () => {
    try {
      const response = await fetch(`${API}/students`);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Students Error:", error);
    }
  };

  // =========================
  // GET COURSES
  // =========================
  const getCourses = async () => {
    try {
      const response = await fetch(`${API}/courses`);

      if (!response.ok) {
        throw new Error("Failed to load courses");
      }

      const data = await response.json();

      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Courses Error:", error);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      student_id: "",
      course_id: "",
      admission_date: "",
      status: "Pending",
    });

    setEditing(false);
    setEditId(null);
    setMessage("");
  };

  // =========================
  // ADD ADMISSION
  // =========================
  const addAdmission = async (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !form.student_id ||
      !form.course_id ||
      !form.admission_date ||
      !form.status
    ) {
      setMessage("Error: Please fill all required fields.");
      return;
    }

    const admissionData = {
      student_id: Number(form.student_id),
      course_id: Number(form.course_id),
      admission_date: form.admission_date,
      status: form.status,
    };

    try {
      setLoading(true);

      const response = await fetch(`${API}/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admissionData),
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Failed to add admission");
      }

      setMessage("Admission added successfully!");

      resetForm();

      await getAdmissions();
    } catch (error) {
      console.error("Add Admission Error:", error);
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT ADMISSION
  // =========================
  const editAdmission = (admission) => {
    setForm({
      student_id: String(admission.student_id),
      course_id: String(admission.course_id),
      admission_date: admission.admission_date
        ? admission.admission_date.substring(0, 10)
        : "",
      status: admission.status || "Pending",
    });

    setEditId(admission.id);
    setEditing(true);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // UPDATE ADMISSION
  // =========================
  const updateAdmission = async (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !form.student_id ||
      !form.course_id ||
      !form.admission_date ||
      !form.status
    ) {
      setMessage("Error: Please fill all required fields.");
      return;
    }

    const admissionData = {
      student_id: Number(form.student_id),
      course_id: Number(form.course_id),
      admission_date: form.admission_date,
      status: form.status,
    };

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/admissions/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(admissionData),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Failed to update admission");
      }

      setMessage("Admission updated successfully!");

      resetForm();

      await getAdmissions();
    } catch (error) {
      console.error("Update Admission Error:", error);
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE ADMISSION
  // =========================
  const deleteAdmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API}/admissions/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Delete failed");
      }

      setMessage("Admission deleted successfully!");

      await getAdmissions();
    } catch (error) {
      console.error("Delete Admission Error:", error);
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FIND STUDENT NAME
  // =========================
  const getStudentName = (studentId) => {
    const student = students.find(
      (item) => Number(item.id) === Number(studentId)
    );

    return student
      ? student.fullname
      : `Student ID: ${studentId}`;
  };

  // =========================
  // FIND COURSE NAME
  // =========================
  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) => Number(item.id) === Number(courseId)
    );

    return course
      ? course.course_name
      : `Course ID: ${courseId}`;
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
        padding: "6px 12px",
        borderRadius: "15px",
        fontWeight: "bold",
        display: "inline-block",
      };
    }

    if (status === "Rejected") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "6px 12px",
        borderRadius: "15px",
        fontWeight: "bold",
        display: "inline-block",
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      padding: "6px 12px",
      borderRadius: "15px",
      fontWeight: "bold",
      display: "inline-block",
    };
  };

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredAdmissions = admissions.filter((admission) => {
    const studentName = getStudentName(
      admission.student_id
    ).toLowerCase();

    const courseName = getCourseName(
      admission.course_id
    ).toLowerCase();

    const searchText = search.toLowerCase();

    const matchesSearch =
      String(admission.id).includes(searchText) ||
      studentName.includes(searchText) ||
      courseName.includes(searchText) ||
      String(admission.student_id).includes(searchText) ||
      String(admission.course_id).includes(searchText) ||
      String(admission.status)
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      admission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // COUNTS
  // =========================
  const totalAdmissions = admissions.length;

  const approvedCount = admissions.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingCount = admissions.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejectedCount = admissions.filter(
    (item) => item.status === "Rejected"
  ).length;

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1f2937",
            }}
          >
            Admission Management
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Manage student admissions
          </p>
        </div>

        <button
          onClick={loadAllData}
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

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div style={summaryCardStyle}>
          <h3>Total Admissions</h3>
          <strong>{totalAdmissions}</strong>
        </div>

        <div style={summaryCardStyle}>
          <h3>Approved</h3>
          <strong style={{ color: "#16a34a" }}>
            {approvedCount}
          </strong>
        </div>

        <div style={summaryCardStyle}>
          <h3>Pending</h3>
          <strong style={{ color: "#d97706" }}>
            {pendingCount}
          </strong>
        </div>

        <div style={summaryCardStyle}>
          <h3>Rejected</h3>
          <strong style={{ color: "#dc2626" }}>
            {rejectedCount}
          </strong>
        </div>
      </div>

      {/* FORM */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          marginBottom: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#1f2937",
          }}
        >
          {editing
            ? "✏️ Edit Admission"
            : "➕ Add New Admission"}
        </h2>

        {message && (
          <div
            style={{
              backgroundColor: message.startsWith("Error")
                ? "#fee2e2"
                : "#dcfce7",
              color: message.startsWith("Error")
                ? "#991b1b"
                : "#166534",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "18px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={
            editing ? updateAdmission : addAdmission
          }
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {/* STUDENT */}

          <div>
            <label>
              <b>Student</b>
            </label>

            <select
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">
                -- Select Student --
              </option>

              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.fullname} (ID: {student.id})
                </option>
              ))}
            </select>
          </div>

          {/* COURSE */}

          <div>
            <label>
              <b>Course</b>
            </label>

            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">
                -- Select Course --
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.course_name} (ID: {course.id})
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}

          <div>
            <label>
              <b>Admission Date</b>
            </label>

            <input
              type="date"
              name="admission_date"
              value={form.admission_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* STATUS */}

          <div>
            <label>
              <b>Status</b>
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: "5px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: editing
                  ? "#f59e0b"
                  : "#16a34a",
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
                ? "Update Admission"
                : "Add Admission"}
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

      {/* ADMISSION LIST */}

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
            📋 All Admissions ({filteredAdmissions.length})
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* SEARCH */}

            <input
              type="text"
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                padding: "11px 15px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                width: "240px",
                outline: "none",
              }}
            />

            {/* FILTER */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                padding: "11px 15px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
              }}
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                }}
              >
                <th style={tableHeaderStyle}>
                  ID
                </th>

                <th style={tableHeaderStyle}>
                  Student
                </th>

                <th style={tableHeaderStyle}>
                  Course
                </th>

                <th style={tableHeaderStyle}>
                  Admission Date
                </th>

                <th style={tableHeaderStyle}>
                  Status
                </th>

                <th style={tableHeaderStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map(
                  (admission) => (
                    <tr
                      key={admission.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      {/* ID */}

                      <td style={tableCellStyle}>
                        {admission.id}
                      </td>

                      {/* STUDENT */}

                      <td style={tableCellStyle}>
                        <strong>
                          {getStudentName(
                            admission.student_id
                          )}
                        </strong>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            marginTop: "3px",
                          }}
                        >
                          ID: {admission.student_id}
                        </div>
                      </td>

                      {/* COURSE */}

                      <td style={tableCellStyle}>
                        <strong>
                          {getCourseName(
                            admission.course_id
                          )}
                        </strong>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            marginTop: "3px",
                          }}
                        >
                          ID: {admission.course_id}
                        </div>
                      </td>

                      {/* DATE */}

                      <td style={tableCellStyle}>
                        {admission.admission_date
                          ? admission.admission_date.substring(
                              0,
                              10
                            )
                          : "-"}
                      </td>

                      {/* STATUS */}

                      <td style={tableCellStyle}>
                        <span
                          style={getStatusStyle(
                            admission.status
                          )}
                        >
                          {admission.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td style={tableCellStyle}>
                        <button
                          onClick={() =>
                            editAdmission(
                              admission
                            )
                          }
                          style={{
                            backgroundColor:
                              "#f59e0b",
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
                          onClick={() =>
                            deleteAdmission(
                              admission.id
                            )
                          }
                          style={{
                            backgroundColor:
                              "#dc2626",
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
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#777",
                    }}
                  >
                    No Admissions Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  marginTop: "7px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  outline: "none",
};

const summaryCardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const tableHeaderStyle = {
  padding: "14px",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "14px",
  textAlign: "left",
  color: "#374151",
};

export default Admissions;