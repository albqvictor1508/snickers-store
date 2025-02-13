import { t } from "elysia";
import type { app } from "../../server";
import { db } from "../../../prisma/db";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/auth/new",
		async ({ body, jwt, cookie }) => {
			const { email, password, birthDate } = body;

			//dar uma refinada na autenticação
			const user = await db.users.create({
				data: {
					email,
					password: await Bun.password.hash(password, "bcrypt"),
					birthDate,
				},
			});

			//email

			//salvando jwt em um cookie
			cookie.snickers_store_auth.value = await jwt.sign({
				id: user.id,
				email,
			});

			return { id: user.id, jwt };
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
