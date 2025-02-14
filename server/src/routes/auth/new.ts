import { t } from "elysia";
import type { app } from "../../server";
import { db } from "../../../prisma/db";
import { handleSendEmail } from "../../services/nodemailer";
import { CodeSchema } from "../../types/auth";

const codes = {} as Record<string, CodeSchema>

const ONE_SECOND_IN_MS = 1000;
const THREE_MIN_IN_MS = 180000

//checando a validade dos codigos gerados
setInterval(() => {
	for(const code in codes) {
		if(Date.now() - THREE_MIN_IN_MS > codes[code].createdAt) {
			delete codes[code]
		}
	}
}, ONE_SECOND_IN_MS);

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/auth/new",
		async ({ body, jwt, cookie }) => {

			const { email, password, birthDate } = body;

			const [data] = await Promise.all([
				await db.users.create({
					data: {
						email,
						password: await Bun.password.hash(password, "bcrypt"),
						birthDate,
					},
				}),
				handleSendEmail({ email, subject: "Snicker Store - Create new user" }),
			]);

			//criar o código pra enviar pro email

			cookie.snickers_store_auth.value = await jwt.sign({
				id: data.id,
				email,
			});

			return { id: data.id, jwt };
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
