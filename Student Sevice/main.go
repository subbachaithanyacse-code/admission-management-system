package main

import (
	"fmt"
	"net/http"

	"student-service/Database"
	"student-service/Routes"

	"github.com/gorilla/mux"
)

func main() {

	// Database Connection
	Database.ConnectDB()

	// Create Router
	router := mux.NewRouter()

	// Register Student Routes
	Routes.RegisterStudentRoutes(router)

	fmt.Println("===================================")
	fmt.Println(" Database Connected Successfully")
	fmt.Println(" Student Service Started")
	fmt.Println(" Running on Port :8081")
	fmt.Println("===================================")

	// Start Server
	err := http.ListenAndServe(":8081", router)
	if err != nil {
		fmt.Println("Server Error:", err)
	}
}