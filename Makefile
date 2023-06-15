all: build

build:
	@docker build --tag=angular2-luis/test .

release: build
	@docker build --tag=angular2-luis/test:$(shell cat VERSION) .

run:
	@docker run -ti angular2-luis/test

clean:
	rm -rf node_modules/*