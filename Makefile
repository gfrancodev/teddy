# Variáveis
COMPOSE_PROJECT_NAME=teddy

# Comandos Docker
.PHONY: up down restart logs ps start-db down-db migrate

up:
	docker compose -p $(COMPOSE_PROJECT_NAME) up -d

down:
	docker compose -p $(COMPOSE_PROJECT_NAME) down

restart:
	docker compose -p $(COMPOSE_PROJECT_NAME) restart

logs:
	docker compose -p $(COMPOSE_PROJECT_NAME) logs -f

ps:
	docker compose -p $(COMPOSE_PROJECT_NAME) ps

start-db:
	docker compose -p $(COMPOSE_PROJECT_NAME) up -d db

down-db:
	docker compose -p $(COMPOSE_PROJECT_NAME) rm -s -f db

migrate:
	docker compose -p $(COMPOSE_PROJECT_NAME) up db-migration