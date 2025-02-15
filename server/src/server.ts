import { Elysia, error, t } from "elysia";
import { loadRoutes } from "./utils/load-routes";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import { env } from "./utils/env";
import { cors } from "@elysiajs/cors";

export const app = new Elysia({ name: "Snickers Store" })
	.use(
		swagger({
			path: "/docs",
			documentation: { info: { title: "Snickers Store", version: "0.0.1" } },
			autoDarkMode: true,
		}),
	)
	.use(
		jwt({
			name: "jwt",
			schema: t.Object({
				id: t.String(),
				email: t.String({ format: "email" }),
			}),
			secret: env.JWT_SECRET,
		}),
	)
	.use(
		cors({
			origin: "*",
		}),
	)
	.derive(async ({ path, headers: { authorization: auth }, jwt, cookie }) => {
		const AUTH_ROUTES = ["/api/auth/new"];

		if (AUTH_ROUTES.includes(path)) return { user: { id: "", email: "" } }; //retornando user vazio pra ignorar a verificação do JWT

		console.log(auth);
		const token = auth ?? cookie.snickers_store_auth.value; //se não tiver no header, pega o cookie que eu criei mesmo
		const user = await jwt.verify(token); //verifica se o jwt é válido

		if (!token) return error("Unauthorized", "faltando o jwt seu bosseta");
		if (!user) return error("Unauthorized", "jwt errado seu msr");

		return { user }; //retornando o jwt verificado
	});

//mudar o prisma pra decorate e implementar e extensão do redis

await loadRoutes();

app.listen(3000, () => {
	console.log("HTTP Server running!");
});
