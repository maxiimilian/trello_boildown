.PHONY: dist
dc_dev = docker-compose -f docker-compose.dev.yml
npm = docker-compose run --rm dev npm

# Dev is default
dev:
	$(dc_dev) up

# Build and deploy current version
dist:
	$(npm) run-script build
	# Save information about branch and commit into dist package
	git rev-parse --short HEAD > commit.txt
	git rev-parse --abbrev-ref HEAD >> commit.txt
	tar cf dist.tar dist/ docker-compose.prod.yml commit.txt

# Run this before first use in new environment
setup:
	$(dc_dev) build
	$(npm) install

shell:
	$(dc_dev) run --rm dev /bin/bash
