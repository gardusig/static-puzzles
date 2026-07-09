.PHONY: test build clean

FRONTEND := src/launcher/frontend

build:
	cd $(FRONTEND) && npm install && npm run build

test: build
	bash scripts/smoke.sh

clean:
	rm -rf $(FRONTEND)/node_modules $(FRONTEND)/dist
