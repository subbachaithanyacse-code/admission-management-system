import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    fullname: "",
    email: "",
    phone: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudent = async (e) => {
    e.preventDefault();

    if (
      !student.fullname ||
      !student.email ||
      !student.phone ||
      !student.course
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending student:", student);

      const response = await api.post("/students", student);

      console.log("Student API response:", response.data);

      alert("Student Added Successfully");

      navigate("/students");
    } catch (error) {
      console.error("Add Student Error:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        alert(`Failed To Add Student: ${error.response.data}`);
      } else {
        alert("Unable to connect to API Gateway");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Student</h2>

      <form onSubmit={saveStudent}>
        <div>
          <label>Student Name</label>
          <br />
          <input
            type="text"
            name="fullname"
            placeholder="Student Name"
            value={student.fullname}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Phone</label>
          <br />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={student.phone}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Course</label>
          <br />
          <input
            type="text"
            name="course"
            placeholder="Course e.g. CSE"
            value={student.course}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;
