const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const prisma = new PrismaClient();

class AuthController {
    async register(req, res) {
        try {
            const { email, password, name, phone } = req.body;
            
            const hashedPassword = await bcrypt.hash(password, 8);
            
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    customer: {
                        create: {
                            name,
                            phone
                        }
                    }
                },
                include: {
                    customer: true
                }
            });

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    customer: true
                }
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Неверные учетные данные');
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController(); 