import type { app } from "../../server";

export const route = (elysia: typeof app) => {
	elysia.get("/test/derive", ({ biscoito }) => {
		return { biscoito };
	});
};
