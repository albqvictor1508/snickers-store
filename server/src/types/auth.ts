export type SendEmailSchema = {
	subject: string;
	html?: string;
	text?: string;
	email: string;
};

export type CodeSchema = {
	name: string;
	email: string;
	code: string;
	password: string;
	phone?: string;
	birthDate: Date;
	createdAt: number;
};
