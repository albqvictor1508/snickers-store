import type { app } from "../../server";

export const route = (elysia: typeof app) => {
	elysia.post("/api/auth/bye", async ({ biscoito, headers }) => {
		return {
			cookieValue: biscoito,
		};
	});
};
