import { db } from "./db";
import { faker } from "@faker-js/faker";

const user1 = await db.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

const user2 = await db.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

const user3 = await db.users.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		birthDate: faker.date.birthdate(),
	},
});

console.log({ user1, user2, user3 });
