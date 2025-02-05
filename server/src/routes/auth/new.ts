import { t } from "elysia";
import type { app } from "../../server";
import { db } from "../../../prisma/db";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/auth/new",
		async ({ body }) => {
			const { email, password, birthDate } = body;

			const user = await db.users.create({
				data: { email, password, birthDate },
			});
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String(),
				birthDate: t.Date(),
			}),
		},
	);
};
