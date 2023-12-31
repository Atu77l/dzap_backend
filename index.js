const express=require('express')
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const connectDB=require('./db/connectDB')
require('dotenv');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const cors=require('cors');
const axios = require('axios')


const app=express();
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());
const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose.Types

mongoose.set("strictQuery", true);
connectDB();

app.get('/api/convert', async (req, res) => {
    const { sourceCrypto, amount, targetCurrency } = req.query;
  
    try {
      // Fetch real-time exchange rate
      const exchangeRateResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: sourceCrypto,
          vs_currencies: targetCurrency,
        },
      });
  
      const exchangeRate = exchangeRateResponse.data[sourceCrypto][targetCurrency];
      const convertedAmount = amount * exchangeRate;
  
      res.json({
        sourceCrypto,
        amount,
        targetCurrency,
        exchangeRate,
        convertedAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
app.get('/api/top-cryptos', async (req, res) => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });
  
      const topCryptos = response.data;
      res.json({ topCryptos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(4000,()=>{
    console.log("connected to port");
})


