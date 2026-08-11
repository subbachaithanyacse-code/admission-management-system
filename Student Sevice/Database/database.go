package Database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn

func ConnectDB() {

	connStr := "postgres://postgres:password@localhost:5432/admissiondb"

	var err error

	DB, err = pgx.Connect(context.Background(), connStr)

	if err != nil {
		panic(err)
	}

	fmt.Println("Database Connected Successfully")
}