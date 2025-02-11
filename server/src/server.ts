import { Elysia } from "elysia";
import { loadRoutes } from "./utils/load-routes";
import swagger from "@elysiajs/swagger";

export const app = new Elysia().use(
	swagger({ path: "/docs", autoDarkMode: true }),
);

await loadRoutes();

app.listen(3000);
