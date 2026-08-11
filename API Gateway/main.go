package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {

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
		w.Write([]byte("API Gateway Running Successfully"))
	})

	// =========================
	// CORS
	// =========================
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3001",
		},

		AllowedMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},

		AllowedHeaders: []string{
			"*",
		},

		AllowCredentials: true,
	})

	// =========================
	// START API GATEWAY
	// =========================

	fmt.Println("=================================")
	fmt.Println(" API Gateway Started ")
	fmt.Println(" Running on Port :8086 ")
	fmt.Println("=================================")

	log.Fatal(
		http.ListenAndServe(
			":8086",
			c.Handler(router),
		),
	)
}