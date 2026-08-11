import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddStudent() {

  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudent = async (e) => {
    e.preventDefault();

    try {

      await api.post("/students", student);

      alert("Student Added Successfully");

      navigate("/students");

    } catch (error) {

      console.log(error);

      alert("Failed To Add Student");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Add Student</h2>

      <form onSubmit={saveStudent}>

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={student.phone}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Save Student
        </button>

      </form>

    </div>
  );
}

export default AddStudent;