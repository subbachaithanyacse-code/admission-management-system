package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

	// =========================
	// CREATE ROUTER
	// =========================

	router := mux.NewRouter()

	// =========================
	// STUDENT ROUTES
	// =========================

	router.PathPrefix("/students").HandlerFunc(StudentProxy)

	// =========================
	// COURSE ROUTES
	// =========================

	router.PathPrefix("/courses").HandlerFunc(CourseProxy)

	// =========================
	// ADMISSION ROUTES
	// =========================

	router.PathPrefix("/admissions").HandlerFunc(AdmissionProxy)

	// =========================
	// LOGIN ROUTE
	// =========================

	router.PathPrefix("/login").HandlerFunc(AdmissionProxy)

	// =========================
	// USER ROUTES
	// =========================

	router.PathPrefix("/users").HandlerFunc(AdmissionProxy)

	// =========================
	// HEALTH CHECK
	// =========================

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		w.WriteHeader(http.StatusOK)

		w.Write([]byte(`{
			"message": "API Gateway Running Successfully",
			"status": "OK"
		}`))
	}).Methods("GET")

	// =========================
	// HEALTH CHECK API
	// =========================

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		w.WriteHeader(http.StatusOK)

		w.Write([]byte(`{
			"status": "UP",
			"service": "API Gateway"
		}`))
	}).Methods("GET")

	// =========================
	// CORS CONFIGURATION
	// =========================

	allowedOrigins := []string{
		// Local React
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:3002",
		"http://localhost:3003",

		// Local network
		"http://192.168.29.19:3000",
	}

	// =========================
	// VERCEL FRONTEND URL
	// =========================
	//
	// After deploying frontend,
	// set environment variable:
	//
	// FRONTEND_URL=https://your-project.vercel.app
	//
	// This allows cloud deployment
	// without hard-coding the URL.
	// =========================

	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	c := cors.New(cors.Options{

		AllowedOrigins: allowedOrigins,

		AllowedMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"PATCH",
			"OPTIONS",
		},

		AllowedHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
		},

		AllowCredentials: true,

		ExposedHeaders: []string{
			"X-Total-Count",
			"X-Total-Pages",
			"X-Page",
			"X-Limit",
		},

		Debug: false,
	})

	// =========================
	// CREATE FINAL HANDLER
	// =========================

	handler := c.Handler(router)

	// =========================
	// PORT CONFIGURATION
	// =========================
	//
	// Local:
	// PORT=8086
	//
	// Cloud platforms usually
	// provide PORT automatically.
	// =========================

	port := os.Getenv("PORT")

	if port == "" {
		port = "8086"
	}

	// =========================
	// START SERVER
	// =========================

	fmt.Println("========================================")
	fmt.Println("       ADMISSION API GATEWAY")
	fmt.Println("========================================")
	fmt.Println("API Gateway Started Successfully")
	fmt.Println("Port :", port)
	fmt.Println("========================================")

	log.Fatal(
		http.ListenAndServe(
			":"+port,
			handler,
		),
	)
}