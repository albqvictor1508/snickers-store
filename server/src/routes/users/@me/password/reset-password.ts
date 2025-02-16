import { t } from "elysia";
import type { app } from "../../../../server";
import { handleSendEmail } from "../../../../services/nodemailer";

export const route = (elysia: typeof app) => {
	elysia.post(
		"/api/@me/password/reset",
		async ({ body, prisma, error }) => {
			const { email } = body;

			const isUserAlreadyRegistered = await prisma.users.findUnique({
				where: {
					email,
				},
				select: { id: true },
			});

			if (!isUserAlreadyRegistered)
				return error("Unauthorized", "A msr do usuário n existe");

			handleSendEmail({
				email,
				subject: "Fluxify | Recupere sua senha",
				html: `<a href='http://localhost:3000/api/@me/password/change/${isUserAlreadyRegistered.id}'><button>Recuperar senha</button></a>`,
			});
		},
		{
			body: t.Object({ email: t.String({ format: "email" }) }),
		},
	);
};
