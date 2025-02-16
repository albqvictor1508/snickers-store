import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["warn", "error", "query"] });

await prisma.users.deleteMany();

const user1 = await prisma.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

const user2 = await prisma.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

const user3 = await prisma.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

console.log({ user1, user2, user3 });
