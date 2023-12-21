"use strict"
import express from "express"

const app = express()

// For the free update from exchangeratesapi base is EUR
const rates = { eur: 1, usd : 1.10, xpf : 119.33}

app.use(express.static("public"))

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
   res.render("index", { rates })
})

// Function to fetch the latest exchange rates
async function fetchExchangeRates() {
   // Replace 'YOUR_ACCESS_KEY' with your actual API key from exchangeratesapi.io
   const apiKey = process.env.apiKey;
   console.log(apiKey)
   // The base of the API request is EUR then filter USD abd XPF
   const apiUrl = `http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=USD,XPF`;
   try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.rates;
   } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
   }
}

// Example usage
async function updateCurrencyExchange() {
   const exchangeRates = await fetchExchangeRates();

   if (exchangeRates) {
   // Update the displayed currency values
      rates.usd = exchangeRates.USD.toFixed(2); // Example: 2 decimal places
      rates.xpf = exchangeRates.XPF.toFixed(2); // Example: 2 decimal places
      console.log(`Rates updated : ${rates.usd} $ -- ${rates.xpf} €`);
   }
}

// Call the update function periodically or based on your application's needs
const jour = 60000 * 60 * 24;
setInterval(updateCurrencyExchange, jour); // Update every day, adjust as needed

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Listenning on PORT : ${PORT}`)
})