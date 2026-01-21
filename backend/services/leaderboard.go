package services

import (
	"fmt"
	"sort"
	"sync"

	"leaderboard/models"
)

type LeaderboardService struct {
	mu            sync.RWMutex
	users         map[string]*models.User
	ratingBuckets [5001]map[string]struct{}
	allUsernames  []string
}

/* NewLeaderboardService */
func NewLeaderboardService() *LeaderboardService {
	ls := &LeaderboardService{
		users:        make(map[string]*models.User),
		allUsernames: make([]string, 0),
	}
	// buckets
	for i := 0; i < 5001; i++ {
		ls.ratingBuckets[i] = make(map[string]struct{})
	}
	return ls
}

// adds a new user to the leaderboard
func (ls *LeaderboardService) AddUser(user *models.User) error {
	ls.mu.Lock()
	defer ls.mu.Unlock()

	if _, exists := ls.users[user.Username]; exists {
		return fmt.Errorf("user with username %s already exists", user.Username)
	}

	if user.Rating < 100 || user.Rating > 5000 {
		return fmt.Errorf("rating must be between 100 and 5000, got %d", user.Rating)
	}

	// Add to main
	ls.users[user.Username] = user

	// Add to bucket
	ls.ratingBuckets[user.Rating][user.Username] = struct{}{}

	// Add username
	ls.allUsernames = append(ls.allUsernames, user.Username)

	return nil
}

// UpdateRating of users
func (ls *LeaderboardService) UpdateRating(username string, newRating int) error {
	ls.mu.Lock()
	defer ls.mu.Unlock()

	user, exists := ls.users[username]
	if !exists {
		return fmt.Errorf("user not found: %s", username)
	}

	if newRating < 100 || newRating > 5000 {
		return fmt.Errorf("rating must be between 100 and 5000, got %d", newRating)
	}

	oldRating := user.Rating
	if oldRating == newRating {
		return nil
	}

	delete(ls.ratingBuckets[oldRating], username)
	ls.ratingBuckets[newRating][username] = struct{}{}

	user.Rating = newRating

	return nil
}

func (ls *LeaderboardService) GetUserRank(username string) (*models.UserWithRank, error) {
	ls.mu.RLock()
	defer ls.mu.RUnlock()

	user, exists := ls.users[username]
	if !exists {
		return nil, fmt.Errorf("user not found: %s", username)
	}

	// Calculate rank
	rank := 1
	for rating := 5000; rating > user.Rating; rating-- {
		if len(ls.ratingBuckets[rating]) > 0 {
			rank++
		}
	}

	return &models.UserWithRank{
		Rank:     rank,
		Username: user.Username,
		Rating:   user.Rating,
	}, nil
}

// GetUsersInRange returns a slice of users
func (ls *LeaderboardService) GetUsersInRange(offset, limit int) []models.UserWithRank {
	ls.mu.RLock()
	defer ls.mu.RUnlock()

	if limit <= 0 {
		return []models.UserWithRank{}
	}

	result := make([]models.UserWithRank, 0, limit)
	rank := 1
	skipped := 0
	collected := 0

	for rating := 5000; rating >= 100 && collected < limit; rating-- {
		bucket := ls.ratingBuckets[rating]
		bucketSize := len(bucket)

		if bucketSize == 0 {
			continue
		}

		if skipped+bucketSize <= offset {
			skipped += bucketSize
			rank++
			continue
		}

		usernames := make([]string, 0, bucketSize)
		for u := range bucket {
			usernames = append(usernames, u)
		}
		sort.Strings(usernames)

		for _, username := range usernames {
			if skipped < offset {
				skipped++
				continue
			}

			if collected >= limit {
				break
			}

			result = append(result, models.UserWithRank{
				Rank:     rank,
				Username: username,
				Rating:   rating,
			})
			collected++
		}

		rank++
	}

	return result
}

// returns the total number of users in the leaderboard
func (ls *LeaderboardService) GetUserCount() int {
	ls.mu.RLock()
	defer ls.mu.RUnlock()
	return len(ls.users)
}

func (ls *LeaderboardService) GetAllUsernames() []string {
	ls.mu.RLock()
	defer ls.mu.RUnlock()
	usernames := make([]string, len(ls.allUsernames))
	copy(usernames, ls.allUsernames)
	return usernames
}
