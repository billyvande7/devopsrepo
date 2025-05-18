package controller

import (
	"encoding/json"
	"net/http"
	"url_shortener_service/auth"
	"url_shortener_service/model"
	"url_shortener_service/model/database"
)

func LoginController(w http.ResponseWriter, r *http.Request) {
	var loginRequest model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	isValid := database.ValidateUser(loginRequest.Username, loginRequest.Password)

	response := model.LoginResponse{}

	if !isValid {
		response.Message = "Invalid username or password"
		w.WriteHeader(http.StatusUnauthorized)
	} else {
		token, err := auth.GenerateToken(loginRequest.Username)
		if err != nil {
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			return
		}
		response.Token = token
		response.Message = "Login successful"
		w.WriteHeader(http.StatusOK)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func ValidateTokenController(w http.ResponseWriter, r *http.Request) {
	// Get token from Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header is required", http.StatusUnauthorized)
		return
	}

	// Check if the header starts with "Bearer "
	if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
		http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
		return
	}

	// Extract the token
	tokenString := authHeader[7:]

	// Validate the token
	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	response := model.TokenValidationResponse{
		Username: claims.Username,
		Message:  "Token is valid",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
