.PHONY: version dockerhub_login login logout build test up down push env images clean

include Makefile.settings

# If make is typed with no further arguments, then show a list of available targets
default:
	@awk -F\: '/^[a-z_/%]+:/ && !/default/ {printf "- %-20s\n", $$1}' Makefile

version:
	@ echo '{"Version": "$(APP_VERSION)"}'

login:
	${INFO} "Logging in to Docker registry $$DOCKER_REGISTRY..."
	$(DOCKER_LOGIN_EXPRESSION)

logout:
	${INFO} "Logging out of registry $$DOCKER_REGISTRY..."
	docker logout $(DOCKER_REGISTRY) 2>&-

dockerhub_login:
	${INFO} "Logging in to Dockerhub..."
	$(DOCKERHUB_LOGIN_EXPRESSION)

build:
	${COMPOSE_BUILDKIT} docker-compose -f docker-compose.local.yml build

up:
	${COMPOSE_BUILDKIT} docker-compose -f docker-compose.local.yml up -d --build ${APP_NAME}
	@ echo App running at http://localhost:3000

down:
	@ docker-compose -f docker-compose.local.yml down -v

ci:
	git branch -f ci && git push -f origin ci

# For main branch
build/%:
	DOCKER_BUILDKIT=1 docker build \
		-t $(DOCKER_REGISTRY)/$*:latest \
		-t $(DOCKER_REGISTRY)/$*:${APP_VERSION} \
		-f Dockerfile \
		.

push/%: login
	docker push $(DOCKER_REGISTRY)/$*:latest
	docker push $(DOCKER_REGISTRY)/$*:${APP_VERSION}

# For feature branch
build_feature/%:
	DOCKER_BUILDKIT=1 docker build \
		-t $(DOCKER_REGISTRY)/$*-feature:latest \
		-t $(DOCKER_REGISTRY)/$*-feature:${APP_VERSION} \
		-f Dockerfile \
		.

push_feature/%: login
	docker push $(DOCKER_REGISTRY)/$*-feature:latest
	docker push $(DOCKER_REGISTRY)/$*-feature:${APP_VERSION}

# Download env file from S3
env/%:
	aws s3 cp s3://$(S3_BUCKET_ENV)/.env.$* .env

clean:
	@ docker images -q -f dangling=true -f label=application=${APP_NAME} | xargs -I ARGS docker rmi -f --no-prune ARGS

images:
	@ docker images -f label=application=${APP_NAME}
