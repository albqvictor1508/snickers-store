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
				data: { email, password, birthDate },
			});

			const token = await jwt.sign({id: user.id, email})

			//salvar o cookie no back-end ou validar se ele foi enviado na requisição pelo front

			return {id: user.id, token}
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
