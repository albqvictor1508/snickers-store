import { Elysia } from "elysia";
import { loadRoutes } from "./utils/load-routes";

export const app = new Elysia()

await loadRoutes();

app.listen(3000);