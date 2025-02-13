import { Elysia, t } from "elysia";
import { loadRoutes } from "./utils/load-routes";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import { env } from "./utils/env";
import { cors } from "@elysiajs/cors";

export const app = new Elysia()
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
	.derive(({ cookie }) => {
		return {
			biscoito: "era pra essa msr retornar um biscoito",
		};
	});

//criar função global com derive pra criação do cookie

await loadRoutes();

app.listen(3000, () => {
	console.log("HTTP Server running!");
});
