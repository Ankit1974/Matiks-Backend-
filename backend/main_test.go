package main

import (
	"leaderboard/models"
	"leaderboard/services"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSeedUsers(t *testing.T) {
	service := services.NewLeaderboardService()

	// 1. Valid seed
	count := 5
	seedUsers(service, count)
	if service.GetUserCount() != count {
		t.Errorf("Expected %d users, got %d", count, service.GetUserCount())
	}

	// 2. Trigger error branch (duplicate user)
	service = services.NewLeaderboardService()
	service.AddUser(&models.User{Username: "user_1", Rating: 1000})
	seedUsers(service, 2) // Should try to add user_1 again and fail
	if service.GetUserCount() != 2 {
		t.Errorf("Expected 2 users after duplicate seed, got %d", service.GetUserCount())
	}

	// 3. Trigger print branch (i % 1000 == 0)
	service = services.NewLeaderboardService()
	seedUsers(service, 1000)
	if service.GetUserCount() != 1000 {
		t.Errorf("Expected 1000 users, got %d", service.GetUserCount())
	}
}

func TestSetupRouter(t *testing.T) {
	service := services.NewLeaderboardService()
	mux := setupRouter(service)

	// Test a registered route
	req, _ := http.NewRequest("GET", "/leaderboard", nil)
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Test an unregistered route
	req404, _ := http.NewRequest("GET", "/unregistered", nil)
	rr404 := httptest.NewRecorder()
	mux.ServeHTTP(rr404, req404)

	if status := rr404.Code; status != http.StatusNotFound {
		t.Errorf("unregistered route should return 404: got %v want %v", status, http.StatusNotFound)
	}
}

func TestPrintServerInfo(t *testing.T) {
	// Just call it to ensure no crashes and cover the lines
	printServerInfo(":8080")
}
