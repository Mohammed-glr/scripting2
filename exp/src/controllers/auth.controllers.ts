import { Request, Response } from 'express';
import authService from '../services/auth.services';

export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    await authService.register(username, password);
    res.send('User registered');
}

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
}

export const logoutUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logout(token);
    res.send('User logged out');
}