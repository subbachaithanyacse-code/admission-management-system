package main

import (
	"fmt"
	"net/http"
	"os"

	"student-service/Database"
	"student-service/Routes"

	"github.com/gorilla/mux"
)

func main() {

	// ==========================================
	// Database Connection
	// ==========================================
	Database.ConnectDB()

	// ==========================================
	// Create Router
	// ==========================================
	router := mux.NewRouter()

	// ==========================================
	// Register Student Routes
	// ==========================================
	Routes.RegisterStudentRoutes(router)

	// ==========================================
	// PORT
	// ==========================================
	// Render provides PORT automatically.
	// Local system uses 8081.
	port := os.Getenv("PORT")

	if port == "" {
		port = "8081"
	}

	// ==========================================
	// Server Information
	// ==========================================
	fmt.Println("===================================")
	fmt.Println("     ADMISSION STUDENT SERVICE")
	fmt.Println("===================================")
	fmt.Println("Database Connected Successfully")
	fmt.Println("Student Service Started")
	fmt.Println("Running on Port :", port)
	fmt.Println("===================================")

	// ==========================================
	// Start Server
	// ==========================================
	err := http.ListenAndServe(":"+port, router)

	if err != nil {
		fmt.Println("Server Error:", err)
	}
}
