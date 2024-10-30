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

app.listen(3000);