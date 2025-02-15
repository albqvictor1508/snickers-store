import { error, t } from "elysia";
import type { app } from "../../server";
import { db } from "../../../prisma/db";
import { handleSendEmail } from "../../services/nodemailer";
import type { CodeSchema } from "../../types/auth";

const codes = {} as Record<string, CodeSchema>;

const ONE_SECOND_IN_MS = 1000;
const THREE_MIN_IN_MS = 180000;

//checando a validade dos codigos gerados
setInterval(() => {
	for (const code in codes) {
		if (Date.now() - THREE_MIN_IN_MS > codes[code].createdAt) {
			delete codes[code];
		}
	}
}, ONE_SECOND_IN_MS);

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/auth/new",
		async ({ body, jwt, cookie }) => {
			if ("code" in body) {
				//ta demorando mto pra criar o usuário, não tá enviando o segundo email, não ta validando o código

				const setting = codes[body.email]; //busca os dados enviados na primeira requisição, pro usuário n ter q enviar dnv

				const { name, email, password, birthDate, phone } = setting;
				const [data] = await Promise.all([
					await db.users.create({
						data: {
							name,
							email,
							password: await Bun.password.hash(password, "bcrypt"),
							birthDate,
						},
					}),
					handleSendEmail({
						email,
						subject: "Snicker Store - Seja bem vindo!",
					}),
				]);

				//criar o código pra enviar pro email

				cookie.snickers_store_auth.value = await jwt.sign({
					id: data.id,
					email,
				});

				return { id: data.id, jwt };
			}

			const { email } = body;

			const isUserAlreadyRegistered = await db.users.findFirst({
				where: { email },
			});

			if (isUserAlreadyRegistered)
				return error("Bad Request", "ja ta resgistrado seu msr");

			if (codes[email]) return error("Bad Request", "ja ta logado paizão");

			//criar o código, enviar o email com o código e armazenar o código dos usuários por 3 min

			const generatedCode = Math.random()
				.toString(16)
				.slice(2, 8)
				.toUpperCase();

			handleSendEmail({
				email,
				subject: "Snickers Store - Aqui está o seu código!",
				text: generatedCode,
			});

			codes[email] = {
				...body,
				code: generatedCode,
				createdAt: Date.now(),
			};

			return { success: true };
		},
		{
			body: t.Object({
				name: t.String(),
				email: t.String({ format: "email" }),
				code: t.Optional(t.String()),
				password: t.String(),
				birthDate: t.Date(),
			}),
		},
	);
};
