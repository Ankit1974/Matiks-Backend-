package models

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Rating   int    `json:"rating"` // Rating between 100 and 5000
}

type UserWithRank struct {
	Rank     int    `json:"rank"`
	Username string `json:"username"`
	Rating   int    `json:"rating"`
}

type LeaderboardResponse struct {
	Users []UserWithRank `json:"users"`
}
