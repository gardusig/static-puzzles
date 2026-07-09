package catalog

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Game struct {
	Title         string   `json:"title" yaml:"title"`
	Slug          string   `json:"slug" yaml:"slug"`
	Status        string   `json:"status" yaml:"status"`
	Priority      string   `json:"priority" yaml:"priority"`
	Description   string   `json:"description" yaml:"description"`
	FrontendRoute string   `json:"frontend_route" yaml:"frontend_route"`
	Tags          []string `json:"tags" yaml:"tags"`
}

type Document struct {
	Version int               `yaml:"version"`
	Games   map[string]Game   `yaml:"games"`
}

type Store struct {
	games []Game
}

func Load(path string) (*Store, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read catalog: %w", err)
	}
	var doc Document
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("parse catalog: %w", err)
	}
	if len(doc.Games) == 0 {
		return nil, fmt.Errorf("catalog has no games")
	}

	games := make([]Game, 0, len(doc.Games))
	for slug, game := range doc.Games {
		if game.Slug == "" {
			game.Slug = slug
		}
		games = append(games, game)
	}
	return &Store{games: games}, nil
}

func (s *Store) Games() []Game {
	out := make([]Game, len(s.games))
	copy(out, s.games)
	return out
}

func (s *Store) Count() int {
	return len(s.games)
}
