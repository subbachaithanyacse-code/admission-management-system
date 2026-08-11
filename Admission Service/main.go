package main

import (
	"fmt"
	"net/http"

	"admission-service/Database"
	"admission-service/Routes"

	"github.com/gorilla/mux"
)

func main() {

	// ============================================
	// CONNECT DATABASE
	// ============================================

	Database.ConnectDB()

	// Close database connection pool
	// when application stops
	defer Database.DB.Close()

	// ============================================
	// CREATE ROUTER
	// ============================================

	router := mux.NewRouter()

	// ============================================
	// REGISTER ROUTES
	// ============================================

	Routes.RegisterAdmissionRoutes(router)

	// ============================================
	// SERVER INFORMATION
	// ============================================

	fmt.Println("===================================")
	fmt.Println(" Admission Database Connected Successfully")
	fmt.Println(" Admission Service Started")
	fmt.Println(" Running on Port :8084")
	fmt.Println("===================================")

	// ============================================
	// START SERVER
	// ============================================

	err := http.ListenAndServe(":8084", router)

	if err != nil {
		fmt.Println("Admission Service Error:", err)
	}
}