import React, { useEffect, useState } from "react";

function Students() {
  const API = "https://admission-api-gateway.onrender.com";

  const [students, setStudents] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================
  // LOAD STUDENTS
  // =========================================

  useEffect(() => {
    getStudents();
  }, [page, limit]);

  const getStudents = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API}/students?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setStudents(Array.isArray(data) ? data : []);

      // Pagination headers
      const totalCount = response.headers.get("X-Total-Count");
      const pages = response.headers.get("X-Total-Pages");

      setTotalRecords(
        totalCount ? Number(totalCount) : 0
      );

      setTotalPages(
        pages ? Number(pages) : 0
      );

    } catch (error) {
      console.error("Students Error:", error);

      setMessage(
        "Unable to load students: " + error.message
      );

      setStudents([]);
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
              color: "#1f2937",
            }}
          >
            Student Management
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Manage student records
          </p>
        </div>

        <button
          onClick={getStudents}
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

      {/* MESSAGE */}

      {message && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {message}
        </div>
      )}

      {/* SUMMARY */}

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
            <b>Total Students:</b>{" "}
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
                border: "1px solid #d1d5db",
                borderRadius: "5px",
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            color: "#1f2937",
          }}
        >
          👨‍🎓 Students
        </h2>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            Loading students...
          </div>
        ) : (

          <div style={{ overflowX: "auto" }}>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px",
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
                    Full Name
                  </th>

                  <th style={tableHeaderStyle}>
                    Email
                  </th>

                  <th style={tableHeaderStyle}>
                    Phone
                  </th>

                  <th style={tableHeaderStyle}>
                    Course
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.length > 0 ? (

                  students.map((student) => (

                    <tr
                      key={student.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >

                      <td style={tableCellStyle}>
                        {student.id}
                      </td>

                      <td style={tableCellStyle}>
                        <b>
                          {student.fullname}
                        </b>
                      </td>

                      <td style={tableCellStyle}>
                        {student.email}
                      </td>

                      <td style={tableCellStyle}>
                        {student.phone}
                      </td>

                      <td style={tableCellStyle}>
                        {student.course}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#777",
                      }}
                    >
                      No students found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

        {/* PAGINATION */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={previousPage}
            disabled={page === 1 || loading}
            style={paginationButtonStyle(
              page === 1 || loading
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
            Page {page} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={
              page === totalPages ||
              totalPages === 0 ||
              loading
            }
            style={paginationButtonStyle(
              page === totalPages ||
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

export default Students;
