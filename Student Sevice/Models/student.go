package models

type Student struct {
	ID       int    `json:"id"`
	FullName string `json:"fullname"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Course   string `json:"course"`
}