package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"
	"strconv"
	"strings"

	"student-service/Database"
	models "student-service/Models"

	"github.com/gorilla/mux"
)

// =====================================================
// VALIDATION
// =====================================================

func validateStudent(student models.Student) string {

	student.FullName = strings.TrimSpace(student.FullName)
	student.Email = strings.TrimSpace(student.Email)
	student.Phone = strings.TrimSpace(student.Phone)
	student.Course = strings.TrimSpace(student.Course)

	if student.FullName == "" {
		return "Full name is required"
	}

	if student.Email == "" {
		return "Email is required"
	}

	_, err := mail.ParseAddress(student.Email)
	if err != nil {
		return "Invalid email format"
	}

	if student.Phone == "" {
		return "Phone is required"
	}

	// Basic phone validation.
	// Allows digits and +.
	for _, ch := range student.Phone {
		if (ch < '0' || ch > '9') && ch != '+' {
			return "Invalid phone number"
		}
	}

	if len(student.Phone) < 7 || len(student.Phone) > 15 {
		return "Phone number must contain 7 to 15 characters"
	}

	if student.Course == "" {
		return "Course is required"
	}

	return ""
}

// =====================================================
// CREATE STUDENT
// =====================================================

func CreateStudent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var student models.Student

	err := json.NewDecoder(r.Body).Decode(&student)

	if err != nil {
		http.Error(
			w,
			"Invalid JSON data",
			http.StatusBadRequest,
		)
		return
	}

	// Clean input
	student.FullName = strings.TrimSpace(student.FullName)
	student.Email = strings.TrimSpace(student.Email)
	student.Phone = strings.TrimSpace(student.Phone)
	student.Course = strings.TrimSpace(student.Course)

	// Validate
	if message := validateStudent(student); message != "" {
		http.Error(
			w,
			message,
			http.StatusBadRequest,
		)
		return
	}

	// Check duplicate email before INSERT
	var existingID int

	err = Database.DB.QueryRow(
		context.Background(),
		"SELECT id FROM students WHERE LOWER(email)=LOWER($1)",
		student.Email,
	).Scan(&existingID)

	if err == nil {
		http.Error(
			w,
			"Student with this email already exists",
			http.StatusConflict,
		)
		return
	}

	// Insert student
	var newID int

	err = Database.DB.QueryRow(
		context.Background(),
		`INSERT INTO students
		(fullname, email, phone, course)
		VALUES ($1, $2, $3, $4)
		RETURNING id`,
		student.FullName,
		student.Email,
		student.Phone,
		student.Course,
	).Scan(&newID)

	if err != nil {

		fmt.Println("INSERT ERROR:", err)

		// PostgreSQL duplicate protection
		if strings.Contains(err.Error(), "students_email_key") {
			http.Error(
				w,
				"Student with this email already exists",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			"Failed to create student",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Student Added Successfully",
		"id":      newID,
	})
}

// =====================================================
// GET ALL STUDENTS - PAGINATION
// =====================================================

func GetStudents(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	// -------------------------------------------------
	// Default pagination
	// -------------------------------------------------

	page := 1
	limit := 10

	// -------------------------------------------------
	// Read page parameter
	// Example:
	// /students?page=2
	// -------------------------------------------------

	if pageValue := r.URL.Query().Get("page"); pageValue != "" {

		value, err := strconv.Atoi(pageValue)

		if err != nil || value <= 0 {
			http.Error(
				w,
				"Invalid page number",
				http.StatusBadRequest,
			)
			return
		}

		page = value
	}

	// -------------------------------------------------
	// Read limit parameter
	// Example:
	// /students?limit=20
	// -------------------------------------------------

	if limitValue := r.URL.Query().Get("limit"); limitValue != "" {

		value, err := strconv.Atoi(limitValue)

		if err != nil || value <= 0 {
			http.Error(
				w,
				"Invalid limit",
				http.StatusBadRequest,
			)
			return
		}

		limit = value
	}

	// -------------------------------------------------
	// Maximum API response limit
	// -------------------------------------------------

	if limit > 100 {
		http.Error(
			w,
			"Maximum limit is 100 records per request",
			http.StatusBadRequest,
		)
		return
	}

	// -------------------------------------------------
	// Calculate OFFSET
	// -------------------------------------------------

	offset := (page - 1) * limit

	// -------------------------------------------------
	// Get total student count
	// -------------------------------------------------

	var totalStudents int

	err := Database.DB.QueryRow(
		context.Background(),
		"SELECT COUNT(*) FROM students",
	).Scan(&totalStudents)

	if err != nil {

		fmt.Println("COUNT ERROR:", err)

		http.Error(
			w,
			"Failed to count students",
			http.StatusInternalServerError,
		)
		return
	}

	// -------------------------------------------------
	// Get paginated students
	// -------------------------------------------------

	rows, err := Database.DB.Query(
		context.Background(),
		`SELECT id, fullname, email, phone, course
		 FROM students
		 ORDER BY id
		 LIMIT $1 OFFSET $2`,
		limit,
		offset,
	)

	if err != nil {

		fmt.Println("QUERY ERROR:", err)

		http.Error(
			w,
			"Failed to fetch students",
			http.StatusInternalServerError,
		)
		return
	}

	defer rows.Close()

	students := make([]models.Student, 0)

	for rows.Next() {

		var student models.Student

		err := rows.Scan(
			&student.ID,
			&student.FullName,
			&student.Email,
			&student.Phone,
			&student.Course,
		)

		if err != nil {

			fmt.Println("SCAN ERROR:", err)

			http.Error(
				w,
				"Failed to read student data",
				http.StatusInternalServerError,
			)
			return
		}

		students = append(students, student)
	}

	// -------------------------------------------------
	// Check rows error
	// -------------------------------------------------

	if err := rows.Err(); err != nil {

		fmt.Println("ROWS ERROR:", err)

		http.Error(
			w,
			"Failed to read students",
			http.StatusInternalServerError,
		)
		return
	}

	// -------------------------------------------------
	// Calculate total pages
	// -------------------------------------------------

	totalPages := 0

	if totalStudents > 0 {
		totalPages = (totalStudents + limit - 1) / limit
	}

	// -------------------------------------------------
	// Pagination response headers
	// -------------------------------------------------

	w.Header().Set(
		"X-Total-Count",
		strconv.Itoa(totalStudents),
	)

	w.Header().Set(
		"X-Page",
		strconv.Itoa(page),
	)

	w.Header().Set(
		"X-Limit",
		strconv.Itoa(limit),
	)

	w.Header().Set(
		"X-Total-Pages",
		strconv.Itoa(totalPages),
	)

	// -------------------------------------------------
	// Return students
	// -------------------------------------------------

	json.NewEncoder(w).Encode(students)
}

