package services

import (
	"leaderboard/models"
	"testing"
)

func TestAddUser(t *testing.T) {
	ls := NewLeaderboardService()

	// Test valid add
	user := &models.User{Username: "test1", Rating: 1000}
	if err := ls.AddUser(user); err != nil {
		t.Errorf("Failed to add valid user: %v", err)
	}

	// Test duplicate
	if err := ls.AddUser(user); err == nil {
		t.Error("Expected error for duplicate user, got nil")
	}

	// Test invalid rating
	invalidUser := &models.User{Username: "bad", Rating: 5001}
	if err := ls.AddUser(invalidUser); err == nil {
		t.Error("Expected error for invalid rating > 5000, got nil")
	}

	invalidUserLow := &models.User{Username: "low", Rating: 99}
	if err := ls.AddUser(invalidUserLow); err == nil {
		t.Error("Expected error for invalid rating < 100, got nil")
	}
}

func TestUpdateRating(t *testing.T) {
	ls := NewLeaderboardService()
	ls.AddUser(&models.User{Username: "test1", Rating: 1000})

	// Test valid update
	if err := ls.UpdateRating("test1", 2000); err != nil {
		t.Errorf("Failed to update rating: %v", err)
	}

	user, _ := ls.GetUserRank("test1")
	if user.Rating != 2000 {
		t.Errorf("Expected rating 2000, got %d", user.Rating)
	}

	// Test same rating (coverage check)
	if err := ls.UpdateRating("test1", 2000); err != nil {
		t.Errorf("Update to same rating should not fail: %v", err)
	}

	// Test user not found
	if err := ls.UpdateRating("ghost", 1000); err == nil {
		t.Error("Expected error for non-existent user")
	}

	// Test invalid rating
	if err := ls.UpdateRating("test1", 6000); err == nil {
		t.Error("Expected error for invalid rating")
	}
}

func TestGetUserRank_DenseRanking(t *testing.T) {
	ls := NewLeaderboardService()
	ls.AddUser(&models.User{Username: "u1", Rating: 5000}) // Rank 1
	ls.AddUser(&models.User{Username: "u2", Rating: 5000}) // Rank 1
	ls.AddUser(&models.User{Username: "u3", Rating: 4000}) // Rank 2

	// Check U1
	r1, _ := ls.GetUserRank("u1")
	if r1.Rank != 1 {
		t.Errorf("Expected u1 rank 1, got %d", r1.Rank)
	}

	// Check User Not Found
	_, err := ls.GetUserRank("u4")
	if err == nil {
		t.Error("Expected error for rank of non-existent user")
	}

	// Check U2 (Tie)
	r2, _ := ls.GetUserRank("u2")
	if r2.Rank != 1 {
		t.Errorf("Expected u2 rank 1, got %d", r2.Rank)
	}

	// Check U3 (Next rank)
	r3, _ := ls.GetUserRank("u3")
	if r3.Rank != 2 {
		t.Errorf("Expected u3 rank 2, got %d", r3.Rank)
	}
}

func TestGetUsersInRange(t *testing.T) {
	ls := NewLeaderboardService()
	ls.AddUser(&models.User{Username: "u1", Rating: 5000})
	ls.AddUser(&models.User{Username: "u2", Rating: 4000})
	ls.AddUser(&models.User{Username: "u3", Rating: 3000})

	// Test full range
	users := ls.GetUsersInRange(0, 10)
	if len(users) != 3 {
		t.Errorf("Expected 3 users, got %d", len(users))
	}
	if users[0].Username != "u1" || users[1].Username != "u2" || users[2].Username != "u3" {
		t.Error("Unlock ordering or content mismatch")
	}

	// Test Limit <= 0
	if len(ls.GetUsersInRange(0, 0)) != 0 {
		t.Error("Expected 0 results for limit 0")
	}

	// Test Limit
	limitUsers := ls.GetUsersInRange(0, 1)
	if len(limitUsers) != 1 || limitUsers[0].Username != "u1" {
		t.Error("Limit failed")
	}

	// Test Offset
	offsetUsers := ls.GetUsersInRange(1, 10)
	if len(offsetUsers) != 2 || offsetUsers[0].Username != "u2" {
		t.Error("Offset failed")
	}

	// Test Offset with Sort check within same bucket
	ls.AddUser(&models.User{Username: "u1b", Rating: 5000})
	sortedUsers := ls.GetUsersInRange(0, 2)
	// u1 vs u1b -> u1 comes before u1b due to sort.Strings
	if sortedUsers[0].Username != "u1" || sortedUsers[1].Username != "u1b" {
		t.Errorf("Sorting in bucket failed: got %s, %s", sortedUsers[0].Username, sortedUsers[1].Username)
	}
}

func TestGetCounts(t *testing.T) {
	ls := NewLeaderboardService()
	ls.AddUser(&models.User{Username: "u1", Rating: 1000})

	if ls.GetUserCount() != 1 {
		t.Errorf("expected count 1, got %d", ls.GetUserCount())
	}

	if len(ls.GetAllUsernames()) != 1 {
		t.Errorf("expected 1 username, got %d", len(ls.GetAllUsernames()))
	}
}
