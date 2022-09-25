
# This file encapsulates development scripts.
# Run `$ make help` in this directory.
# 
# The build encapsulated in `Containerfile` performs:
#  - compiling NGINX and linking NGINX to Brotli module(s) 
#  - minify assets 
#  - inlining CSS includes into the HTML
#  - pre-compile static assets into Brotli
#
# Containerfile works with Docker, and all subsequent commands here work in
# shell if s/podman/docker since Podman shares the same CLI. In fact, 
# ~alias docker=podman~ suffices with the right shell context.
#
# The author recommends Podman as it doesn't run a daemon, is lighter weight,
# and requires less system privileges. https://podman.io/getting-started/installation
# For Mac: ~$ brew install podman~

cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS
build: ## Build the container
	podman build -t ${APP_NAME} .

run: ## Run container on port configured in `config.env`
	podman run -it --rm -d --env-file=./config.env -p=$(HOST_PORT):80 --name="$(APP_NAME)" $(APP_NAME)

up: build run ## Build and run

stop: ## Stop and remove a running container
	podman stop $(APP_NAME); podman rm $(APP_NAME)

ps: ## List running containers 
	podman ps 
	
sh: ## Bourne shell into the container
	podman exec -it ${APP_NAME} /bin/sh

bounce: ## Currently just restarts Podman, but should stop and start as a Make dependency
	podman machine start 

clean:
	podman rmi -a -f

local:
	python -m SimpleHTTPServer

# This Makefile was inspired by: https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db