import { t } from "elysia";
import type { app } from "../../server";
import { db } from "../../../prisma/db";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/auth/login",
		async ({ body, error, cookie }) => {
			const { email, password } = body;

			const userExists = await db.users.findFirst({
				where: {
					email,
				},
			});

			if (!userExists)
				return error(
					"Unauthorized",
					"User não existe krl, cria a conta filho da puta",
				);

			const isPasswordCorrect = await Bun.password.verify(
				password,
				userExists.password,
			);

			if (!isPasswordCorrect)
				return error("Unauthorized", "Senha errada seu arrombado");
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String(),
			}),
		},
	);
};
