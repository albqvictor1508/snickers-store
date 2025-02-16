import { t } from "elysia";
import type { app } from "../../../../server";

export const route = (elysia: typeof app) => {
	elysia.put(
		"/api/@me/password/change/:id",
		async ({ params: { id }, prisma, body, error }) => {
			const { password, repeatPassword } = body;

			if (password !== repeatPassword)
				return error("Unauthorized", "os dois campos tem que ser iguais");

			const userExists = await prisma.users.findUnique({
				where: {
					id,
				},
				select: { password: true, id: true },
			});

			if (!userExists) return error("Unauthorized", "O user nem existe");

			const isPasswordCorrect = await Bun.password.verify(
				password,
				userExists.password,
			);

			if (isPasswordCorrect)
				return error("Unauthorized", "essa é sua senha atual ou animal");

			const user = await prisma.users.update({
				where: {
					id,
				},
				data: {
					password: await Bun.password.hash(password, "bcrypt"),
				},
			});

			return { id: user.id, password: user.password };
		},
		{
			body: t.Object({
				password: t.String({
					pattern:
						"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
				}),
				repeatPassword: t.String({
					pattern:
						"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
				}),
			}),
		},
	);
};
