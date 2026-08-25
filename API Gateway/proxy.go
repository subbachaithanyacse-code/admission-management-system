package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

// =====================================================
// CREATE REVERSE PROXY
// =====================================================

func createProxy(target string) http.HandlerFunc {

	target = strings.TrimRight(target, "/")

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

	proxy.Director = func(r *http.Request) {

		// Keep the original API path.
		// Example:
		// Gateway /courses
		// -> Course Service /courses

		r.URL.Scheme = targetURL.Scheme
		r.URL.Host = targetURL.Host

		// Keep the original path.
		// Do NOT prepend another /courses or /students.

		r.Host = targetURL.Host

		r.Header.Set("X-Forwarded-Host", r.Host)

		log.Println(
			"=================================",
		)
		log.Println(
			"Proxy:",
			r.Method,
			r.URL.Path,
		)
		log.Println(
			"Target:",
			targetURL.String(),
		)
		log.Println(
			"=================================",
		)
	}

	proxy.ErrorHandler = func(
		w http.ResponseWriter,
		r *http.Request,
		err error,
	) {

		log.Println("=================================")
		log.Println("PROXY ERROR")
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
		target = "https://admission-student-service.onrender.com"
	}

	createProxy(target)(w, r)
}

// =====================================================
// COURSE SERVICE
// =====================================================

func CourseProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("COURSE_SERVICE_URL")

	if target == "" {
		target = "https://admission-management-system-4vid.onrender.com"
	}

	createProxy(target)(w, r)
}

// =====================================================
// ADMISSION SERVICE
// =====================================================

func AdmissionProxy(w http.ResponseWriter, r *http.Request) {

	target := os.Getenv("ADMISSION_SERVICE_URL")

	if target == "" {
		target = "https://admission-service.onrender.com"
	}

	createProxy(target)(w, r)
}