// =====================================================
// GET STUDENT BY ID
// =====================================================

func GetStudentByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid student ID",
			http.StatusBadRequest,
		)
		return
	}

	var student models.Student

	err = Database.DB.QueryRow(
		context.Background(),
		`SELECT id, fullname, email, phone, course
		 FROM students
		 WHERE id=$1`,
		id,
	).Scan(
		&student.ID,
		&student.FullName,
		&student.Email,
		&student.Phone,
		&student.Course,
	)

	if err != nil {

		fmt.Println("GET ERROR:", err)

		http.Error(
			w,
			"Student Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(student)
}

// =====================================================
// UPDATE STUDENT
// =====================================================

func UpdateStudent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid student ID",
			http.StatusBadRequest,
		)
		return
	}

	var student models.Student

	err = json.NewDecoder(r.Body).Decode(&student)

	if err != nil {
		http.Error(
			w,
			"Invalid JSON data",
			http.StatusBadRequest,
		)
		return
	}

	// Clean input
	student.FullName = strings.TrimSpace(student.FullName)
	student.Email = strings.TrimSpace(student.Email)
	student.Phone = strings.TrimSpace(student.Phone)
	student.Course = strings.TrimSpace(student.Course)

	// Validate
	if message := validateStudent(student); message != "" {
		http.Error(
			w,
			message,
			http.StatusBadRequest,
		)
		return
	}

	// Check whether another student already owns this email
	var existingID int

	err = Database.DB.QueryRow(
		context.Background(),
		`SELECT id
		 FROM students
		 WHERE LOWER(email)=LOWER($1)
		 AND id <> $2`,
		student.Email,
		id,
	).Scan(&existingID)

	if err == nil {

		http.Error(
			w,
			"Another student already uses this email",
			http.StatusConflict,
		)
		return
	}

	// Update
	result, err := Database.DB.Exec(
		context.Background(),
		`UPDATE students
		 SET fullname=$1,
		     email=$2,
		     phone=$3,
		     course=$4
		 WHERE id=$5`,
		student.FullName,
		student.Email,
		student.Phone,
		student.Course,
		id,
	)

	if err != nil {

		fmt.Println("UPDATE ERROR:", err)

		if strings.Contains(err.Error(), "students_email_key") {
			http.Error(
				w,
				"Another student already uses this email",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			"Failed to update student",
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Student Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Student Updated Successfully",
	})
}

// =====================================================
// DELETE STUDENT
// =====================================================

func DeleteStudent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid student ID",
			http.StatusBadRequest,
		)
		return
	}

	result, err := Database.DB.Exec(
		context.Background(),
		"DELETE FROM students WHERE id=$1",
		id,
	)

	if err != nil {

		fmt.Println("DELETE ERROR:", err)

		// Student may be referenced by admissions
		if strings.Contains(err.Error(), "foreign key") {
			http.Error(
				w,
				"Cannot delete student because admissions exist for this student",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			"Failed to delete student",
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Student Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Student Deleted Successfully",
	})
}