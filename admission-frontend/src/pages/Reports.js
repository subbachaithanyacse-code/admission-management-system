import React, { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const API = "https://admission-api-gateway.onrender.com";

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);

    try {
      const [studentRes, courseRes, admissionRes] = await Promise.all([
        axios.get(`${API}/students`),
        axios.get(`${API}/courses`),
        axios.get(`${API}/admissions`),
      ]);

      setStudents(
        Array.isArray(studentRes.data)
          ? studentRes.data
          : studentRes.data.students || studentRes.data.data || []
      );

      setCourses(
        Array.isArray(courseRes.data)
          ? courseRes.data
          : courseRes.data.courses || courseRes.data.data || []
      );

      setAdmissions(
        Array.isArray(admissionRes.data)
          ? admissionRes.data
          : admissionRes.data.admissions || admissionRes.data.data || []
      );
    } catch (error) {
      console.error("Reports loading error:", error);
      alert("Unable to load reports. Please check backend services.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Statistics
  // -----------------------------

  const approved = admissions.filter(
    (a) => String(a.status || "").toLowerCase() === "approved"
  ).length;

  const pending = admissions.filter(
    (a) => String(a.status || "").toLowerCase() === "pending"
  ).length;

  const rejected = admissions.filter(
    (a) => String(a.status || "").toLowerCase() === "rejected"
  ).length;

  // -----------------------------
  // Course-wise admissions
  // -----------------------------

  const getCourseName = (courseId) => {
    const course = courses.find(
      (c) => Number(c.id) === Number(courseId)
    );

    return course
      ? course.course_name || course.name || `Course ${courseId}`
      : `Course ${courseId}`;
  };

  const courseWiseAdmissions = courses.map((course) => {
    const count = admissions.filter(
      (a) => Number(a.course_id || a.courseId) === Number(course.id)
    ).length;

    return {
      id: course.id,
      name: course.course_name || course.name || "Unknown Course",
      count,
    };
  });

  // -----------------------------
  // Search + Status Filter
  // -----------------------------

  const filteredAdmissions = admissions.filter((admission) => {
    const status = String(admission.status || "");

    const studentId = String(
      admission.student_id || admission.studentId || ""
    );

    const courseId = String(
      admission.course_id || admission.courseId || ""
    );

    const courseName = getCourseName(
      admission.course_id || admission.courseId
    );

    const matchesSearch =
      studentId.toLowerCase().includes(search.toLowerCase()) ||
      courseId.toLowerCase().includes(search.toLowerCase()) ||
      courseName.toLowerCase().includes(search.toLowerCase()) ||
      status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // -----------------------------
  // Print
  // -----------------------------

  const printReport = () => {
    window.print();
  };

  return (
    <div className="reports-page">

      {/* Header */}
      <div className="reports-header">
        <div>
          <h1>📊 Reports</h1>
          <p>Admission Management System Reports</p>
        </div>

        <div className="report-actions">
          <button
            className="refresh-btn"
            onClick={loadReports}
            disabled={loading}
          >
            🔄 {loading ? "Loading..." : "Refresh"}
          </button>

          <button className="print-btn" onClick={printReport}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="report-cards">

        <div className="report-card students-card">
          <div className="card-icon">📊</div>
          <div>
            <h3>Total Students</h3>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="report-card courses-card">
          <div className="card-icon">📚</div>
          <div>
            <h3>Total Courses</h3>
            <h2>{courses.length}</h2>
          </div>
        </div>

        <div className="report-card admissions-card">
          <div className="card-icon">📝</div>
          <div>
            <h3>Total Admissions</h3>
            <h2>{admissions.length}</h2>
          </div>
        </div>

        <div className="report-card approved-card">
          <div className="card-icon">✅</div>
          <div>
            <h3>Approved</h3>
            <h2>{approved}</h2>
          </div>
        </div>

        <div className="report-card pending-card">
          <div className="card-icon">⏳</div>
          <div>
            <h3>Pending</h3>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="report-card rejected-card">
          <div className="card-icon">❌</div>
          <div>
            <h3>Rejected</h3>
            <h2>{rejected}</h2>
          </div>
        </div>

      </div>

      {/* Course Wise Admissions */}
      <div className="report-section">
        <div className="section-title">
          <h2>🎓 Course-wise Admissions</h2>
        </div>

        <div className="course-report-grid">
          {courseWiseAdmissions.length === 0 ? (
            <p className="no-data">No courses available.</p>
          ) : (
            courseWiseAdmissions.map((course) => (
              <div className="course-report-card" key={course.id}>
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <span>Admissions</span>
                </div>

                <div className="course-count">
                  {course.count}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Student / Admission Report */}
      <div className="report-section">

        <div className="section-header">
          <div>
            <h2>📋 Student / Admission Report</h2>
            <p>{filteredAdmissions.length} records found</p>
          </div>

          <div className="filters">

            <input
              type="text"
              placeholder="🔍 Search student/course/status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>
        </div>

        <div className="table-container">

          <table className="report-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Course</th>
                <th>Admission Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredAdmissions.length === 0 ? (

                <tr>
                  <td colSpan="5" className="no-data">
                    No admission records found.
                  </td>
                </tr>

              ) : (

                filteredAdmissions.map((admission, index) => {

                  const status = String(
                    admission.status || "Pending"
                  );

                  const admissionDate =
                    admission.admission_date ||
                    admission.admissionDate ||
                    admission.created_at ||
                    admission.createdAt;

                  return (
                    <tr key={admission.id || index}>

                      <td>{index + 1}</td>

                      <td>
                        {admission.student_id ||
                          admission.studentId ||
                          "-"}
                      </td>

                      <td>
                        {getCourseName(
                          admission.course_id ||
                            admission.courseId
                        )}
                      </td>

                      <td>
                        {admissionDate
                          ? new Date(admissionDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${status.toLowerCase()}`}
                        >
                          {status === "Approved" && "✅ "}
                          {status === "Pending" && "⏳ "}
                          {status === "Rejected" && "❌ "}
                          {status}
                        </span>
                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Print Footer */}
      <div className="report-footer">
        <p>
          Generated from Admission Management System
        </p>
      </div>

      {/* Page CSS */}
      <style>{`

        .reports-page {
          padding: 25px;
          background: #f5f7fb;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .reports-header h1 {
          margin: 0;
          font-size: 30px;
          color: #1f2937;
        }

        .reports-header p {
          margin: 6px 0 0;
          color: #6b7280;
        }

        .report-actions {
          display: flex;
          gap: 10px;
        }

        .report-actions button {
          border: none;
          padding: 11px 17px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .refresh-btn {
          background: #2563eb;
          color: white;
        }

        .print-btn {
          background: #111827;
          color: white;
        }

        .report-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .report-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .report-card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.07);
          border-left: 5px solid #2563eb;
        }

        .report-card .card-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          border-radius: 12px;
          font-size: 25px;
        }

        .report-card h3 {
          margin: 0 0 6px;
          font-size: 15px;
          color: #6b7280;
        }

        .report-card h2 {
          margin: 0;
          font-size: 28px;
          color: #111827;
        }

        .approved-card {
          border-left-color: #16a34a;
        }

        .pending-card {
          border-left-color: #f59e0b;
        }

        .rejected-card {
          border-left-color: #dc2626;
        }

        .courses-card {
          border-left-color: #7c3aed;
        }

        .admissions-card {
          border-left-color: #0891b2;
        }

        .report-section {
          background: white;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 25px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.06);
        }

        .section-title h2,
        .section-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 21px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 15px;
        }

        .section-header p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .course-report-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 18px;
        }

        .course-report-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafafa;
        }

        .course-info h3 {
          margin: 0 0 5px;
          font-size: 16px;
          color: #1f2937;
        }

        .course-info span {
          font-size: 12px;
          color: #6b7280;
        }

        .course-count {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .search-input,
        .status-filter {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background: white;
        }

        .search-input {
          width: 250px;
        }

        .search-input:focus,
        .status-filter:focus {
          border-color: #2563eb;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
        }

        .report-table th {
          background: #f3f4f6;
          color: #374151;
          padding: 13px;
          text-align: left;
          font-size: 14px;
        }

        .report-table td {
          padding: 13px;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
          font-size: 14px;
        }

        .report-table tbody tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.approved {
          background: #dcfce7;
          color: #15803d;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #b45309;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .no-data {
          text-align: center;
          padding: 25px !important;
          color: #6b7280;
        }

        .report-footer {
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          padding: 10px;
        }

        @media (max-width: 900px) {

          .report-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .course-report-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

        }

        @media (max-width: 600px) {

          .reports-page {
            padding: 15px;
          }

          .reports-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .report-cards {
            grid-template-columns: 1fr;
          }

          .course-report-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            width: 100%;
            flex-direction: column;
          }

          .search-input {
            width: auto;
          }

        }

        @media print {

          .reports-page {
            background: white;
            padding: 0;
          }

          .report-actions,
          .filters {
            display: none !important;
          }

          .report-section,
          .report-card {
            box-shadow: none;
          }

          .report-cards {
            grid-template-columns: repeat(3, 1fr);
          }

          .course-report-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .report-table {
            font-size: 11px;
          }

        }

      `}</style>

    </div>
  );
}

export default Reports;
