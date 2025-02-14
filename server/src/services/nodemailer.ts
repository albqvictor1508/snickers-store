import { env } from "../utils/env";
import { createTransport } from "nodemailer";

type SendEmailSchema = {
	subject: string;
	html?: string;
	text?: string;
	email: string;
};

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
			host: "smtp.gmail.com",
			port: 0,
			secure: true, //true pra 465 e false pra qualquer outra porta (ta nas docs do nodemailer)
			auth: {
				user: env.MY_GMAIL,
				pass: env.MY_GMAIL_PASSWORD,
			},
		});

		await transport.sendMail({
			from: `Victor Albuquerque <${env.MY_GMAIL}>`,
			to: email,
			subject,
			html,
			text,
		});
	} catch (error) {
		console.log(error);
	}
};
