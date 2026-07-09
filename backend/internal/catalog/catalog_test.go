package catalog_test

import (
	"path/filepath"
	"testing"

	"github.com/gardusig/static-puzzles-backend/internal/catalog"
)

func TestLoadGames(t *testing.T) {
	path := filepath.Join("..", "..", "data", "games.yaml")
	store, err := catalog.Load(path)
	if err != nil {
		t.Fatalf("load catalog: %v", err)
	}
	if store.Count() < 10 {
		t.Fatalf("expected at least 10 games, got %d", store.Count())
	}
	games := store.Games()
	found := false
	for _, g := range games {
		if g.Slug == "sudoku" {
			found = true
			if g.Status != "planned" {
				t.Fatalf("sudoku status = %q", g.Status)
			}
		}
	}
	if !found {
		t.Fatal("missing sudoku game")
	}
}
