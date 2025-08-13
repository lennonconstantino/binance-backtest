const axios = require("axios");

const SYMBOL = "ADAUSDT";
const INTERVAL = "15m";

const API_KLINES = "api/v3/klines";

async function downloadCandles() {
    const startTime = Date.now() - (365 * 24 * 60 * 60 * 1000);
    const response = await axios.get(`https://api.binance.com/${API_KLINES}?symbol=${SYMBOL}&interval=${INTERVAL}&limit=1000&startTime=${startTime}`);
    console.log(response.data);
}

downloadCandles();

