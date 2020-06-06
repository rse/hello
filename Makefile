
build:
	docker build --squash -t engelschall/hello:latest .

push:
	docker push engelschall/hello:latest

