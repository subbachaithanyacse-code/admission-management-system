import React, { useEffect, useState } from "react";

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [admissions, setAdmissions] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    "https://admission-api-gateway.onrender.com";

  const getCount = (data, key) => {
    if (Array.isArray(data)) {
      return data.length;
    }

    if (data && Array.isArray(data[key])) {
      return data[key].length;
    }

    if (data && Array.isArray(data.data)) {
      return data.data.length;
    }

    if (data && typeof data.count === "number") {
      return data.count;
    }

    return 0;
  };

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

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    console.log("========================================");
    console.log("API Gateway:", API_BASE_URL);

    const results = await Promise.allSettled([
      fetchAPI(`${API_BASE_URL}/students`),
      fetchAPI(`${API_BASE_URL}/courses`),
      fetchAPI(`${API_BASE_URL}/admissions`),
    ]);

    if (results[0].status === "fulfilled") {
      const count = getCount(
        results[0].value,
        "students"
      );

      console.log("Student Count:", count);
      setStudents(count);
    } else {
      console.error(
        "Students API Error:",
        results[0].reason
      );
    }

    if (results[1].status === "fulfilled") {
      const count = getCount(
        results[1].value,
        "courses"
      );

      console.log("Course Count:", count);
      setCourses(count);
    } else {
      console.error(
        "Courses API Error:",
        results[1].reason
      );
    }

    if (results[2].status === "fulfilled") {
      const count = getCount(
        results[2].value,
        "admissions"
      );

      console.log("Admission Count:", count);
      setAdmissions(count);
    } else {
      console.error(
        "Admissions API Error:",
        results[2].reason
      );
    }

    const failedServices = results.filter(
      (result) => result.status === "rejected"
    ).length;

    if (failedServices > 0) {
      setError(
        "Some services are temporarily unavailable. Please refresh again."
      );
    } else {
      setError("");
    }

    setLoading(false);
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

      {error && (
        <div
          style={{
            background: "#fff4e5",
            color: "#b54708",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #f5c26b",
          }}
        >
          ⚠️ {error}
        </div>
      )}

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
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
              <h3 style={{ color: "#667085" }}>
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

              <p style={{ color: "#98a2b3" }}>
                Registered students
              </p>
            </div>

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
              <h3 style={{ color: "#667085" }}>
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

              <p style={{ color: "#98a2b3" }}>
                Available courses
              </p>
            </div>

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
              <h3 style={{ color: "#667085" }}>
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

              <p style={{ color: "#98a2b3" }}>
                Student admissions
              </p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              marginTop: "30px",
              padding: "25px",
              borderRadius: "10px",
              boxShadow:
                "0 3px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                color: "#172b4d",
                marginTop: 0,
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
                🟢 <strong>Student Service</strong>
                <br />
                <span style={{ color: "#12b76a" }}>
                  Connected
                </span>
              </div>

              <div>
                🟢 <strong>Course Service</strong>
                <br />
                <span style={{ color: "#12b76a" }}>
                  Connected
                </span>
              </div>

              <div>
                🟢 <strong>Admission Service</strong>
                <br />
                <span style={{ color: "#12b76a" }}>
                  Connected
                </span>
              </div>

              <div>
                🟢 <strong>API Gateway</strong>
                <br />
                <span style={{ color: "#12b76a" }}>
                  Connected
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;