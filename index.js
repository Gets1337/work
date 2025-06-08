const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(cors());
app.use(express.json());

// Маршруты для игрушек
app.get('/toys', async (req, res) => {
  try {
    const toys = await prisma.toy.findMany();
    res.json(toys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/toys', async (req, res) => {
  try {
    const toy = await prisma.toy.create({
      data: req.body
    });
    res.json(toy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршруты для клиентов
app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/customers', async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: req.body
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршруты для заказов
app.post('/orders', async (req, res) => {
  try {
    const { customerId, items } = req.body;
    
    // Вычисляем общую стоимость заказа
    let totalPrice = 0;
    for (const item of items) {
      const toy = await prisma.toy.findUnique({
        where: { id: item.toyId }
      });
      totalPrice += toy.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        totalPrice,
        items: {
          create: items.map(item => ({
            toyId: item.toyId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        customer: true
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 