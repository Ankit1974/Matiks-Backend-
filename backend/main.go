package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"leaderboard/handlers"
	"leaderboard/models"
	"leaderboard/services"
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("Failed to run app: %v", err)
	}
}

func run() error {
	// random seed
	rand.Seed(time.Now().UnixNano())

	// leaderboard service
	leaderboardService := services.NewLeaderboardService()

	// Seed users
	seedUsers(leaderboardService, 10000)

	// setup router
	mux := setupRouter(leaderboardService)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	// server
	port := ":8080"
	printServerInfo(port)

	return startServer(port, handler)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// printServerInfo prints startup information
func printServerInfo(port string) {
	fmt.Printf("\n🚀 Leaderboard server starting on port %s\n", port)
	fmt.Println("Available endpoints:")
	fmt.Println("  GET  /leaderboard?limit=N  - Get top N users")
	fmt.Println("  GET  /user/{username}      - Get user rank")
	fmt.Println("  POST /update-score         - Update random user scores")
	fmt.Println("  POST /update-user-score    - Update specific user score")
	fmt.Println()
}

// startServer starts the HTTP server
func startServer(port string, handler http.Handler) error {
	return http.ListenAndServe(port, handler)
}

// setupRouter initializes the API routes and returns the server mux
func setupRouter(s *services.LeaderboardService) *http.ServeMux {
	handler := handlers.NewHandler(s)
	mux := http.NewServeMux()

	mux.HandleFunc("/leaderboard", handler.GetLeaderboard)
	mux.HandleFunc("/user/", handler.GetUser)
	mux.HandleFunc("/update-score", handler.UpdateScore)
	mux.HandleFunc("/update-user-score", handler.UpdateUserScore)

	return mux
}

// random users added to leaderboard
func seedUsers(service *services.LeaderboardService, count int) {
	for i := 1; i <= count; i++ {
		user := &models.User{
			ID:       fmt.Sprintf("user_id_%d", i),
			Username: fmt.Sprintf("user_%d", i),
			Rating:   100 + rand.Intn(4901),
		}

		if err := service.AddUser(user); err != nil {
			log.Printf("Failed to add user %s: %v", user.Username, err)
		}

		if i%1000 == 0 {
			fmt.Printf("  Seeded %d users...\n", i)
		}
	}
}
