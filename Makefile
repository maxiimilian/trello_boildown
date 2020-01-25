.PHONY: dist
npm = docker-compose run --rm dev npm

dist:
	$(npm) run-script build
	# Save information about branch and commit into dist package
	git rev-parse --short HEAD > commit.txt
	git rev-parse --abbrev-ref HEAD >> commit.txt
	tar cf dist.tar dist/ docker-compose.prod.yml commit.txt
	scp dist.tar storage:~
	rm dist.tar

dev:
	docker-compose up

shell:
	docker-compose run --rm dev /bin/bash
