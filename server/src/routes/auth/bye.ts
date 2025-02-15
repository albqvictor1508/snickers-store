import type { app } from "../../server";

export const route = (elysia: typeof app) => {
	elysia.post("/api/auth/bye", async ({ cookie, headers }) => {
		return {
			headers,
			cookieValue: cookie.snickers_store_auth.value,
			cookie: cookie.snickers_store_auth.cookie,
		};
	});
};
