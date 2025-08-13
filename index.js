const axios = require("axios");
const fs = require("fs");

const SYMBOL = "ADAUSDT";
const INTERVAL = "15m";
const FILENAME = `data/${SYMBOL}_${INTERVAL}.txt`;
const TIMESTAMP = Date.now();
const PROFITABILITY = 1; // %

const API_KLINES = "api/v3/klines";

async function downloadCandles(startTime) {
    // Codição de parada
    if (startTime >= TIMESTAMP) return;

    const response = await axios.get(`https://api.binance.com/${API_KLINES}?symbol=${SYMBOL}&interval=${INTERVAL}&limit=1000&startTime=${startTime}`);
    const closes = response.data.map(k => k[4]).reduce((a, b) => a + "\n" + b);

    if (fs.existsSync(FILENAME))
        fs.appendFileSync(FILENAME, "\n" + closes);
    else
        fs.writeFileSync(FILENAME, closes);
    // Recursivo
    await downloadCandles(response.data[response.data.length - 1][6] + 1);
}

const startTime = TIMESTAMP - (365 * 24 * 60 * 60 * 1000);
//downloadCandles(startTime);

// Script de exemplo - Etapa 2
async function doBacktest() {
    let closes = fs.readFileSync(FILENAME, {encoding: "utf-8"});
    closes = closes.split("\n").map(c => parseFloat(c));
    console.log(closes);
    
    let qtdSells = 0;
    let isOpened = true; // aberto = comprado = holding
    const firstCandle = closes[0];
    let orderPrice = firstCandle; // Preço que eu comprei
    console.log("Abriu e comprou no preço " + firstCandle);

    // logic lives here!
    for (let i=1; i < closes.length; i++) {
        const currentCandle = closes[i];

        const targetPrice = isOpened
            ? orderPrice * (1 + (PROFITABILITY / 100))
            : orderPrice * (1 - (PROFITABILITY / 100));

        if (isOpened) { // tenho moeda, Quero vender
            if (currentCandle >= targetPrice) {
                qtdSells++;
                isOpened = false;
                console.log(`Vendeu no preço ${currentCandle}`);
            }
        }
        else if (!isOpened) { // Estou sem moeda, quero comprar
            if (currentCandle <= targetPrice) {
                isOpened = true;
                console.log("Comprou no preço " + currentCandle);
            }

            orderPrice = currentCandle;
        }
    }

    // Regra - o meu script nunca vai terminar aberto, se chegar na ultima vela, eu fecho.
    const lastCandle = closes[closes.length - 1];
    console.log("Fechou no preço " + lastCandle);
    console.log("Operações: " + qtdSells);

}

doBacktest();