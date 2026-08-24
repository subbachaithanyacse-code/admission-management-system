package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

	// ============================================
	// CREATE ROUTER
	// ============================================

	router := mux.NewRouter()

	// ============================================
	// SERVICE URLs
	// ============================================

	studentService := os.Getenv("STUDENT_SERVICE_URL")
	courseService := os.Getenv("COURSE_SERVICE_URL")
	admissionService := os.Getenv("ADMISSION_SERVICE_URL")

	fmt.Println("===================================")
	fmt.Println(" API Gateway Service URLs")
	fmt.Println("===================================")
	fmt.Println("Student Service  :", studentService)
	fmt.Println("Course Service   :", courseService)
	fmt.Println("Admission Service:", admissionService)
	fmt.Println("===================================")

	// ============================================
	// REGISTER PROXY ROUTES
	// ============================================

	router.PathPrefix("/students").HandlerFunc(StudentProxy)

	router.PathPrefix("/courses").HandlerFunc(CourseProxy)

	router.PathPrefix("/admissions").HandlerFunc(AdmissionProxy)

	// ============================================
	// CORS
	// ============================================

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3001",
			"*",
		},

		AllowedMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},

		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
		},

		AllowCredentials: true,
	})

	handler := c.Handler(router)

	// ============================================
	// RENDER PORT
	// ============================================

	port := os.Getenv("PORT")

	if port == "" {
		port = "8086"
	}

	fmt.Println("===================================")
	fmt.Println(" API Gateway Started")
	fmt.Println(" Running on Port :", port)
	fmt.Println("===================================")

	// ============================================
	// START SERVER
	// ============================================

	err := http.ListenAndServe(":"+port, handler)

	if err != nil {
		fmt.Println("API Gateway Error:", err)
	}
}