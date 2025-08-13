const axios = require("axios");
const fs = require("fs");

const SYMBOL = "ADAUSDT";
const INTERVAL = "15m";
const FILENAME = `data/${SYMBOL}_${INTERVAL}.txt`
const TIMESTAMP = Date.now()

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
    await downloadCandles(response.data[response.data.length - 1][6] + 1)
}

const startTime = TIMESTAMP - (365 * 24 * 60 * 60 * 1000);
downloadCandles(startTime);

