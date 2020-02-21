.PHONY: dist
npm = docker-compose run --rm dev npm

# Dev is default
dev:
	docker-compose up

# Build and deploy current version
dist:
	$(npm) run-script build
	# Save information about branch and commit into dist package
	git rev-parse --short HEAD > commit.txt
	git rev-parse --abbrev-ref HEAD >> commit.txt
	tar cf dist.tar dist/ docker-compose.prod.yml commit.txt
	scp dist.tar storage:~
	rm dist.tar

# Run this before first use in new environment
setup:
	docker-compose build
	$(npm) install

shell:
	docker-compose run --rm dev /bin/bash
