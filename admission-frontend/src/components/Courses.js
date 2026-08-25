import React, { useEffect, useState } from "react";

function Courses() {
  const API = "https://admission-api-gateway.onrender.com";

  // =========================================
  // COURSE DATA
  // =========================================

  const [courses, setCourses] = useState([]);

  // =========================================
  // PAGINATION
  // =========================================

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // =========================================
  // LOADING / MESSAGE
  // =========================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================================
  // FORM
  // =========================================

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    duration: "",
    fee: "",
    seats: "",
  });

  // =========================================
  // LOAD COURSES
  // =========================================

  useEffect(() => {
    getCourses();
  }, [page, limit]);

  const getCourses = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API}/courses?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setCourses(Array.isArray(data) ? data : []);

      // Read pagination headers

      const totalCount =
        response.headers.get("X-Total-Count");

      const pages =
        response.headers.get("X-Total-Pages");

      setTotalRecords(
        totalCount ? Number(totalCount) : 0
      );

      setTotalPages(
        pages ? Number(pages) : 0
      );

    } catch (error) {
      console.error("Courses Error:", error);

      setMessage(
        "Unable to load courses: " + error.message
      );

      setMessageType("error");

      setCourses([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FORM INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    setFormData({
      course_code: "",
      course_name: "",
      duration: "",
      fee: "",
      seats: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const openAddForm = () => {
    setFormData({
      course_code: "",
      course_name: "",
      duration: "",
      fee: "",
      seats: "",
    });

    setEditingId(null);
    setMessage("");
    setShowForm(true);
  };

  // =========================================
  // EDIT COURSE
  // =========================================

  const editCourse = (course) => {
    setFormData({
      course_code: course.course_code || "",
      course_name: course.course_name || "",
      duration: course.duration || "",
      fee: course.fee ?? "",
      seats: course.seats ?? "",
    });

    setEditingId(course.id);
    setMessage("");
    setShowForm(true);
  };

  // =========================================
  // VALIDATE FORM
  // =========================================

  const validateForm = () => {
    if (!formData.course_code.trim()) {
      setMessage("Course Code is required");
      setMessageType("error");
      return false;
    }

    if (!formData.course_name.trim()) {
      setMessage("Course Name is required");
      setMessageType("error");
      return false;
    }

    if (
      formData.fee === "" ||
      Number(formData.fee) < 0
    ) {
      setMessage("Fee cannot be negative");
      setMessageType("error");
      return false;
    }

    if (
      formData.seats === "" ||
      Number(formData.seats) < 0
    ) {
      setMessage("Seats cannot be negative");
      setMessageType("error");
      return false;
    }

    return true;
  };

  // =========================================
  // ADD / UPDATE COURSE
  // =========================================

  const saveCourse = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        course_code: formData.course_code.trim(),
        course_name: formData.course_name.trim(),
        duration: formData.duration.trim(),
        fee: Number(formData.fee),
        seats: Number(formData.seats),
      };

      let url = `${API}/courses`;
      let method = "POST";

      // UPDATE

      if (editingId !== null) {
        url = `${API}/courses/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(resultText);
      }

      setMessage(
        editingId !== null
          ? "Course Updated Successfully"
          : "Course Added Successfully"
      );

      setMessageType("success");

      resetForm();

      await getCourses();

    } catch (error) {
      console.error("Save Course Error:", error);

      setMessage(
        "Unable to save course: " + error.message
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE COURSE
  // =========================================

  const deleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API}/courses/${id}`,
        {
          method: "DELETE",
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(resultText);
      }

      setMessage("Course Deleted Successfully");
      setMessageType("success");

      // If deleting last item on current page,
      // move to previous page.

      if (
        courses.length === 1 &&
        page > 1
      ) {
        setPage(page - 1);
      } else {
        await getCourses();
      }

    } catch (error) {
      console.error("Delete Course Error:", error);

      setMessage(
        "Unable to delete course: " + error.message
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // NEXT PAGE
  // =========================================

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // =========================================
  // PREVIOUS PAGE
  // =========================================

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // =========================================
  // CHANGE LIMIT
  // =========================================

  const changeLimit = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >

      {/* =====================================
          HEADER
      ====================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
            Course Management
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Manage courses and course details
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            onClick={getCourses}
            style={refreshButtonStyle}
          >
            🔄 Refresh
          </button>

          <button
            onClick={openAddForm}
            style={addButtonStyle}
          >
            ➕ Add Course
          </button>

        </div>

      </div>

      {/* =====================================
          MESSAGE
      ====================================== */}

      {message && (
        <div
          style={{
            backgroundColor:
              messageType === "success"
                ? "#dcfce7"
                : "#fee2e2",

            color:
              messageType === "success"
                ? "#166534"
                : "#991b1b",

            padding: "12px 16px",

            borderRadius: "6px",

            marginBottom: "20px",

            fontWeight: "600",
          }}
        >
          {message}
        </div>
      )}

      {/* =====================================
          ADD / EDIT FORM
      ====================================== */}

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

          <h2
            style={{
              marginTop: 0,
              color: "#1f2937",
            }}
          >
            {editingId !== null
              ? "✏️ Edit Course"
              : "➕ Add Course"}
          </h2>

          <form onSubmit={saveCourse}>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "15px",
              }}
            >

              {/* COURSE CODE */}

              <div>
                <label style={labelStyle}>
                  Course Code *
                </label>

                <input
                  type="text"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="Example: CSE-01"
                  style={inputStyle}
                />
              </div>

              {/* COURSE NAME */}

              <div>
                <label style={labelStyle}>
                  Course Name *
                </label>

                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Example: B.Tech CSE"
                  style={inputStyle}
                />
              </div>

              {/* DURATION */}

              <div>
                <label style={labelStyle}>
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 4 Years"
                  style={inputStyle}
                />
              </div>

              {/* FEE */}

              <div>
                <label style={labelStyle}>
                  Fee *
                </label>

                <input
                  type="number"
                  name="fee"
                  min="0"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="Example: 50000"
                  style={inputStyle}
                />
              </div>

              {/* SEATS */}

              <div>
                <label style={labelStyle}>
                  Seats *
                </label>

                <input
                  type="number"
                  name="seats"
                  min="0"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="Example: 60"
                  style={inputStyle}
                />
              </div>

            </div>

            {/* FORM BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
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
                  ? "Update Course"
                  : "Add Course"}
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

      {/* =====================================
          SUMMARY
      ====================================== */}

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
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >

          <div>
            <b>Total Courses:</b>{" "}
            {totalRecords}
          </div>

          <div>
            <b>Page:</b>{" "}
            {page} / {totalPages}
          </div>

          <div>

            <label>
              <b>Records per page:</b>{" "}
            </label>

            <select
              value={limit}
              onChange={changeLimit}
              style={{
                padding: "8px",
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

      {/* =====================================
          COURSE TABLE
      ====================================== */}

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            color: "#1f2937",
          }}
        >
          📚 Courses
        </h2>

        {loading ? (

          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            Loading courses...
          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

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

                  <th
                    style={tableHeaderStyle}
                  >
                    ID
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Course Code
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Course Name
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Duration
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Fee
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Seats
                  </th>

                  <th
                    style={tableHeaderStyle}
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {courses.length > 0 ? (

                  courses.map(
                    (course) => (

                      <tr
                        key={course.id}
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
                          {course.id}
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <b>
                            {
                              course.course_code
                            }
                          </b>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            course.course_name
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            course.duration
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          ₹
                          {Number(
                            course.fee
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {course.seats}
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                            }}
                          >

                            <button
                              onClick={() =>
                                editCourse(
                                  course
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
                                deleteCourse(
                                  course.id
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
                      colSpan="7"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                        color:
                          "#777",
                      }}
                    >
                      No courses found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

        {/* =================================
            PAGINATION
        ================================== */}

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
            onClick={
              previousPage
            }
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
              fontWeight:
                "600",
              color:
                "#374151",
            }}
          >
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={
              page ===
                totalPages ||
              totalPages === 0 ||
              loading
            }
            style={paginationButtonStyle(
              page ===
                totalPages ||
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

// =========================================
// STYLES
// =========================================

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
  border: "1px solid #d1d5db",
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

const paginationButtonStyle = (disabled) => ({
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

export default Courses;
