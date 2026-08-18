package Routes

import (
	"course-service/controllers"

	"github.com/gorilla/mux"
)

func RegisterCourseRoutes(router *mux.Router) {

	router.HandleFunc("/courses", Controllers.CreateCourse).Methods("POST")
	router.HandleFunc("/courses", Controllers.GetCourses).Methods("GET")
	router.HandleFunc("/courses/{id}", Controllers.GetCourseByID).Methods("GET")
	router.HandleFunc("/courses/{id}", Controllers.UpdateCourse).Methods("PUT")
	router.HandleFunc("/courses/{id}", Controllers.DeleteCourse).Methods("DELETE")
}