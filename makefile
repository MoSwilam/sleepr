run:
	docker compose up -d

test-reset:
	docker compose down && docker compose up --build e2e


clean:
	@echo "Cleaning and reinstalling dependencies in app directories..."
	@for dir in $(APPS); do \
		echo "Processing $$dir..."; \
		cd $$dir && rm -rf node_modules pnpm-lock.yaml && pnpm install; \
	done
	@echo "Cleaning and reinstalling dependencies in the root directory..."
	rm -rf node_modules pnpm-lock.yaml && pnpm install
	@echo "Clean and install completed successfully."