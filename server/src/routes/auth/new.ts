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
				//jwt ta vindo colocado no cookie, o nodemailer frequentemente ta bugando a conexão

				const setting = codes[body.email]; //busca os dados enviados na primeira requisição, pro usuário n ter q enviar dnv

				const { name, email, password, birthDate, phone } = setting;

				if (setting.code !== body.code)
					//já que o código é salvo no setting e enviado dps no body, era mto simples validar ele fdp
					return error("Bad Request", "invalid code");

				const [data] = await Promise.all([
					await db.users.create({
						data: {
							name,
							email,
							phone,
							password: await Bun.password.hash(password, "bcrypt"),
							birthDate,
						},
					}),
					handleSendEmail({
						email,
						subject: "Snicker Store - Seja bem vindo!",
					}),
				]);

				cookie.snickers_store_auth.value = await jwt.sign({
					id: data.id,
					email,
				});

				return { id: data.id, cookie: cookie.snickers_store_auth.value };
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

			//esse código gerado vai ser buscado pelo email na variável setting dentro daquele if, salvando o código gerado e o body do user
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
