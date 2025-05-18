package model

type ShortenRequest struct {
	URL string `json:"url"`
}

type ShortenResponse struct {
	ShortKey     string `json:"shortKey"`
	ShortenedUrl string `json:"shortenedUrl"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token   string `json:"token,omitempty"`
	Message string `json:"message"`
}

type TokenValidationResponse struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}
