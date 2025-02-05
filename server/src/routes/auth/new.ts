import { t } from "elysia";
import type { app } from "../../server";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/auth/new",
		async () => {
			return "ta pegando aq";
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String(),
			}),
		},
	);
};
