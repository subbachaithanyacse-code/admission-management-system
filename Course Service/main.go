package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"course-service/database"
	"course-service/routes"

	"github.com/gorilla/mux"
)

func main() {

	// Connect Database
	Database.ConnectDB()

	// Router
	router := mux.NewRouter()

	// Register Routes
	Routes.RegisterCourseRoutes(router)

	fmt.Println("===================================")
	fmt.Println(" Database Connected Successfully")
	fmt.Println(" Course Service Started")

	// Render provides PORT automatically.
	// For local development, use 8085.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	fmt.Println(" Running on Port :" + port)
	fmt.Println("===================================")

	// Start Server
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		log.Fatal("Course Service Error:", err)
	}
}