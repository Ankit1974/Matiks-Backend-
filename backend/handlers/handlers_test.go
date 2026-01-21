package handlers

import (
	"bytes"
	"encoding/json"
	"leaderboard/models"
	"leaderboard/services"
	"net/http"
	"net/http/httptest"
	"testing"
)

func setupTestHandler() *Handler {
	// Initialize a fresh service for each test
	service := services.NewLeaderboardService()
	return NewHandler(service)
}

func TestGetLeaderboard(t *testing.T) {
	h := setupTestHandler()

	// Add some dummy users
	h.service.AddUser(&models.User{Username: "user1", Rating: 1000})
	h.service.AddUser(&models.User{Username: "user2", Rating: 2000})

	// Case 1: Valid GET
	req, _ := http.NewRequest("GET", "/leaderboard?limit=10&offset=0", nil)
	rr := httptest.NewRecorder()
	h.GetLeaderboard(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("GET returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Case 2: Invalid Method
	reqPost, _ := http.NewRequest("POST", "/leaderboard", nil)
	rrPost := httptest.NewRecorder()
	h.GetLeaderboard(rrPost, reqPost)
	if status := rrPost.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("POST returned wrong status code: got %v want %v", status, http.StatusMethodNotAllowed)
	}

	// Case 3: Limit > 1000
	reqLimit, _ := http.NewRequest("GET", "/leaderboard?limit=2000", nil)
	rrLimit := httptest.NewRecorder()
	h.GetLeaderboard(rrLimit, reqLimit)
	if status := rrLimit.Code; status != http.StatusOK {
		t.Errorf("Limit test returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}

func TestGetUser(t *testing.T) {
	h := setupTestHandler()
	h.service.AddUser(&models.User{Username: "target_user", Rating: 1500})

	// Case 1: Valid User
	req, _ := http.NewRequest("GET", "/user/target_user", nil)
	rr := httptest.NewRecorder()
	h.GetUser(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Valid user: handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Case 2: User Not Found
	reqNotFound, _ := http.NewRequest("GET", "/user/non_existent", nil)
	rrNotFound := httptest.NewRecorder()
	h.GetUser(rrNotFound, reqNotFound)
	if status := rrNotFound.Code; status != http.StatusNotFound {
		t.Errorf("User not found: handler returned wrong status code: got %v want %v", status, http.StatusNotFound)
	}

	// Case 3: Invalid Method
	reqPost, _ := http.NewRequest("POST", "/user/target_user", nil)
	rrPost := httptest.NewRecorder()
	h.GetUser(rrPost, reqPost)
	if status := rrPost.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("POST returned wrong status code: got %v want %v", status, http.StatusMethodNotAllowed)
	}

	// Case 4: Invalid URL Format
	reqBad, _ := http.NewRequest("GET", "/user/too/many/parts", nil)
	rrBad := httptest.NewRecorder()
	h.GetUser(rrBad, reqBad)
	if status := rrBad.Code; status != http.StatusBadRequest {
		t.Errorf("Bad URL returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}

	// Case 5: Empty Username
	reqEmpty, _ := http.NewRequest("GET", "/user/", nil)
	rrEmpty := httptest.NewRecorder()
	h.GetUser(rrEmpty, reqEmpty)
	if status := rrEmpty.Code; status != http.StatusBadRequest {
		t.Errorf("Empty username returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}

	// Case 6: Wrong Path Prefix (manual call)
	reqWrong, _ := http.NewRequest("GET", "/wrong/prefix", nil)
	rrWrong := httptest.NewRecorder()
	h.GetUser(rrWrong, reqWrong)
	if status := rrWrong.Code; status != http.StatusBadRequest {
		t.Errorf("Wrong prefix returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

func TestUpdateUserScore(t *testing.T) {
	h := setupTestHandler()
	h.service.AddUser(&models.User{Username: "updater", Rating: 1000})

	// Case 1: Valid Update
	updatePayload := map[string]interface{}{
		"username": "updater",
		"rating":   2500,
	}
	body, _ := json.Marshal(updatePayload)
	req, _ := http.NewRequest("POST", "/update-user-score", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	h.UpdateUserScore(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Case 2: Invalid Method
	reqGet, _ := http.NewRequest("GET", "/update-user-score", nil)
	rrGet := httptest.NewRecorder()
	h.UpdateUserScore(rrGet, reqGet)
	if status := rrGet.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("GET returned wrong status code: got %v want %v", status, http.StatusMethodNotAllowed)
	}

	// Case 3: Invalid JSON
	reqJSON, _ := http.NewRequest("POST", "/update-user-score", bytes.NewBufferString("invalid-json"))
	rrJSON := httptest.NewRecorder()
	h.UpdateUserScore(rrJSON, reqJSON)
	if status := rrJSON.Code; status != http.StatusBadRequest {
		t.Errorf("Invalid JSON returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}

	// Case 4: Missing Username
	reqMissing, _ := http.NewRequest("POST", "/update-user-score", bytes.NewBufferString(`{"rating": 3000}`))
	rrMissing := httptest.NewRecorder()
	h.UpdateUserScore(rrMissing, reqMissing)
	if status := rrMissing.Code; status != http.StatusBadRequest {
		t.Errorf("Missing username returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}

	// Case 5: User Not Found (service error)
	reqGhost, _ := http.NewRequest("POST", "/update-user-score", bytes.NewBufferString(`{"username": "ghost", "rating": 3000}`))
	rrGhost := httptest.NewRecorder()
	h.UpdateUserScore(rrGhost, reqGhost)
	if status := rrGhost.Code; status != http.StatusNotFound {
		t.Errorf("Ghost user returned wrong status code: got %v want %v", status, http.StatusNotFound)
	}
}

func TestUpdateScore(t *testing.T) {
	h := setupTestHandler()

	// Case 1: No users in system
	reqEmpty, _ := http.NewRequest("POST", "/update-score", nil)
	rrEmpty := httptest.NewRecorder()
	h.UpdateScore(rrEmpty, reqEmpty)
	if status := rrEmpty.Code; status != http.StatusInternalServerError {
		t.Errorf("Empty system returned wrong status code: got %v want %v", status, http.StatusInternalServerError)
	}

	// Case 2: Valid Update
	h.service.AddUser(&models.User{Username: "u1", Rating: 100})
	h.service.AddUser(&models.User{Username: "u2", Rating: 200})
	req, _ := http.NewRequest("POST", "/update-score", nil)
	rr := httptest.NewRecorder()
	h.UpdateScore(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Case 3: Invalid Method
	reqGet, _ := http.NewRequest("GET", "/update-score", nil)
	rrGet := httptest.NewRecorder()
	h.UpdateScore(rrGet, reqGet)
	if status := rrGet.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("GET returned wrong status code: got %v want %v", status, http.StatusMethodNotAllowed)
	}
}
