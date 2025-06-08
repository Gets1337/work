const express = require('express');
const cors = require('cors');
const path = require('path');
const { auth, isAdmin } = require('./middleware/auth');
const toyRepository = require('./repositories/toyRepository');
const userRepository = require('./repositories/userRepository');
const orderRepository = require('./repositories/orderRepository');
const cartRepository = require('./repositories/cartRepository');
const authController = require('./controllers/authController');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Аутентификация
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Маршруты для игрушек
app.get('/toys', async (req, res) => {
    try {
        const toys = await toyRepository.findAll();
        res.json(toys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Защищенные маршруты для администратора
app.post('/toys', auth, isAdmin, async (req, res) => {
    try {
        const toy = await toyRepository.create(req.body);
        res.status(201).json(toy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/toys/:id', auth, isAdmin, async (req, res) => {
    try {
        const toy = await toyRepository.update(req.params.id, req.body);
        res.json(toy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/toys/:id', auth, isAdmin, async (req, res) => {
    try {
        await toyRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Маршруты для управления пользователями (только для админа)
app.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await userRepository.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await userRepository.update(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/users/:id/role', auth, isAdmin, async (req, res) => {
    try {
        const user = await userRepository.updateRole(req.params.id, req.body.role);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        await userRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Маршруты для управления заказами
app.get('/orders', auth, isAdmin, async (req, res) => {
    try {
        const orders = await orderRepository.findAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/orders/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const order = await orderRepository.updateStatus(req.params.id, req.body.status);
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/orders/:id', auth, isAdmin, async (req, res) => {
    try {
        await orderRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Обработка всех остальных маршрутов для SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
}); 