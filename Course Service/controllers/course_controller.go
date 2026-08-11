package Controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"course-service/Database"
	"course-service/Models"

	"github.com/gorilla/mux"
)

// Create Course
func CreateCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var course Models.Course

	err := json.NewDecoder(r.Body).Decode(&course)

	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	// Validation
	if strings.TrimSpace(course.CourseCode) == "" {
		http.Error(w, "Course Code is required", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(course.CourseName) == "" {
		http.Error(w, "Course Name is required", http.StatusBadRequest)
		return
	}

	if course.Fee < 0 {
		http.Error(w, "Fee cannot be negative", http.StatusBadRequest)
		return
	}

	if course.Seats < 0 {
		http.Error(w, "Seats cannot be negative", http.StatusBadRequest)
		return
	}

	// Insert Course
	_, err = Database.DB.Exec(
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

		// Duplicate course code
		if strings.Contains(strings.ToLower(err.Error()), "unique") {
			http.Error(
				w,
				"Course Code already exists",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Course Added Successfully",
	})
}

// Get All Courses
func GetCourses(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	rows, err := Database.DB.Query(
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
		ORDER BY id`,
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

	var courses []Models.Course

	for rows.Next() {

		var course Models.Course

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
			http.Error(
				w,
				err.Error(),
				http.StatusInternalServerError,
			)
			return
		}

		courses = append(courses, course)
	}

	json.NewEncoder(w).Encode(courses)
}

// Get Course By ID
func GetCourseByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	var course Models.Course

	err = Database.DB.QueryRow(
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
		http.Error(
			w,
			"Course Not Found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(course)
}

// Update Course
func UpdateCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	var course Models.Course

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

	_, err = Database.DB.Exec(
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

		if strings.Contains(strings.ToLower(err.Error()), "unique") {
			http.Error(
				w,
				"Course Code already exists",
				http.StatusConflict,
			)
			return
		}

		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Course Updated Successfully",
	})
}

// Delete Course
func DeleteCourse(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid Course ID",
			http.StatusBadRequest,
		)
		return
	}

	_, err = Database.DB.Exec(
		context.Background(),
		"DELETE FROM courses WHERE id=$1",
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

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Course Deleted Successfully",
	})
}