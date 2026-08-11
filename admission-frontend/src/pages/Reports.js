import React, { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const studentsResponse = await axios.get(
        "http://localhost:8086/students"
      );

      const coursesResponse = await axios.get(
        "http://localhost:8086/courses"
      );

      const admissionsResponse = await axios.get(
        "http://localhost:8086/admissions"
      );

      const studentsData = Array.isArray(studentsResponse.data)
        ? studentsResponse.data
        : [];

      const coursesData = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : [];

      const admissionsData = Array.isArray(admissionsResponse.data)
        ? admissionsResponse.data
        : [];

      setStudents(studentsData);
      setCourses(coursesData);
      setAdmissions(admissionsData);

    } catch (err) {
      console.error("Reports Error:", err);
      setError(
        "Unable to load report data. Please check API Gateway."
      );
    } finally {
      setLoading(false);
    }
  };

  const approved = admissions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "approved"
  ).length;

  const pending = admissions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "pending"
  ).length;

  const rejected = admissions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "rejected"
  ).length;

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>📊 Loading Reports...</h2>
      </div>
    );
  }

  return (
    <div>

      <div style={styles.header}>
        <div>
          <h1>📊 Reports</h1>

          <p style={styles.subtitle}>
            Admission Management System Reports
          </p>
        </div>

        <button
          onClick={loadReports}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.cards}>

        <Card
          icon="👨‍🎓"
          title="Total Students"
          value={students.length}
        />

        <Card
          icon="📚"
          title="Total Courses"
          value={courses.length}
        />

        <Card
          icon="📝"
          title="Total Admissions"
          value={admissions.length}
        />

        <Card
          icon="✅"
          title="Approved"
          value={approved}
        />

        <Card
          icon="⏳"
          title="Pending"
          value={pending}
        />

        <Card
          icon="❌"
          title="Rejected"
          value={rejected}
        />

      </div>

      <div style={styles.tableContainer}>

        <div style={styles.tableHeader}>
          <h2>Admission Report</h2>

          <span>
            {admissions.length} Records
          </span>
        </div>

        <table style={styles.table}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Course ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {admissions.length > 0 ? (

              admissions.map((admission) => (

                <tr key={admission.id}>

                  <td>
                    {admission.id}
                  </td>

                  <td>
                    {admission.student_id ??
                      admission.studentId ??
                      "-"}
                  </td>

                  <td>
                    {admission.course_id ??
                      admission.courseId ??
                      "-"}
                  </td>

                  <td>
                    <span style={styles.status}>
                      {admission.status || "Pending"}
                    </span>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="4"
                  style={styles.noData}
                >
                  📭 No Admissions Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div style={styles.card}>

      <div style={styles.icon}>
        {icon}
      </div>

      <div>
        <p style={styles.cardTitle}>
          {title}
        </p>

        <h2 style={styles.number}>
          {value}
        </h2>
      </div>

    </div>
  );
}

const styles = {
  center: {
    background: "white",
    padding: "60px",
    textAlign: "center",
    borderRadius: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  subtitle: {
    color: "#64748b",
  },

  refreshButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "30px",
  },

  cardTitle: {
    margin: 0,
    color: "#64748b",
  },

  number: {
    margin: "5px 0 0",
    color: "#0f172a",
  },

  tableContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  status: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  noData: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  },
};

export default Reports;