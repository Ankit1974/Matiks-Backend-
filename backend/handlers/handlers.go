package handlers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"leaderboard/models"
	"leaderboard/services"
)

type Handler struct {
	service *services.LeaderboardService
	rng     *rand.Rand
}

// creates a new HTTP handler with the leaderboard service
func NewHandler(service *services.LeaderboardService) *Handler {
	return &Handler{
		service: service,
		rng:     rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (h *Handler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	limit := 100
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if val, err := strconv.Atoi(limitStr); err == nil && val > 0 {
			limit = val
			if limit > 1000 {
				limit = 1000
			}
		}
	}

	offset := 0
	if offsetStr := r.URL.Query().Get("offset"); offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	users := h.service.GetUsersInRange(offset, limit)

	// Prepare response
	response := models.LeaderboardResponse{
		Users: users,
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Returns the user's global rank, username, and rating
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	// Only allow GET method
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) != 2 || pathParts[0] != "user" {
		http.Error(w, "Invalid URL format. Expected: /user/{username}", http.StatusBadRequest)
		return
	}

	username := pathParts[1]
	if username == "" {
		http.Error(w, "Username cannot be empty", http.StatusBadRequest)
		return
	}

	userWithRank, err := h.service.GetUserRank(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userWithRank)
}

// Updates the rating of a specific user
func (h *Handler) UpdateUserScore(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input struct {
		Username string `json:"username"`
		Rating   int    `json:"rating"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if input.Username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateRating(input.Username, input.Rating); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Fetch updated user stats with new rank
	userWithRank, _ := h.service.GetUserRank(input.Username)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User score updated",
		"user":    userWithRank,
	})
}

// Randomly updates ratings to simulate score changes
func (h *Handler) UpdateScore(w http.ResponseWriter, r *http.Request) {
	// Only allow POST method
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get all usernames
	allUsernames := h.service.GetAllUsernames()
	if len(allUsernames) == 0 {
		http.Error(w, "No users in the system", http.StatusInternalServerError)
		return
	}

	updateCount := 5000 + h.rng.Intn(2001)
	userCount := len(allUsernames)
	if updateCount > userCount {
		updateCount = userCount
	}

	updatedCount := 0
	pickedIndices := make(map[int]struct{})

	// Update randomly selected users
	for updatedCount < updateCount && len(pickedIndices) < userCount {
		idx := h.rng.Intn(userCount)
		if _, exists := pickedIndices[idx]; exists {
			continue
		}
		pickedIndices[idx] = struct{}{}

		username := allUsernames[idx]
		newRating := 100 + h.rng.Intn(4901)

		err := h.service.UpdateRating(username, newRating)
		if err != nil {
			fmt.Printf("Failed to update user %s: %v\n", username, err)
			continue
		}
		updatedCount++
	}

	// Prepare response
	response := map[string]interface{}{
		"message":       "Score update completed",
		"updated_users": updatedCount,
		"total_users":   h.service.GetUserCount(),
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
