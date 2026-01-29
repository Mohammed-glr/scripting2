import prisma from '../db';

const authRepo = {
	async createUser(username: string, password: string) {
		return prisma.user.create({
			data: { username, password },
		});
	},

	async findUserByUsername(username: string) {
		return prisma.user.findUnique({
			where: { username },
		});
	},

	async createToken(userId: number, value: string) {
		return prisma.token.create({
			data: { value, userId },
		});
	},

	async deleteToken(value: string) {
		return prisma.token.delete({
			where: { value },
		});
	},
};

export default authRepo;
