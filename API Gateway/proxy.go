package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func createProxy(target string) http.HandlerFunc {

	targetURL, err := url.Parse(target)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {

		log.Println("Proxy Error:", err)

		http.Error(
			w,
			"Service unavailable",
			http.StatusBadGateway,
		)
	}

	return func(w http.ResponseWriter, r *http.Request) {

		log.Println("Forwarding:", r.URL.Path, "->", target)

		proxy.ServeHTTP(w, r)
	}
}

// Student Service
func StudentProxy(w http.ResponseWriter, r *http.Request) {
	createProxy("http://127.0.0.1:8081")(w, r)
}

// Course Service
func CourseProxy(w http.ResponseWriter, r *http.Request) {
	createProxy("http://127.0.0.1:8085")(w, r)
}

// Admission Service
func AdmissionProxy(w http.ResponseWriter, r *http.Request) {
	createProxy("http://127.0.0.1:8084")(w, r)
}