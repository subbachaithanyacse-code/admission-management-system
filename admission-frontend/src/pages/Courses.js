import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8086/courses";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    duration: "",
    fee: "",
    seats: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD COURSES
  // =========================
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      console.log("Courses API Response:", response.data);

      // API returns an array
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
        setError("Invalid courses response from server.");
      }
    } catch (err) {
      console.error("Load Courses Error:", err);

      if (err.response) {
        console.error("Server Response:", err.response.data);
        setError("Unable to load courses from server.");
      } else {
        setError(
          "Unable to connect to API Gateway. Make sure Course Service and API Gateway are running."
        );
      }

      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CLEAR FORM
  // =========================
  const clearForm = () => {
    setForm({
      course_code: "",
      course_name: "",
      duration: "",
      fee: "",
      seats: "",
    });

    setEditingId(null);
    setMessage("");
    setError("");
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    if (!form.course_code.trim()) {
      setError("Course Code is required.");
      return false;
    }

    if (!form.course_name.trim()) {
      setError("Course Name is required.");
      return false;
    }

    if (!form.duration.trim()) {
      setError("Duration is required.");
      return false;
    }

    if (form.fee === "" || Number(form.fee) < 0) {
      setError("Enter a valid fee.");
      return false;
    }

    if (form.seats === "" || Number(form.seats) < 0) {
      setError("Enter valid seats.");
      return false;
    }

    return true;
  };

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    const courseData = {
      course_code: form.course_code.trim(),
      course_name: form.course_name.trim(),
      duration: form.duration.trim(),
      fee: Number(form.fee),
      seats: Number(form.seats),
    };

    console.log("Sending Course Data:", courseData);

    try {
      setLoading(true);

      if (editingId !== null) {
        // UPDATE
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          courseData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Update Response:", response.data);

        setMessage("Course Updated Successfully");
      } else {
        // ADD
        const response = await axios.post(API_URL, courseData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Add Response:", response.data);

        setMessage("Course Added Successfully");
      }

      clearForm();
      await loadCourses();
    } catch (err) {
      console.error("Save Course Error:", err);

      if (err.response) {
        console.error("Server Status:", err.response.status);
        console.error("Server Response:", err.response.data);

        if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else {
          setError("Server rejected the request.");
        }
      } else {
        setError(
          "Cannot connect to API Gateway. Check Course Service and API Gateway."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (course) => {
    setEditingId(course.id);

    setForm({
      course_code: course.course_code || "",
      course_name: course.course_name || "",
      duration: course.duration || "",
      fee: course.fee ?? "",
      seats: course.seats ?? "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.delete(`${API_URL}/${id}`);

      console.log("Delete Response:", response.data);

      setMessage("Course Deleted Successfully");

      await loadCourses();
    } catch (err) {
      console.error("Delete Course Error:", err);

      if (err.response?.data) {
        setError(String(err.response.data));
      } else {
        setError("Unable to delete course.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT FEE
  // =========================
  const formatFee = (fee) => {
    const number = Number(fee);

    if (Number.isNaN(number)) {
      return fee;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // =========================
  // PAGE
  // =========================
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "30px",
      }}
    >
      {/* PAGE TITLE */}
      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
          }}
        >
          Course Management
        </h1>

        <p
          style={{
            color: "#666",
            marginTop: "8px",
          }}
        >
          Add, update, view and delete courses
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* FORM */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          {editingId !== null ? "Update Course" : "Add New Course"}
        </h2>

        <form onSubmit={handleSubmit}>
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
              <label>Course Code</label>

              <input
                type="text"
                name="course_code"
                value={form.course_code}
                onChange={handleChange}
                placeholder="Example: CSE-01"
                required
                style={inputStyle}
              />
            </div>

            {/* COURSE NAME */}
            <div>
              <label>Course Name</label>

              <input
                type="text"
                name="course_name"
                value={form.course_name}
                onChange={handleChange}
                placeholder="Example: CSE"
                required
                style={inputStyle}
              />
            </div>

            {/* DURATION */}
            <div>
              <label>Duration</label>

              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Example: 4 Years"
                required
                style={inputStyle}
              />
            </div>

            {/* FEE */}
            <div>
              <label>Fee</label>

              <input
                type="number"
                name="fee"
                value={form.fee}
                onChange={handleChange}
                placeholder="Example: 50000"
                min="0"
                required
                style={inputStyle}
              />
            </div>

            {/* SEATS */}
            <div>
              <label>Seats</label>

              <input
                type="number"
                name="seats"
                value={form.seats}
                onChange={handleChange}
                placeholder="Example: 60"
                min="0"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              style={primaryButton}
            >
              {loading
                ? "Processing..."
                : editingId !== null
                ? "Update Course"
                : "Add Course"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={clearForm}
                style={secondaryButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* COURSE TABLE */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0 }}>Courses</h2>

          <span
            style={{
              backgroundColor: "#e9ecef",
              padding: "7px 12px",
              borderRadius: "20px",
            }}
          >
            Total: {courses.length}
          </span>
        </div>

        {loading && courses.length === 0 ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Course Code</th>
                  <th style={thStyle}>Course Name</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>Fee</th>
                  <th style={thStyle}>Seats</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td style={tdStyle}>{course.id}</td>

                    <td style={tdStyle}>
                      {course.course_code}
                    </td>

                    <td style={tdStyle}>
                      {course.course_name}
                    </td>

                    <td style={tdStyle}>
                      {course.duration}
                    </td>

                    <td style={tdStyle}>
                      {formatFee(course.fee)}
                    </td>

                    <td style={tdStyle}>
                      {course.seats}
                    </td>

                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() => handleEdit(course)}
                        style={{
                          ...editButton,
                          marginRight: "8px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(course.id)
                        }
                        style={deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  padding: "11px 12px",
  marginTop: "7px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "15px",
  outline: "none",
};

const primaryButton = {
  padding: "11px 20px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
  marginRight: "10px",
};

const secondaryButton = {
  padding: "11px 20px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "15px",
};

const editButton = {
  padding: "7px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#ffc107",
  cursor: "pointer",
};

const deleteButton = {
  padding: "7px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#dc3545",
  color: "white",
  cursor: "pointer",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#f1f3f5",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
};

export default Courses;