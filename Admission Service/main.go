package main

import (
	"fmt"
	"net/http"
	"os"

	"admission-service/Database"
	"admission-service/Routes"

	"github.com/gorilla/mux"
)

func main() {

	Database.ConnectDB()
	defer Database.DB.Close()

	router := mux.NewRouter()

	Routes.RegisterAdmissionRoutes(router)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8084"
	}

	fmt.Println("===================================")
	fmt.Println(" Admission Service Started")
	fmt.Println(" Running on Port :", port)
	fmt.Println("===================================")

	err := http.ListenAndServe(":"+port, router)

	if err != nil {
		fmt.Println("Admission Service Error:", err)
	}
}