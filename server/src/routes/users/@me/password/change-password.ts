import { t } from "elysia";
import type { app } from "../../../../server";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/@me/password/change/:id",
		async ({ params: { id }, prisma, body }) => {
			const { password, repeatPassword } = body;

			return { password, repeatPassword };
		},
		{
			body: t.Object({
				password: t.String(),
				repeatPassword: t.String(),
			}),
		},
	);
};
