import React, { useEffect, useState } from "react";

function Dashboard() {
  const API = "http://localhost:8086";

  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [admissions, setAdmissions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  // ------------------------------------
  // Get array from different API formats
  // ------------------------------------
  const getArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.students)) {
      return data.students;
    }

    if (Array.isArray(data?.courses)) {
      return data.courses;
    }

    if (Array.isArray(data?.admissions)) {
      return data.admissions;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };

  // ------------------------------------
  // Load Dashboard
  // ------------------------------------
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------
      // API requests
      // --------------------------------
      const responses = await Promise.all([
        fetch(`${API}/students?page=1&limit=100`),
        fetch(`${API}/courses?page=1&limit=100`),
        fetch(`${API}/admissions?page=1&limit=100`),
      ]);

      const [studentRes, courseRes, admissionRes] = responses;

      // --------------------------------
      // Check API responses
      // --------------------------------
      if (!studentRes.ok) {
        throw new Error(
          `Student API failed (${studentRes.status})`
        );
      }

      if (!courseRes.ok) {
        throw new Error(
          `Course API failed (${courseRes.status})`
        );
      }

      if (!admissionRes.ok) {
        throw new Error(
          `Admission API failed (${admissionRes.status})`
        );
      }

      // --------------------------------
      // Convert response to JSON
      // --------------------------------
      const studentData = await studentRes.json();
      const courseData = await courseRes.json();
      const admissionData = await admissionRes.json();

      // --------------------------------
      // Console debugging
      // --------------------------------
      console.log("========== DASHBOARD ==========");

      console.log("STUDENTS:", studentData);
      console.log("COURSES:", courseData);
      console.log("ADMISSIONS:", admissionData);

      // --------------------------------
      // Convert API response to arrays
      // --------------------------------
      const studentList = getArray(studentData);
      const courseList = getArray(courseData);
      const admissionList = getArray(admissionData);

      console.log("Student Count:", studentList.length);
      console.log("Course Count:", courseList.length);
      console.log("Admission Count:", admissionList.length);

      // --------------------------------
      // Set counts
      // --------------------------------
      setStudents(studentList.length);
      setCourses(courseList.length);
      setAdmissions(admissionList.length);

      console.log("================================");
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.message ||
          "Unable to load dashboard data"
      );

      // Do NOT automatically clear existing
      // values when an API request fails.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "30px",
            }}
          >
            Admission Management Dashboard
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Overview of students, courses and admissions
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          style={{
            backgroundColor: loading
              ? "#9ca3af"
              : "#2563eb",
            color: "white",
            border: "none",
            padding: "11px 18px",
            borderRadius: "6px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* -------------------------------- */}
      {/* ERROR MESSAGE */}
      {/* -------------------------------- */}

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fecaca",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* -------------------------------- */}
      {/* LOADING */}
      {/* -------------------------------- */}

      {loading ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3>Loading dashboard...</h3>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Please wait while data is loading.
          </p>
        </div>
      ) : (
        <>
          {/* -------------------------------- */}
          {/* STATISTICS CARDS */}
          {/* -------------------------------- */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {/* STUDENTS */}

            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
                borderLeft:
                  "5px solid #2563eb",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                👨‍🎓 Total Students
              </h3>

              <h1
                style={{
                  margin: "15px 0 0",
                  color: "#2563eb",
                  fontSize: "38px",
                }}
              >
                {students}
              </h1>

              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: 0,
                }}
              >
                Registered students
              </p>
            </div>

            {/* COURSES */}

            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
                borderLeft:
                  "5px solid #16a34a",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                📚 Total Courses
              </h3>

              <h1
                style={{
                  margin: "15px 0 0",
                  color: "#16a34a",
                  fontSize: "38px",
                }}
              >
                {courses}
              </h1>

              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: 0,
                }}
              >
                Available courses
              </p>
            </div>

            {/* ADMISSIONS */}

            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
                borderLeft:
                  "5px solid #f59e0b",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                📝 Total Admissions
              </h3>

              <h1
                style={{
                  margin: "15px 0 0",
                  color: "#f59e0b",
                  fontSize: "38px",
                }}
              >
                {admissions}
              </h1>

              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: 0,
                }}
              >
                Student admissions
              </p>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* SYSTEM STATUS */}
          {/* -------------------------------- */}

          <div
            style={{
              backgroundColor: "white",
              marginTop: "30px",
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
              System Status
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "8px",
                  color: "#166534",
                }}
              >
                🟢 Student Service
                <br />
                <strong>Connected</strong>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "8px",
                  color: "#166534",
                }}
              >
                🟢 Course Service
                <br />
                <strong>Connected</strong>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "8px",
                  color: "#166534",
                }}
              >
                🟢 Admission Service
                <br />
                <strong>Connected</strong>
              </div>

              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "8px",
                  color: "#166534",
                }}
              >
                🟢 API Gateway
                <br />
                <strong>Port 8086</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;