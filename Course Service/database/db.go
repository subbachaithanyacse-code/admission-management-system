package database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {

	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL == "" {
		fmt.Println("DATABASE_URL not found")
		return
	}

	config, err := pgxpool.ParseConfig(databaseURL)

	if err != nil {
		fmt.Println("Database Configuration Error:", err)
		return
	}

	DB, err = pgxpool.NewWithConfig(
		context.Background(),
		config,
	)

	if err != nil {
		fmt.Println("Database Connection Error:", err)
		return
	}

	err = DB.Ping(context.Background())

	if err != nil {
		fmt.Println("Database Ping Error:", err)
		return
	}

	fmt.Println("Database Connected Successfully")
}
