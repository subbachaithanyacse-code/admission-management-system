package Routes

import (
	"admission-service/Controllers"

	"github.com/gorilla/mux"
)

func RegisterAdmissionRoutes(router *mux.Router) {

	// =====================================
	// ADMISSION ROUTES
	// =====================================

	// Create Admission
	router.HandleFunc("/admissions", Controllers.CreateAdmission).Methods("POST")

	// Get All Admissions
	router.HandleFunc("/admissions", Controllers.GetAdmissions).Methods("GET")

	// Get Admission By ID
	router.HandleFunc("/admissions/{id}", Controllers.GetAdmissionByID).Methods("GET")

	// Update Admission
	router.HandleFunc("/admissions/{id}", Controllers.UpdateAdmission).Methods("PUT")

	// Delete Admission
	router.HandleFunc("/admissions/{id}", Controllers.DeleteAdmission).Methods("DELETE")


	// =====================================
	// LOGIN
	// =====================================

	router.HandleFunc("/login", Controllers.Login).Methods("POST")


	// =====================================
	// USER ROUTES
	// =====================================

	// Get All Users
	router.HandleFunc("/users", Controllers.GetUsers).Methods("GET")

	// Get User By ID
	router.HandleFunc("/users/{id}", Controllers.GetUserByID).Methods("GET")

	// Create User
	router.HandleFunc("/users", Controllers.CreateUser).Methods("POST")

	// Update User
	router.HandleFunc("/users/{id}", Controllers.UpdateUser).Methods("PUT")

	// Delete User
	router.HandleFunc("/users/{id}", Controllers.DeleteUser).Methods("DELETE")
}