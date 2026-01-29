import authRepo from '../repo/auth.repo';

const authService = {
	async register(username: string, password: string) {
		if (!username || !password) {
			throw new Error('Username and password are required');
		}
		const existing = await authRepo.findUserByUsername(username);
		if (existing) {
			throw new Error('User already exists');
		}
		await authRepo.createUser(username, password);
	},

	async login(username: string, password: string) {
		const user = await authRepo.findUserByUsername(username);
		if (!user || user.password !== password) {
			throw new Error('Invalid credentials');
		}
		const token = `token_${username}_${Date.now()}`;
		await authRepo.createToken(user.id, token);
		return token;
	},

	async logout(token?: string) {
		if (!token) {
			throw new Error('Token is required');
		}
		await authRepo.deleteToken(token);
	},
};

export default authService;

