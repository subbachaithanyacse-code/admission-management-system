
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
		log.Println("Invalid proxy target:", target, err)

		return func(w http.ResponseWriter, r *http.Request) {
			http.Error(
				w,
				"Invalid service configuration",
				http.StatusInternalServerError,
			)
		}
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// IMPORTANT:
	// Keep the original target host.
	// This prevents Render routing loops.
	originalDirector := proxy.Director

	proxy.Director = func(r *http.Request) {

		originalDirector(r)

		// Force request to the actual backend service.
		r.URL.Scheme = targetURL.Scheme
		r.URL.Host = targetURL.Host

		// Set Host header to backend service.
		r.Host = targetURL.Host

		log.Println(
			"Proxy:",
			r.Method,
			r.URL.Path,
			"->",
			targetURL.String(),
		)
	}

	// Backend error handling
	proxy.ErrorHandler = func(
		w http.ResponseWriter,
		r *http.Request,
		err error,
	) {

		log.Println("=================================")
		log.Println("Proxy Error")
		log.Println("Target:", target)
		log.Println("Path:", r.URL.Path)
		log.Println("Error:", err)
		log.Println("=================================")

		http.Error(
			w,
			"Service unavailable",
			http.StatusBadGateway,
		)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	}
}

// =====================================================
// STUDENT SERVICE
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

func AdmissionProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("ADMISSION_SERVICE_URL")

	if target == "" {
		target = "http://127.0.0.1:8084"
	}

	createProxy(target)(w, r)
}