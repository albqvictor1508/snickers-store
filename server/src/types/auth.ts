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
	phone?: string;
	birthDate: string;
	createdAt: number;
}