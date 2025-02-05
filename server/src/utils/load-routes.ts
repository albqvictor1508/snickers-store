import { app } from "../server";

export const loadRoutes = async () => {
	const glob = new Bun.Glob("./src/routes/**/*.ts");

	for await (const file of glob.scan()) {
		const { route } = await import(`../../${file}`);

		route(app);
	}
};
