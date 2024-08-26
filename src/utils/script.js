const fs = require('fs');

const filePath = './white-list.json';

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function generateRandomBalance() {
    let balance = '';
    for (let i = 0; i < 24; i++) {
        balance += Math.floor(Math.random() * 10);
    }
    return balance;
}

data.forEach(item => {
    item.balance = generateRandomBalance();
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log('Campo balance agregado con éxito.');