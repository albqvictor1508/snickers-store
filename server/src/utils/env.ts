import { cleanEnv, email, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	POSTGRES_USER: str(),
	POSTGRES_PASSWORD: str(),
	POSTGRES_DB: str(),
	MY_GMAIL: email(),
	MY_GMAIL_PASSWORD: str(),
	JWT_SECRET: str(),
	GMAIL_PORT: str(),
	MAIL_HOST: str(),
	MAIL_SERVICE: str(),
});
