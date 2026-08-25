
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [admissions, setAdmissions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Render API Gateway
  const API_BASE_URL =
    "https://admission-api-gateway.onrender.com";

  // Get number of records from API response
  const getCount = (data, key) => {
    // Example: [ {}, {}, {} ]
    if (Array.isArray(data)) {
      return data.length;
    }

    // Example: { students: [...] }
    if (data && Array.isArray(data[key])) {
      return data[key].length;
    }

    // Example: { data: [...] }
    if (data && Array.isArray(data.data)) {
      return data.data.length;
    }

    // Example: { count: 10 }
    if (data && typeof data.count === "number") {
      return data.count;
    }

    return 0;
  };

  // Fetch API
  const fetchAPI = async (url) => {
    console.log("Calling API:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(
      "API Status:",
      url,
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `${url} returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    console.log("API Data:", url, data);

    return data;
  };

  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      console.log(
        "========================================"
      );

      console.log(
        "API Gateway:",
        API_BASE_URL
      );

      const [
        studentData,
        courseData,
        admissionData,
      ] = await Promise.all([
        fetchAPI(
          `${API_BASE_URL}/students`
        ),

        fetchAPI(
          `${API_BASE_URL}/courses`
        ),

        fetchAPI(
          `${API_BASE_URL}/admissions`
        ),
      ]);

      // Calculate counts
      const studentCount = getCount(
        studentData,
        "students"
      );

      const courseCount = getCount(
        courseData,
        "courses"
      );

      const admissionCount = getCount(
        admissionData,
        "admissions"
      );

      console.log(
        "Student Count:",
        studentCount
      );

      console.log(
        "Course Count:",
        courseCount
      );

      console.log(
        "Admission Count:",
        admissionCount
      );

      // Update dashboard
      setStudents(studentCount);
      setCourses(courseCount);
      setAdmissions(admissionCount);

    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      setStudents(0);
      setCourses(0);
      setAdmissions(0);

      setError(
        "Unable to connect to API Gateway."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >

      {/* HEADER */}
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
              color: "#172b4d",
              fontSize: "32px",
            }}
          >
            Admission Management Dashboard
          </h1>

          <p
            style={{
              color: "#6b778c",
              fontSize: "16px",
            }}
          >
            Overview of students, courses and admissions
          </p>
        </div>

        <button
          onClick={loadDashboard}
          style={{
            background: "#2864e8",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🔄 Refresh
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#ffe2e2",
            color: "#b42318",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #f5b5b5",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          Loading dashboard...
        </div>

      ) : (

        <>

          {/* CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >

            {/* STUDENTS */}
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "10px",
                borderLeft: "5px solid #2864e8",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#667085",
                }}
              >
                🎓 Total Students
              </h3>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#2864e8",
                }}
              >
                {students}
              </div>

              <p
                style={{
                  color: "#98a2b3",
                }}
              >
                Registered students
              </p>
            </div>

            {/* COURSES */}
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "10px",
                borderLeft: "5px solid #12b76a",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#667085",
                }}
              >
                📚 Total Courses
              </h3>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#12b76a",
                }}
              >
                {courses}
              </div>

              <p
                style={{
                  color: "#98a2b3",
                }}
              >
                Available courses
              </p>
            </div>

            {/* ADMISSIONS */}
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "10px",
                borderLeft: "5px solid #f79009",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#667085",
                }}
              >
                📝 Total Admissions
              </h3>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#f79009",
                }}
              >
                {admissions}
              </div>

              <p
                style={{
                  color: "#98a2b3",
                }}
              >
                Student admissions
              </p>
            </div>

          </div>

          {/* SYSTEM STATUS */}
          <div
            style={{
              marginTop: "30px",
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow:
                "0 3px 10px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                color: "#172b4d",
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

              <div>
                🟢 Student Service
                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#12b76a",
                  }}
                >
                  Connected
                </strong>
              </div>

              <div>
                🟢 Course Service
                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#12b76a",
                  }}
                >
                  Connected
                </strong>
              </div>

              <div>
                🟢 Admission Service
                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#12b76a",
                  }}
                >
                  Connected
                </strong>
              </div>

              <div>
                🟢 API Gateway
                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#12b76a",
                  }}
                >
                  Connected
                </strong>
              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Dashboard;
