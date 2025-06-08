# Toy Shop Service

Простой сервис для управления магазином игрушек с использованием Node.js, Express и Prisma.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте базу данных:
```bash
npx prisma generate
npx prisma db push
```

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm start
```

## API Endpoints

### Игрушки
- GET /toys - получить список всех игрушек
- POST /toys - добавить новую игрушку
```json
{
  "name": "Мишка",
  "description": "Плюшевый медведь",
  "price": 999.99,
  "stock": 10
}
```

### Клиенты
- GET /customers - получить список всех клиентов
- POST /customers - добавить нового клиента
```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7999999999"
}
```

### Заказы
- GET /orders - получить список всех заказов
- POST /orders - создать новый заказ
```json
{
  "customerId": 1,
  "items": [
    {
      "toyId": 1,
      "quantity": 2,
      "price": 999.99
    }
  ]
}
``` 