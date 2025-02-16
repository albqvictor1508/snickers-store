import type { SendEmailSchema } from "../types/auth";
import { env } from "../utils/env";
import { createTransport } from "nodemailer";

export const handleSendEmail = async ({
	subject,
	email,
	html,
	text,
}: SendEmailSchema) => {
	if (!email) {
		throw new Error("missing email on send email function");
	}

	try {
		const transport = createTransport({
			host: env.MAIL_HOST,
			service: env.MAIL_SERVICE,
			port: 465,
			secure: true, //true pra 465 e false pra qualquer outra porta (ta nas docs do nodemailer)
			auth: {
				user: env.MY_GMAIL,
				pass: env.MY_GMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		await transport.sendMail({
			from: `Fluxify <${env.MY_GMAIL}>`,
			to: email,
			subject,
			html,
			text,
		});
	} catch (error) {
		console.log(error);
		return error;
	}
};
