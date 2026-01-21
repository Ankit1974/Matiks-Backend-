package models

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestUserJSON(t *testing.T) {
	user := User{
		ID:       "1",
		Username: "test_user",
		Rating:   1500,
	}

	// Test Marshal
	data, err := json.Marshal(user)
	if err != nil {
		t.Fatalf("Failed to marshal User: %v", err)
	}

	expectedJSON := `{"id":"1","username":"test_user","rating":1500}`
	if string(data) != expectedJSON {
		t.Errorf("JSON mismatch: got %s, want %s", string(data), expectedJSON)
	}

	// Test Unmarshal
	var unmarshaledUser User
	err = json.Unmarshal(data, &unmarshaledUser)
	if err != nil {
		t.Fatalf("Failed to unmarshal User: %v", err)
	}

	if unmarshaledUser != user {
		t.Errorf("Struct mismatch: got %+v, want %+v", unmarshaledUser, user)
	}
}

func TestUserWithRankJSON(t *testing.T) {
	user := UserWithRank{
		Rank:     5,
		Username: "ranked_user",
		Rating:   2000,
	}

	data, err := json.Marshal(user)
	if err != nil {
		t.Fatalf("Failed to marshal UserWithRank: %v", err)
	}

	expectedJSON := `{"rank":5,"username":"ranked_user","rating":2000}`
	if string(data) != expectedJSON {
		t.Errorf("JSON mismatch: got %s, want %s", string(data), expectedJSON)
	}
}

func TestLeaderboardResponseJSON(t *testing.T) {
	response := LeaderboardResponse{
		Users: []UserWithRank{
			{Rank: 1, Username: "top_user", Rating: 3000},
		},
	}

	data, err := json.Marshal(response)
	if err != nil {
		t.Fatalf("Failed to marshal LeaderboardResponse: %v", err)
	}

	// Simple check to ensure nested structure is preserved
	expectedSubString := `"users":[{`
	if !strings.Contains(string(data), expectedSubString) {
		t.Errorf("JSON missing users array start: %s", string(data))
	}
}

// Override contains with strings.Contains if we import "strings"
// But since I didn't import "strings" to keep imports minimal for this simple logic:
// Actually, let's just use strings package, it's standard.
