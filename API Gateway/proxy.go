package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

// =====================================================
// CREATE REVERSE PROXY
// =====================================================

func createProxy(target string) http.HandlerFunc {

	targetURL, err := url.Parse(target)

	if err != nil {
		log.Fatal("Invalid proxy target:", target, err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Handle backend connection errors
	proxy.ErrorHandler = func(
		w http.ResponseWriter,
		r *http.Request,
		err error,
	) {

		log.Println("=================================")
		log.Println("Proxy Error")
		log.Println("Target :", target)
		log.Println("Path   :", r.URL.Path)
		log.Println("Error  :", err)
		log.Println("=================================")

		http.Error(
			w,
			"Service unavailable",
			http.StatusBadGateway,
		)
	}

	// Forward request
	return func(w http.ResponseWriter, r *http.Request) {

		log.Println(
			"Forwarding:",
			r.Method,
			r.URL.Path,
			"->",
			target,
		)

		proxy.ServeHTTP(w, r)
	}
}

// =====================================================
// STUDENT SERVICE
// =====================================================
//
// Local:
// STUDENT_SERVICE_URL=http://127.0.0.1:8081
//
// Cloud:
// STUDENT_SERVICE_URL=https://your-student-service.onrender.com
// =====================================================

func StudentProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("STUDENT_SERVICE_URL")

	if target == "" {
		target = "http://127.0.0.1:8081"
	}

	createProxy(target)(w, r)
}

// =====================================================
// COURSE SERVICE
// =====================================================
//
// Local:
// COURSE_SERVICE_URL=http://127.0.0.1:8085
//
// Cloud:
// COURSE_SERVICE_URL=https://your-course-service.onrender.com
// =====================================================

func CourseProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("COURSE_SERVICE_URL")

	if target == "" {
		target = "http://127.0.0.1:8085"
	}

	createProxy(target)(w, r)
}

// =====================================================
// ADMISSION SERVICE
// =====================================================
//
// Local:
// ADMISSION_SERVICE_URL=http://127.0.0.1:8084
//
// Cloud:
// ADMISSION_SERVICE_URL=https://your-admission-service.onrender.com
// =====================================================

func AdmissionProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("ADMISSION_SERVICE_URL")

	if target == "" {
		target = "http://127.0.0.1:8084"
	}

	createProxy(target)(w, r)
}