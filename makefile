run:
	docker compose up -d

test-reset:
	docker compose down && docker compose up --build e2e


clean:
	cd apps/notifications && rm -rf node_modules pnpm-lock.yaml && pnpm install
	cd apps/payments && rm -rf node_modules pnpm-lock.yaml && pnpm install
	cd apps/auth && rm -rf node_modules pnpm-lock.yaml && pnpm install
	rm -rf node_modules pnpm-lock.yaml && pnpm install