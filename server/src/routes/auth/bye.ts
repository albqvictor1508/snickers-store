import type { app } from "../../server";

export const route = (elysia: typeof app) => {
	elysia.post("/api/auth/bye", async ({ cookie }) => {
		cookie.snickers_store_auth.remove();

		return {
			status: "removed",
			cookie: cookie.snickers_store_auth.value,
		};
	});
};
