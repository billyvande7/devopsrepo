// service.go - Go Service

package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"url_shortener_service/model"
)

type ForwardingService struct{}

func NewForwardingService() *ForwardingService {
	return &ForwardingService{}
}

func (s *ForwardingService) ForwardShortenRequest(requestBody io.Reader) (*model.ShortenResponse, error) {
	resp, err := http.Post("http://localhost:3000/api/shorten", "application/json", requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to forward request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("received non-200 status from node service")
	}

	var response model.ShortenResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &response, nil
}
