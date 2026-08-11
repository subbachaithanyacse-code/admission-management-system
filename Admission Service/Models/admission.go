package Models

import "time"

type Admission struct {
	ID            int       `json:"id"`
	StudentID     int       `json:"student_id"`
	CourseID      int       `json:"course_id"`
	AdmissionDate time.Time `json:"admission_date"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
}