"use strict"
// Génère le site statique dans dist/ : node build.js
import ejs from "ejs"
import fs from "fs"

// Le franc pacifique a une parité fixe avec l'euro : 1 € = 119,33 XPF
const XPF_PER_EUR = 119.33
// Valeur de secours si l'API de la BCE ne répond pas
const FALLBACK_USD_PER_EUR = 1.12

async function fetchUsdRate() {
   try {
      const response = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD")
      const data = await response.json()
      return data.rates.USD
   } catch (error) {
      console.warn("Taux USD indisponible, valeur de secours utilisée :", error.message)
      return FALLBACK_USD_PER_EUR
   }
}

const menu = JSON.parse(fs.readFileSync("./data/menu.json", "utf8"))
const rates = { eur: 1, usd: (await fetchUsdRate()).toFixed(2), xpf: XPF_PER_EUR.toFixed(2) }

const html = await ejs.renderFile("./views/index.ejs", { menu: menu.menu, rates })

fs.rmSync("./dist", { recursive: true, force: true })
fs.cpSync("./public", "./dist", { recursive: true })
fs.writeFileSync("./dist/index.html", html)

console.log(`dist/ généré — 1 € = ${rates.usd} $ = ${rates.xpf} XPF`)
