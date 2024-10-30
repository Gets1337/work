const express = require('express');
const app = express();
const jsonInterpr = express.json();

let repo = [{
    number: 1,
    kind: 'человекоподобный',
    name: 'Никита',
    weight: '70',
    limbCount: 5,
    air: 'травкой',
    eat: 'энергетик'
}];

app.post('/', (req, res) => {
    // Создание
    let buffer = req.body;
    repo.push(buffer);
    res.send(buffer);
});

app.get('/', (req, res) => {
    // Чтение
    res.send(repo);
});

app.put('/:num', jsonInterpr, (req,res) => {
    // Редактирование 
    const num = req.params.num;
    let buffer = req.body;
    const index = repo.findIndex((item) => item.number == num);
    const ord = repo[index];
    if (!buffer) res.sendStatus(404);
    if (buffer.kind !== undefined) {
        ord.kind = buffer.kind;
    }
    if (buffer.name !== undefined) {
        ord.name = buffer.name;
    }
    if (buffer.weight !== undefined) {
        ord.weight = buffer.weight;
    }
    if (buffer.limbCount !== undefined) {
        ord.limbCount = buffer.limbCount;
    }
    if (buffer.air !== undefined) {
        ord.air = buffer.air;
    }
    if (buffer.eat !== undefined) {
        ord.eat = buffer.eat;
    }
res.send(ord);
});


app.listen(3000);