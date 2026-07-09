package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gardusig/static-puzzles-backend/internal/catalog"
)

func main() {
	gamesPath := os.Getenv("GAMES_PATH")
	if gamesPath == "" {
		gamesPath = "data/games.yaml"
	}

	store, err := catalog.Load(gamesPath)
	if err != nil {
		log.Fatalf("catalog: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /games", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"count": store.Count(),
			"games": store.Games(),
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
