package Controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"admission-service/Database"

	"github.com/gorilla/mux"
)

// =====================================
// LOGIN REQUEST
// =====================================

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// =====================================
// LOGIN RESPONSE
// =====================================

type LoginResponse struct {
	Message  string `json:"message"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

// =====================================
// USER MODEL
// =====================================

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password,omitempty"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// =====================================
// CREATE USER REQUEST
// =====================================

type CreateUserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// =====================================
// UPDATE USER REQUEST
// =====================================

type UpdateUserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// =====================================
// LOGIN
// =====================================

func Login(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.Username == "" || req.Password == "" {
		http.Error(
			w,
			"Username and password are required",
			http.StatusBadRequest,
		)
		return
	}

	var username string
	var password string
	var role string

	err = Database.DB.QueryRow(
		context.Background(),
		`SELECT username, password, role
		 FROM users
		 WHERE username=$1`,
		req.Username,
	).Scan(
		&username,
		&password,
		&role,
	)

	if err != nil {
		http.Error(
			w,
			"Invalid username or password",
			http.StatusUnauthorized,
		)
		return
	}

	if password != req.Password {
		http.Error(
			w,
			"Invalid username or password",
			http.StatusUnauthorized,
		)
		return
	}

	response := LoginResponse{
		Message:  "Login Successful",
		Username: username,
		Role:     role,
	}

	json.NewEncoder(w).Encode(response)
}

// =====================================
// GET ALL USERS
// =====================================

func GetUsers(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	rows, err := Database.DB.Query(
		context.Background(),
		`SELECT id, username, role, created_at
		 FROM users
		 ORDER BY id`,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to fetch users",
			http.StatusInternalServerError,
		)
		return
	}

	defer rows.Close()

	users := []User{}

	for rows.Next() {

		var user User

		err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Role,
			&user.CreatedAt,
		)

		if err != nil {
			http.Error(
				w,
				"Failed to read users",
				http.StatusInternalServerError,
			)
			return
		}

		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)
}

// =====================================
// GET USER BY ID
// =====================================

func GetUserByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid user ID",
			http.StatusBadRequest,
		)
		return
	}

	var user User

	err = Database.DB.QueryRow(
		context.Background(),
		`SELECT id, username, role, created_at
		 FROM users
		 WHERE id=$1`,
		id,
	).Scan(
		&user.ID,
		&user.Username,
		&user.Role,
		&user.CreatedAt,
	)

	if err != nil {
		http.Error(
			w,
			"User not found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// =====================================
// CREATE USER
// =====================================

func CreateUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var req CreateUserRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(
			w,
			"Invalid request",
			http.StatusBadRequest,
		)
		return
	}

	if req.Username == "" ||
		req.Password == "" ||
		req.Role == "" {

		http.Error(
			w,
			"Username, password and role are required",
			http.StatusBadRequest,
		)

		return
	}

	var id int

	err = Database.DB.QueryRow(
		context.Background(),
		`INSERT INTO users
		 (username, password, role)
		 VALUES ($1, $2, $3)
		 RETURNING id`,
		req.Username,
		req.Password,
		req.Role,
	).Scan(&id)

	if err != nil {
		http.Error(
			w,
			"Failed to create user",
			http.StatusInternalServerError,
		)
		return
	}

	response := map[string]interface{}{
		"message": "User created successfully",
		"id":      id,
	}

	json.NewEncoder(w).Encode(response)
}

// =====================================
// UPDATE USER
// =====================================

func UpdateUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid user ID",
			http.StatusBadRequest,
		)
		return
	}

	var req UpdateUserRequest

	err = json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(
			w,
			"Invalid request",
			http.StatusBadRequest,
		)
		return
	}

	if req.Username == "" || req.Role == "" {
		http.Error(
			w,
			"Username and role are required",
			http.StatusBadRequest,
		)
		return
	}

	// If password is empty, keep existing password
	if req.Password == "" {

		_, err = Database.DB.Exec(
			context.Background(),
			`UPDATE users
			 SET username=$1,
			     role=$2
			 WHERE id=$3`,
			req.Username,
			req.Role,
			id,
		)

	} else {

		_, err = Database.DB.Exec(
			context.Background(),
			`UPDATE users
			 SET username=$1,
			     password=$2,
			     role=$3
			 WHERE id=$4`,
			req.Username,
			req.Password,
			req.Role,
			id,
		)
	}

	if err != nil {
		http.Error(
			w,
			"Failed to update user",
			http.StatusInternalServerError,
		)
		return
	}

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "User updated successfully",
		},
	)
}

// =====================================
// DELETE USER
// =====================================

func DeleteUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(
			w,
			"Invalid user ID",
			http.StatusBadRequest,
		)
		return
	}

	result, err := Database.DB.Exec(
		context.Background(),
		`DELETE FROM users
		 WHERE id=$1`,
		id,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to delete user",
			http.StatusInternalServerError,
		)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(
			w,
			"User not found",
			http.StatusNotFound,
		)
		return
	}

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "User deleted successfully",
		},
	)
}