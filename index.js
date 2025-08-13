const axios = require("axios");
const fs = require("fs");

const SYMBOL = "ADAUSDT";
const INTERVAL = "15m";
const FILENAME = `data/${SYMBOL}_${INTERVAL}.txt`

const API_KLINES = "api/v3/klines";

async function downloadCandles() {
    const startTime = Date.now() - (365 * 24 * 60 * 60 * 1000);
    const response = await axios.get(`https://api.binance.com/${API_KLINES}?symbol=${SYMBOL}&interval=${INTERVAL}&limit=1000&startTime=${startTime}`);
    //console.log(response.data);
    const closes = response.data.map(k => k[4]).reduce((a, b) => a + "\n" + b);

    fs.writeFileSync(FILENAME, closes);
}

downloadCandles();

