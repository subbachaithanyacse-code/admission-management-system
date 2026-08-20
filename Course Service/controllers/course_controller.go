package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"course-service/database"
	"course-service/models"

	"github.com/gorilla/mux"
)

// =====================================================
// CREATE COURSE
// POST /courses
// =====================================================

func CreateCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var course models.Course

	err := json.NewDecoder(r.Body).Decode(&course)

	if err != nil {
		http.Error(
			w,
			"Invalid Request",
			http.StatusBadRequest,
		)
		return
	}

	// Validation
	if strings.TrimSpace(course.CourseCode) == "" {
		http.Error(
			w,
			"Course Code is required",
			http.StatusBadRequest,
		)
		return
	}

	if strings.TrimSpace(course.CourseName) == "" {
		http.Error(
			w,
			"Course Name is required",
			http.StatusBadRequest,
		)
		return
	}

	if course.Fee < 0 {
		http.Error(
			w,
			"Fee cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	if course.Seats < 0 {
		http.Error(
			w,
			"Seats cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	// Check database connection
	if database.DB == nil {
		http.Error(
			w,
			"Database connection unavailable",
			http.StatusInternalServerError,
		)
		return
	}

	// Insert course
	_, err = database.DB.Exec(
		context.Background(),
		`INSERT INTO courses
		(course_code, course_name, duration, fee, seats)
		VALUES ($1, $2, $3, $4, $5)`,
		course.CourseCode,
		course.CourseName,
		course.Duration,
		course.Fee,
		course.Seats,
	)

	if err != nil {

		if strings.Contains(
			strings.ToLower(err.Error()),
			"unique",
		) {
			http.Error(
				w,
				"Course Code already exists",
				http.StatusConflict,
			)
			return
		}

		fmt.Println("CREATE COURSE ERROR:", err)

		http.Error(
			w,
			"Failed to create course",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "Course Added Successfully",
		},
	)
}

// =====================================================
// GET ALL COURSES
// GET /courses?page=1&limit=10
// =====================================================

func GetCourses(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	page := 1
	limit := 10

	// Page
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

	// Limit
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

	// Maximum 100 records per request
	if limit > 100 {
		http.Error(
			w,
			"Maximum limit is 100 records per request",
			http.StatusBadRequest,
		)
		return
	}

	if database.DB == nil {
		http.Error(
			w,
			"Database connection unavailable",
			http.StatusInternalServerError,
		)
		return
	}

	offset := (page - 1) * limit

	// Total course count
	var totalCourses int

	err := database.DB.QueryRow(
		context.Background(),
		"SELECT COUNT(*) FROM courses",
	).Scan(&totalCourses)

	if err != nil {

    fmt.Println("COURSE COUNT ERROR:", err)

    http.Error(
        w,
        "COURSE COUNT ERROR: "+err.Error(),
        http.StatusInternalServerError,
    )
    return
}

	// Paginated query
	rows, err := database.DB.Query(
		context.Background(),
		`SELECT
			id,
			course_code,
			course_name,
			duration,
			fee,
			seats,
			created_at
		FROM courses
		ORDER BY id
		LIMIT $1 OFFSET $2`,
		limit,
		offset,
	)

	if err != nil {

		fmt.Println("COURSE QUERY ERROR:", err)

		http.Error(w, "COURSE FETCH ERROR: "+err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	courses := make([]models.Course, 0)

	for rows.Next() {

		var course models.Course

		err := rows.Scan(
			&course.ID,
			&course.CourseCode,
			&course.CourseName,
			&course.Duration,
			&course.Fee,
			&course.Seats,
			&course.CreatedAt,
		)

		if err != nil {

			fmt.Println("COURSE SCAN ERROR:", err)

			http.Error(
				w,
				"Failed to read course data",
				http.StatusInternalServerError,
			)
			return
		}

		courses = append(courses, course)
	}

	if err := rows.Err(); err != nil {

		fmt.Println("COURSE ROWS ERROR:", err)

		http.Error(
			w,
			"Failed to read courses",
			http.StatusInternalServerError,
		)
		return
	}

	// Total pages
	totalPages := 0

	if totalCourses > 0 {
		totalPages = (totalCourses + limit - 1) / limit
	}

	// Pagination headers
	w.Header().Set(
		"X-Total-Count",
		strconv.Itoa(totalCourses),
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

	json.NewEncoder(w).Encode(courses)
}

// =====================================================
// GET COURSE BY ID
// GET /courses/{id}
// =====================================================

func GetCourseByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	if database.DB == nil {
		http.Error(
			w,
			"Database connection unavailable",
			http.StatusInternalServerError,
		)
		return
	}

	var course models.Course

	err = database.DB.QueryRow(
		context.Background(),
		`SELECT
			id,
			course_code,
			course_name,
			duration,
			fee,
			seats,
			created_at
		FROM courses
		WHERE id=$1`,
		id,
	).Scan(
		&course.ID,
		&course.CourseCode,
		&course.CourseName,
		&course.Duration,
		&course.Fee,
		&course.Seats,
		&course.CreatedAt,
	)

	if err != nil {

		fmt.Println("GET COURSE ERROR:", err)

		http.Error(
			w,
			"Course Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(course)
}

// =====================================================
// UPDATE COURSE
// PUT /courses/{id}
// =====================================================

func UpdateCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	var course models.Course

	err = json.NewDecoder(r.Body).Decode(&course)

	if err != nil {
		http.Error(
			w,
			"Invalid Request",
			http.StatusBadRequest,
		)
		return
	}

	// Validation
	if strings.TrimSpace(course.CourseCode) == "" {
		http.Error(
			w,
			"Course Code is required",
			http.StatusBadRequest,
		)
		return
	}

	if strings.TrimSpace(course.CourseName) == "" {
		http.Error(
			w,
			"Course Name is required",
			http.StatusBadRequest,
		)
		return
	}

	if course.Fee < 0 {
		http.Error(
			w,
			"Fee cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	if course.Seats < 0 {
		http.Error(
			w,
			"Seats cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	if database.DB == nil {
		http.Error(
			w,
			"Database connection unavailable",
			http.StatusInternalServerError,
		)
		return
	}

	result, err := database.DB.Exec(
		context.Background(),
		`UPDATE courses
		SET
			course_code=$1,
			course_name=$2,
			duration=$3,
			fee=$4,
			seats=$5
		WHERE id=$6`,
		course.CourseCode,
		course.CourseName,
		course.Duration,
		course.Fee,
		course.Seats,
		id,
	)

	if err != nil {

		fmt.Println("UPDATE COURSE ERROR:", err)

		if strings.Contains(
			strings.ToLower(err.Error()),
			"unique",
		) {
			http.Error(
				w,
				"Course Code already exists",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			"Failed to update course",
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Course Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "Course Updated Successfully",
		},
	)
}

// =====================================================
// DELETE COURSE
// DELETE /courses/{id}
// =====================================================

func DeleteCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil || id <= 0 {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	if database.DB == nil {
		http.Error(
			w,
			"Database connection unavailable",
			http.StatusInternalServerError,
		)
		return
	}

	result, err := database.DB.Exec(
		context.Background(),
		"DELETE FROM courses WHERE id=$1",
		id,
	)

	if err != nil {

		fmt.Println("DELETE COURSE ERROR:", err)

		if strings.Contains(
			strings.ToLower(err.Error()),
			"foreign key",
		) {
			http.Error(
				w,
				"Cannot delete course because admissions exist for this course",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			"Failed to delete course",
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"Course Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "Course Deleted Successfully",
		},
	)
}
