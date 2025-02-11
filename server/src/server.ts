import { Elysia } from "elysia";
import { loadRoutes } from "./utils/load-routes";
import swagger from "@elysiajs/swagger";

export const app = new Elysia().use(
	swagger({
		path: "/docs",
		documentation: { info: { title: "Snickers Store", version: "0.0.1" } },
		autoDarkMode: true,
	}),
);

await loadRoutes();

app.listen(3000);
