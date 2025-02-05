import { app } from "../server";

export const route = async (elysia: typeof app) => {
    elysia.get("/test", async () => {
        return {message: "bom dia porra"}
    })
} 