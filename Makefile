.PHONY: dist
npm = docker-compose run --rm dev npm

dist:
	$(npm) run-script build
	tar cf dist.tar dist/ docker-compose.prod.yml 
	scp dist.tar storage:~
	rm dist.tar
