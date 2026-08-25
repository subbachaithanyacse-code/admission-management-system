import React, { useEffect, useState } from "react";
import axios from "axios";

function Admissions() {
  const API = "https://admission-api-gateway.onrender.com";

  // ================================
  // DATA
  // ================================
  const [admissions, setAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // ================================
  // PAGINATION
  // ================================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ================================
  // LOADING / MESSAGE
  // ================================
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ================================
  // FORM
  // ================================
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    admission_date: "",
    status: "Pending",
  });

  // ================================
  // LOAD ALL DATA
  // ================================
  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  // ================================
  // LOAD ADMISSIONS
  // ================================
  useEffect(() => {
    loadAdmissions();
  }, [page, limit]);

  // ================================
  // GET ADMISSIONS
  // ================================
  const loadAdmissions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${API}/admissions?page=${page}&limit=${limit}`
      );

      console.log("ADMISSIONS:", response.data);
      console.log("HEADERS:", response.headers);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.admissions ||
          response.data.data ||
          [];

      setAdmissions(data);

      // --------------------------------
      // PAGINATION HEADERS
      // --------------------------------

      const totalCount =
        response.headers["x-total-count"];

      const pages =
        response.headers["x-total-pages"];

      if (totalCount) {
        setTotalRecords(Number(totalCount));
      } else {
        // fallback
        setTotalRecords(data.length);
      }

      if (pages) {
        setTotalPages(Number(pages));
      } else {
        const calculatedPages = Math.ceil(
          Number(totalCount || data.length) / limit
        );

        setTotalPages(calculatedPages);
      }
    } catch (error) {
      console.error(
        "Admissions Error:",
        error
      );

      setMessage(
        "Unable to load admissions: " +
          (error.response?.data ||
            error.message)
      );

      setMessageType("error");

      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // GET STUDENTS
  // ================================
  const loadStudents = async () => {
    try {
      const response = await axios.get(
        `${API}/students?page=1&limit=100`
      );

      console.log(
        "STUDENTS:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.students ||
          response.data.data ||
          [];

      setStudents(data);
    } catch (error) {
      console.error(
        "Students Error:",
        error
      );
    }
  };

  // ================================
  // GET COURSES
  // ================================
  const loadCourses = async () => {
    try {
      const response = await axios.get(
        `${API}/courses?page=1&limit=100`
      );

      console.log(
        "COURSES:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.courses ||
          response.data.data ||
          [];

      setCourses(data);
    } catch (error) {
      console.error(
        "Courses Error:",
        error
      );
    }
  };

  // ================================
  // FORM CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================================
  // RESET FORM
  // ================================
  const resetForm = () => {
    setFormData({
      student_id: "",
      course_id: "",
      admission_date: "",
      status: "Pending",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ================================
  // OPEN ADD FORM
  // ================================
  const openAddForm = () => {
    setFormData({
      student_id: "",
      course_id: "",
      admission_date: "",
      status: "Pending",
    });

    setEditingId(null);
    setMessage("");
    setShowForm(true);
  };

  // ================================
  // EDIT
  // ================================
  const editAdmission = (admission) => {
    setFormData({
      student_id: admission.student_id || "",
      course_id: admission.course_id || "",
      admission_date: admission.admission_date
        ? admission.admission_date.substring(
            0,
            10
          )
        : "",
      status: admission.status || "Pending",
    });

    setEditingId(admission.id);
    setShowForm(true);
    setMessage("");
  };

  // ================================
  // VALIDATE
  // ================================
  const validateForm = () => {
    if (!formData.student_id) {
      setMessage(
        "Please select a student"
      );
      setMessageType("error");
      return false;
    }

    if (!formData.course_id) {
      setMessage(
        "Please select a course"
      );
      setMessageType("error");
      return false;
    }

    if (!formData.admission_date) {
      setMessage(
        "Admission date is required"
      );
      setMessageType("error");
      return false;
    }

    if (!formData.status) {
      setMessage(
        "Status is required"
      );
      setMessageType("error");
      return false;
    }

    return true;
  };

  // ================================
  // SAVE ADMISSION
  // ================================
  const saveAdmission = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        student_id: Number(
          formData.student_id
        ),
        course_id: Number(
          formData.course_id
        ),
        admission_date:
          formData.admission_date,
        status: formData.status,
      };

      console.log(
        "ADMISSION PAYLOAD:",
        payload
      );

      let response;

      if (editingId !== null) {
        response = await axios.put(
          `${API}/admissions/${editingId}`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${API}/admissions`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );
      }

      console.log(
        "SAVE RESPONSE:",
        response.data
      );

      setMessage(
        editingId !== null
          ? "Admission Updated Successfully"
          : "Admission Added Successfully"
      );

      setMessageType("success");

      resetForm();

      await loadAdmissions();
    } catch (error) {
      console.error(
        "Save Admission Error:",
        error
      );

      setMessage(
        "Unable to save admission: " +
          (error.response?.data ||
            error.message)
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // DELETE
  // ================================
  const deleteAdmission = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admission?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(
        `${API}/admissions/${id}`
      );

      setMessage(
        "Admission Deleted Successfully"
      );

      setMessageType("success");

      if (
        admissions.length === 1 &&
        page > 1
      ) {
        setPage(page - 1);
      } else {
        await loadAdmissions();
      }
    } catch (error) {
      console.error(
        "Delete Admission Error:",
        error
      );

      setMessage(
        "Unable to delete admission: " +
          (error.response?.data ||
            error.message)
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FIND STUDENT
  // ================================
  const getStudentName = (id) => {
    const student = students.find(
      (s) => Number(s.id) === Number(id)
    );

    return student
      ? student.fullname
      : `Student #${id}`;
  };

  // ================================
  // FIND COURSE
  // ================================
  const getCourseName = (id) => {
    const course = courses.find(
      (c) => Number(c.id) === Number(id)
    );

    return course
      ? course.course_name
      : `Course #${id}`;
  };

  // ================================
  // NEXT PAGE
  // ================================
  const nextPage = () => {
    if (
      page < totalPages &&
      !loading
    ) {
      setPage(page + 1);
    }
  };

  // ================================
  // PREVIOUS PAGE
  // ================================
  const previousPage = () => {
    if (
      page > 1 &&
      !loading
    ) {
      setPage(page - 1);
    }
  };

  // ================================
  // LIMIT
  // ================================
  const changeLimit = (e) => {
    setLimit(
      Number(e.target.value)
    );

    setPage(1);
  };

  // ================================
  // UI
  // ================================
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1f2937",
            }}
          >
            Admissions Management
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Manage student admissions
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={loadAdmissions}
            style={refreshButtonStyle}
          >
            🔄 Refresh
          </button>

          <button
            onClick={openAddForm}
            style={addButtonStyle}
          >
            ➕ Add Admission
          </button>
        </div>
      </div>

      {/* MESSAGE */}

      {message && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "6px",
            fontWeight: "600",
            backgroundColor:
              messageType === "success"
                ? "#dcfce7"
                : "#fee2e2",
            color:
              messageType === "success"
                ? "#166534"
                : "#991b1b",
          }}
        >
          {message}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "25px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            {editingId !== null
              ? "✏️ Edit Admission"
              : "➕ Add Admission"}
          </h2>

          <form onSubmit={saveAdmission}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "15px",
              }}
            >

              {/* STUDENT */}

              <div>
                <label style={labelStyle}>
                  Student *
                </label>

                <select
                  name="student_id"
                  value={
                    formData.student_id
                  }
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    Select Student
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.fullname}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* COURSE */}

              <div>
                <label style={labelStyle}>
                  Course *
                </label>

                <select
                  name="course_id"
                  value={
                    formData.course_id
                  }
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (course) => (
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.course_name}{" "}
                        ({course.course_code})
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DATE */}

              <div>
                <label style={labelStyle}>
                  Admission Date *
                </label>

                <input
                  type="date"
                  name="admission_date"
                  value={
                    formData.admission_date
                  }
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* STATUS */}

              <div>
                <label style={labelStyle}>
                  Status *
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={handleChange}
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
            </div>

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
                style={saveButtonStyle}
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Admission"
                  : "Add Admission"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUMMARY */}

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <b>Total Admissions:</b>{" "}
            {totalRecords}
          </div>

          <div>
            <b>Page:</b>{" "}
            {page} / {totalPages}
          </div>

          <div>
            <b>Records per page:</b>{" "}

            <select
              value={limit}
              onChange={changeLimit}
              style={{
                padding: "8px",
                marginLeft: "5px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "5px",
              }}
            >
              <option value="10">
                10
              </option>

              <option value="20">
                20
              </option>

              <option value="50">
                50
              </option>

              <option value="100">
                100
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          overflowX: "auto",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          🎓 All Admissions
        </h2>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            Loading admissions...
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor:
                    "#2563eb",
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
              {admissions.length > 0 ? (
                admissions.map(
                  (admission) => (
                    <tr
                      key={admission.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {admission.id}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <b>
                          {getStudentName(
                            admission.student_id
                          )}
                        </b>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {getCourseName(
                          admission.course_id
                        )}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {admission.admission_date
                          ? new Date(
                              admission.admission_date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <span
                          style={{
                            padding:
                              "6px 10px",
                            borderRadius:
                              "20px",
                            fontWeight:
                              "600",
                            backgroundColor:
                              admission.status ===
                              "Approved"
                                ? "#dcfce7"
                                : admission.status ===
                                  "Rejected"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              admission.status ===
                              "Approved"
                                ? "#166534"
                                : admission.status ===
                                  "Rejected"
                                ? "#991b1b"
                                : "#92400e",
                          }}
                        >
                          {admission.status}
                        </span>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() =>
                              editAdmission(
                                admission
                              )
                            }
                            style={
                              editButtonStyle
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteAdmission(
                                admission.id
                              )
                            }
                            style={
                              deleteButtonStyle
                            }
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign:
                        "center",
                      padding: "40px",
                      color: "#777",
                    }}
                  >
                    No admissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={previousPage}
            disabled={
              page === 1 ||
              loading
            }
            style={paginationButtonStyle(
              page === 1 ||
                loading
            )}
          >
            ◀ Previous
          </button>

          <span
            style={{
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={
              page >= totalPages ||
              totalPages === 0 ||
              loading
            }
            style={paginationButtonStyle(
              page >= totalPages ||
                totalPages === 0 ||
                loading
            )}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================
// STYLES
// ======================================

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px",
  border:
    "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
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

const refreshButtonStyle = {
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  padding: "11px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const addButtonStyle = {
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  padding: "11px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const saveButtonStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const cancelButtonStyle = {
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const editButtonStyle = {
  backgroundColor: "#f59e0b",
  color: "white",
  border: "none",
  padding: "7px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteButtonStyle = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "7px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
};

const paginationButtonStyle = (
  disabled
) => ({
  backgroundColor: disabled
    ? "#d1d5db"
    : "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: disabled
    ? "not-allowed"
    : "pointer",
  fontWeight: "600",
});

export default Admissions;
