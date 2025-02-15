import { t } from "elysia";
import type { app } from "../../server";
import { handleSendEmail } from "../../services/nodemailer";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/test/email",
		async ({ body: { email } }) => {
			handleSendEmail({
				email,
				subject: "Snickers Store | Test email",
				text: "Testando o email aqui paizão",
			});

			return { msg: "email sended!" };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
			}),
		},
	);
};
