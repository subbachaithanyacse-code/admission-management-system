package Models

import "time"

type Course struct {
	ID         int       `json:"id"`
	CourseCode string    `json:"course_code"`
	CourseName string    `json:"course_name"`
	Duration   string    `json:"duration"`
	Fee        float64   `json:"fee"`
	Seats      int       `json:"seats"`
	CreatedAt  time.Time `json:"created_at"`
}