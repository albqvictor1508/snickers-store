import { t } from "elysia";
import type { app } from "../../server";
import { handleSendEmail } from "../../services/nodemailer";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/auth/login",
		async ({ prisma, body, error, cookie, jwt }) => {
			const { email, password } = body;

			const userExists = await prisma.users.findFirst({
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

			cookie.snickers_store_auth.value = await jwt.sign({
				id: userExists.id,
				email: userExists.email,
			});

			handleSendEmail({
				email: userExists.email,
				subject: "Fluxify | Login com sucesso!",
				text: `um login foi realizado em ${Date.now}, foi você?`,
			});

			return { id: userExists.id, jwt: cookie.snickers_store_auth.value };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String(),
			}),
		},
	);
};
