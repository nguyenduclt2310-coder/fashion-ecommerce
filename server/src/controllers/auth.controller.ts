import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { registerSchema, loginSchema } from '../validators/auth.validator';

// Đăng ký tài khoản
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password } = validatedData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            passwordHash
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.errors?.[0]?.message || error.message });
    }
};

// Đăng nhập & Tạo Cookie JWT
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
            return;
        }

        // Tạo Access Token
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_ACCESS_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        // Lưu JWT vào HttpOnly Cookie an toàn
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.errors?.[0]?.message || error.message });
    }
};