run:
	docker compose up -d

test-reset:
	docker compose down && docker compose up --build e2e

clean:
	