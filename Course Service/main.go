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

	// Connect to PostgreSQL
	database.ConnectDB()

	// Create router
	router := mux.NewRouter()

	// Register course routes
	routes.RegisterCourseRoutes(router)

	// Render provides PORT through environment variable
	port := os.Getenv("PORT")

	// Local development
	if port == "" {
		port = "8085"
	}

	fmt.Println("===================================")
	fmt.Println("     COURSE SERVICE")
	fmt.Println("===================================")
	fmt.Println("Database Connected Successfully")
	fmt.Println("Course Service Started")
	fmt.Println("Running on Port :" + port)
	fmt.Println("===================================")

	err := http.ListenAndServe(":"+port, router)

	if err != nil {
		log.Fatal("Course Service Error:", err)
	}
}
