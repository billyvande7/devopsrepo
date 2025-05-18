package controller

import (
	"encoding/json"
	"net/http"
	"url_shortener_service/model/database"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Database  string `json:"database"`
	Timestamp string `json:"timestamp"`
}

func HealthCheckController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Check database connection
	dbStatus := "up"
	if err := database.DB.Ping(); err != nil {
		dbStatus = "down"
		w.WriteHeader(http.StatusServiceUnavailable)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	response := HealthResponse{
		Status:    "up",
		Database:  dbStatus,
		Timestamp: http.TimeFormat,
	}

	json.NewEncoder(w).Encode(response)
}
