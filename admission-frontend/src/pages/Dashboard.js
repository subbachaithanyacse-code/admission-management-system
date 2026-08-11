import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8086";

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [admissions, setAdmissions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const getCount = (data) => {
    if (Array.isArray(data)) {
      return data.length;
    }

    if (data && Array.isArray(data.students)) {
      return data.students.length;
    }

    if (data && Array.isArray(data.courses)) {
      return data.courses.length;
    }

    if (data && Array.isArray(data.admissions)) {
      return data.admissions.length;
    }

    if (data && Array.isArray(data.data)) {
      return data.data.length;
    }

    return 0;
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentResponse, courseResponse, admissionResponse] =
        await Promise.all([
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/courses`),
          axios.get(`${API_URL}/admissions`),
        ]);

      console.log("STUDENTS:", studentResponse.data);
      console.log("COURSES:", courseResponse.data);
      console.log("ADMISSIONS:", admissionResponse.data);

      setStudents(getCount(studentResponse.data));
      setCourses(getCount(courseResponse.data));
      setAdmissions(getCount(admissionResponse.data));

    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.response) {
        console.error("Server:", err.response.data);
        setError("Unable to load dashboard data.");
      } else {
        setError(
          "Cannot connect to API Gateway. Make sure port 8086 is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>Admission Management Dashboard</h1>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <h3>Loading dashboard...</h3>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* STUDENTS */}

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Students</h3>

            <h1
              style={{
                color: "#007bff",
                fontSize: "40px",
                margin: 0,
              }}
            >
              {students}
            </h1>
          </div>

          {/* COURSES */}

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Courses</h3>

            <h1
              style={{
                color: "#28a745",
                fontSize: "40px",
                margin: 0,
              }}
            >
              {courses}
            </h1>
          </div>

          {/* ADMISSIONS */}

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Admissions</h3>

            <h1
              style={{
                color: "#dc3545",
                fontSize: "40px",
                margin: 0,
              }}
            >
              {admissions}
            </h1>
          </div>
        </div>
      )}

      <button
        onClick={loadDashboard}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
}

export default Dashboard;