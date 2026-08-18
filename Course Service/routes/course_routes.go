package routes

import (
	"net/http"

	"course-service/controllers"

	"github.com/gorilla/mux"
)

func RegisterCourseRoutes(router *mux.Router) {

	// Create Course
	router.HandleFunc(
		"/courses",
		controllers.CreateCourse,
	).Methods(http.MethodPost)

	// Get Courses with pagination
	router.HandleFunc(
		"/courses",
		controllers.GetCourses,
	).Methods(http.MethodGet)

	// Get Course by ID
	router.HandleFunc(
		"/courses/{id}",
		controllers.GetCourseByID,
	).Methods(http.MethodGet)

	// Update Course
	router.HandleFunc(
		"/courses/{id}",
		controllers.UpdateCourse,
	).Methods(http.MethodPut)

	// Delete Course
	router.HandleFunc(
		"/courses/{id}",
		controllers.DeleteCourse,
	).Methods(http.MethodDelete)
}
