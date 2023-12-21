// Function to initialize the currency converter
function start() {
    // Fetching DOM elements
    const xpf = document.getElementById("xpf");
    const eur = document.getElementById("eur");
    const usd = document.getElementById("usd");
    const displayed = document.getElementById("displayed");

    // Array of currency elements
    const currencies_elts = [xpf, eur, usd];

    // Mapping currency codes to their values
    const currencies = {
        "xpf": xpf.dataset.value,
        "eur": eur.dataset.value,
        "usd": usd.dataset.value
    };

    // Mapping currency codes to their units
    const units = {
        "eur": " €",
        "usd": " $",
    };

    // Extracting initial values for currencies and rates
    const xpf_value = xpf.dataset.value;
    const eur_value = eur.dataset.value;
    const usd_value = usd.dataset.value;
    const rates = {
        "eur": eur_value / xpf_value,
        "usd": usd_value / xpf_value,
    };

    // Creating a copy of default prices
    const default_prices = CopyPrices();

    // Adding event listeners to currency elements
    currencies_elts.forEach(elt => { addEvent(elt) });

    // Add Event Listeners
    function addEvent(out_currency_elt) {
        out_currency_elt.addEventListener("click", () => { updatePrices(out_currency_elt) });
    }

    // Function to update prices based on selected currency
    function updatePrices(out_currency_elt) {
        if (out_currency_elt.id !== displayed.dataset.value) {
            reset(default_prices);
            xpf.style.fill = "rgb(107 114 128)";
            eur.style.stroke = "rgb(107 114 128)";
            usd.style.stroke = "rgb(107 114 128)";

            if (out_currency_elt.id !== "xpf") {
                convert(out_currency_elt);
                displayed.dataset.value = out_currency_elt.id;
                out_currency_elt.style.stroke = "black";
            }
            else {
                displayed.dataset.value = out_currency_elt.id;
                xpf.style.fill = "black";
            }
        }
    }

    // Function to perform currency conversion
    function convert(out_currency_elt) {
        const prices = getPrices();
        const rate = rates[out_currency_elt.id];
        const out_unit = units[out_currency_elt.id];
        prices.forEach(price => {
            let text = Math.round(parseInt(price.textContent.replace(' fr', '')) * rate);
            text += out_unit;
            price.textContent = text;
        });
    }

    // Function to get all prices on the page
    function getPrices() { return [...document.getElementsByClassName("price")]; }

    // Function to create a copy of default prices
    function CopyPrices() { return getPrices().map(element => element.cloneNode(true)); }

    // Function to reset prices to default values
    function reset() {
        const prices = getPrices();
        for (let i = 0; i < prices.length; i++) {
            prices[i].textContent = default_prices[i].textContent;
        }
    }
}

// Event listener to start the currency converter when the window is loaded
window.addEventListener('load', start);
