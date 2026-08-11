package Database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn

func ConnectDB() {

	var err error

	DB, err = pgx.Connect(
		context.Background(),
		"postgres://postgres:password@localhost:5432/admissiondb",
	)

	if err != nil {
		fmt.Println("Database Connection Failed")
		fmt.Println(err)
		return
	}

	fmt.Println("Database Connected Successfully")
}