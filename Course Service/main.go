package main

import (
	"fmt"
	"log"
	"net/http"

	"course-service/Database"
	"course-service/Routes"

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
	fmt.Println(" Running on Port :8085")
	fmt.Println("===================================")

	// Start Server
	err := http.ListenAndServe(":8085", router)
	if err != nil {
		log.Fatal("Course Service Error:", err)
	}
}