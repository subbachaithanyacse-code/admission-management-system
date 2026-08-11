package Routes

import (
	controllers "student-service/Controllers"

	"github.com/gorilla/mux"
)

// RegisterStudentRoutes registers all student API routes.
func RegisterStudentRoutes(router *mux.Router) {

	router.HandleFunc("/students", controllers.GetStudents).Methods("GET")

	router.HandleFunc("/students/{id}", controllers.GetStudentByID).Methods("GET")

	router.HandleFunc("/students", controllers.CreateStudent).Methods("POST")

	router.HandleFunc("/students/{id}", controllers.UpdateStudent).Methods("PUT")

	router.HandleFunc("/students/{id}", controllers.DeleteStudent).Methods("DELETE")
}