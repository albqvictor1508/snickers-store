import { env } from "../utils/env";
import { createTransport } from "nodemailer";

export const handleSendEmail = async (email: string) => {
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
			subject: "Alexsa, eu te amo!",
			html: "<h1>Para Alexsa!</h1> <p>Eu amo você com todo meu coração e vou estar contigo até o fim da minha vida</p>",
			text: "Para Alexsa, Eu amo você com todo meu coração e vou estar contigo até o fim da minha vida",
		});
	} catch (error) {
		console.log(error);
	}
};
