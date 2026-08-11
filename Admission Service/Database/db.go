package Database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {

	connStr := "postgres://postgres:password@localhost:5432/admissiondb"

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Database Config Error:", err)
	}

	// Connection Pool Settings
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute

	// Create Connection Pool
	DB, err = pgxpool.NewWithConfig(
		context.Background(),
		config,
	)

	if err != nil {
		log.Fatal("Database Connection Error:", err)
	}

	// Test Database Connection
	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	err = DB.Ping(ctx)

	if err != nil {
		log.Fatal("Database Ping Error:", err)
	}

	fmt.Println("Admission Database Connected Successfully")
}