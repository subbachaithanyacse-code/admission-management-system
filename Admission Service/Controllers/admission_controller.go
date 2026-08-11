package Controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"admission-service/Database"
	"admission-service/Models"

	"github.com/gorilla/mux"
)

// ============================================
// CREATE ADMISSION
// ============================================

func CreateAdmission(w http.ResponseWriter, r *http.Request) {

	type AdmissionRequest struct {
		StudentID     int    `json:"student_id"`
		CourseID      int    `json:"course_id"`
		AdmissionDate string `json:"admission_date"`
		Status        string `json:"status"`
	}

	var req AdmissionRequest

	// Read JSON
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(
			w,
			"Invalid Request Body",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// BASIC VALIDATION
	// ============================================

	if req.StudentID <= 0 {
		http.Error(
			w,
			"Invalid Student ID",
			http.StatusBadRequest,
		)
		return
	}

	if req.CourseID <= 0 {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	if req.AdmissionDate == "" {
		http.Error(
			w,
			"Admission Date is required",
			http.StatusBadRequest,
		)
		return
	}

	if req.Status == "" {
		http.Error(
			w,
			"Status is required",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// VALIDATE ADMISSION DATE
	// ============================================

	admissionDate, err := time.Parse(
		"2006-01-02",
		req.AdmissionDate,
	)

	if err != nil {
		http.Error(
			w,
			"Invalid Admission Date. Use YYYY-MM-DD",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// VALIDATE STATUS
	// ============================================

	if req.Status != "Pending" &&
		req.Status != "Approved" &&
		req.Status != "Rejected" {

		http.Error(
			w,
			"Invalid Status. Use Pending, Approved or Rejected",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// CHECK STUDENT EXISTS
	// ============================================

	var studentExists bool

	err = Database.DB.QueryRow(
		context.Background(),
		"SELECT EXISTS(SELECT 1 FROM students WHERE id=$1)",
		req.StudentID,
	).Scan(&studentExists)

	if err != nil {
		http.Error(
			w,
			"Unable to verify student",
			http.StatusInternalServerError,
		)
		return
	}

	if !studentExists {
		http.Error(
			w,
			"Student does not exist",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// CHECK COURSE EXISTS
	// ============================================

	var courseExists bool

	err = Database.DB.QueryRow(
		context.Background(),
		"SELECT EXISTS(SELECT 1 FROM courses WHERE id=$1)",
		req.CourseID,
	).Scan(&courseExists)

	if err != nil {
		http.Error(
			w,
			"Unable to verify course",
			http.StatusInternalServerError,
		)
		return
	}

	if !courseExists {
		http.Error(
			w,
			"Course does not exist",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// INSERT ADMISSION
	// ============================================

	_, err = Database.DB.Exec(
		context.Background(),
		`INSERT INTO admissions
		(student_id, course_id, admission_date, status)
		VALUES($1, $2, $3, $4)`,
		req.StudentID,
		req.CourseID,
		admissionDate,
		req.Status,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	// ============================================
	// SUCCESS RESPONSE
	// ============================================

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admission Added Successfully",
	})
}

// ============================================
// GET ALL ADMISSIONS
// ============================================

func GetAdmissions(w http.ResponseWriter, r *http.Request) {

	rows, err := Database.DB.Query(
		context.Background(),
		`SELECT
			id,
			student_id,
			course_id,
			admission_date,
			status,
			created_at
		FROM admissions
		ORDER BY id DESC`,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	defer rows.Close()

	var admissions []Models.Admission

	for rows.Next() {

		var admission Models.Admission

		err := rows.Scan(
			&admission.ID,
			&admission.StudentID,
			&admission.CourseID,
			&admission.AdmissionDate,
			&admission.Status,
			&admission.CreatedAt,
		)

		if err != nil {
			http.Error(
				w,
				err.Error(),
				http.StatusInternalServerError,
			)
			return
		}

		admissions = append(
			admissions,
			admission,
		)
	}

	// Check rows error
	if err := rows.Err(); err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(admissions)
}

// ============================================
// GET ADMISSION BY ID
// ============================================

func GetAdmissionByID(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Admission ID",
			http.StatusBadRequest,
		)
		return
	}

	var admission Models.Admission

	err = Database.DB.QueryRow(
		context.Background(),
		`SELECT
			id,
			student_id,
			course_id,
			admission_date,
			status,
			created_at
		FROM admissions
		WHERE id=$1`,
		id,
	).Scan(
		&admission.ID,
		&admission.StudentID,
		&admission.CourseID,
		&admission.AdmissionDate,
		&admission.Status,
		&admission.CreatedAt,
	)

	if err != nil {
		http.Error(
			w,
			"Admission Not Found",
			http.StatusNotFound,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(admission)
}

// ============================================
// UPDATE ADMISSION
// ============================================

func UpdateAdmission(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Admission ID",
			http.StatusBadRequest,
		)
		return
	}

	type AdmissionRequest struct {
		StudentID     int    `json:"student_id"`
		CourseID      int    `json:"course_id"`
		AdmissionDate string `json:"admission_date"`
		Status        string `json:"status"`
	}

	var req AdmissionRequest

	err = json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(
			w,
			"Invalid Request Body",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// BASIC VALIDATION
	// ============================================

	if req.StudentID <= 0 {
		http.Error(
			w,
			"Invalid Student ID",
			http.StatusBadRequest,
		)
		return
	}

	if req.CourseID <= 0 {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	if req.AdmissionDate == "" {
		http.Error(
			w,
			"Admission Date is required",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// DATE VALIDATION
	// ============================================

	admissionDate, err := time.Parse(
		"2006-01-02",
		req.AdmissionDate,
	)

	if err != nil {
		http.Error(
			w,
			"Invalid Admission Date. Use YYYY-MM-DD",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// STATUS VALIDATION
	// ============================================

	if req.Status != "Pending" &&
		req.Status != "Approved" &&
		req.Status != "Rejected" {

		http.Error(
			w,
			"Invalid Status. Use Pending, Approved or Rejected",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// CHECK STUDENT
	// ============================================

	var studentExists bool

	err = Database.DB.QueryRow(
		context.Background(),
		"SELECT EXISTS(SELECT 1 FROM students WHERE id=$1)",
		req.StudentID,
	).Scan(&studentExists)

	if err != nil {
		http.Error(
			w,
			"Unable to verify student",
			http.StatusInternalServerError,
		)
		return
	}

	if !studentExists {
		http.Error(
			w,
			"Student does not exist",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// CHECK COURSE
	// ============================================

	var courseExists bool

	err = Database.DB.QueryRow(
		context.Background(),
		"SELECT EXISTS(SELECT 1 FROM courses WHERE id=$1)",
		req.CourseID,
	).Scan(&courseExists)

	if err != nil {
		http.Error(
			w,
			"Unable to verify course",
			http.StatusInternalServerError,
		)
		return
	}

	if !courseExists {
		http.Error(
			w,
			"Course does not exist",
			http.StatusBadRequest,
		)
		return
	}

	// ============================================
	// UPDATE
	// ============================================

	result, err := Database.DB.Exec(
		context.Background(),
		`UPDATE admissions
		SET
			student_id=$1,
			course_id=$2,
			admission_date=$3,
			status=$4
		WHERE id=$5`,
		req.StudentID,
		req.CourseID,
		admissionDate,
		req.Status,
		id,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	// Check whether record exists
	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Admission Not Found",
			http.StatusNotFound,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admission Updated Successfully",
	})
}

// ============================================
// DELETE ADMISSION
// ============================================

func DeleteAdmission(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Admission ID",
			http.StatusBadRequest,
		)
		return
	}

	result, err := Database.DB.Exec(
		context.Background(),
		"DELETE FROM admissions WHERE id=$1",
		id,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Admission Not Found",
			http.StatusNotFound,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admission Deleted Successfully",
	})
}