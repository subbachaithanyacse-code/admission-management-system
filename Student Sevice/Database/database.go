package Database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn

func ConnectDB() {

	// Render will provide DATABASE_URL.
	// For local development, use the local PostgreSQL connection.
	connStr := os.Getenv("DATABASE_URL")

	if connStr == "" {
		connStr = "postgres://postgres:password@localhost:5432/admissiondb"
	}

	var err error

	DB, err = pgx.Connect(context.Background(), connStr)

	if err != nil {
		panic(err)
	}

	fmt.Println("Database Connected Successfully")
}
