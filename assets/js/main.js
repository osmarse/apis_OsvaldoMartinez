const urlApi = 'https://mindicador.cl/api';
const filterCurrencies = ['dolar', 'euro'];
const selectWithCurrencies = document.querySelector('#currency');
const divResult = document.querySelector('#result');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getCurrencies = async () => {
    const reqCurrencies = await fetch(urlApi);
    const resData = await reqCurrencies.json();

    const currencyList = filterCurrencies.map((currency) => {
        return {
            code: resData[currency].codigo,
            value: resData[currency].valor,
        };
    });

    currencyList.forEach((currency) => {
        const option = document.createElement('option');
        option.value = currency.value;
        option.text = capitalize(currency.code);
        selectWithCurrencies.appendChild(option);
    });
};

const calcResult = (amount, currency) => {
    divResult.innerHTML = (amount / currency).toFixed(2);
};

const drawChart = async (currency) => {
    try {
        const reqChart = await fetch(`${urlApi}/${currency}`);
        const dataChart = await reqChart.json();
    
        const serieToChart = dataChart.serie.slice(0, 10);
        console.log(serieToChart);
    
        // const labels = Utils.months({ count: 7 });
        const data = {
            labels: serieToChart.map((item) => item.fecha),
            datasets: [{
                label: currency,
                data: serieToChart.map((item) => item.valor),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
            ]
        };
    
        const config = {
            type: 'line',
            data: data,
        };
    
        let chartStatus = Chart.getChart("chart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
    
        const chartDOM = document.getElementById('chart');
        new Chart(chartDOM, config); 
    } catch (error) {
        alert(error.message)
    }
    
}

document.querySelector('#btnConvert').addEventListener('click', () => {
    const amountPesos = document.querySelector('#pesos').value;
    if (amountPesos === '') {
        alert('Debes ungresar una cantidad en pesos.');
        return;
    }
    const currencySelected = selectWithCurrencies.value;
    const codeCurrencySelected = selectWithCurrencies.options[selectWithCurrencies.selectedIndex].text.toLowerCase();

    calcResult(amountPesos, currencySelected);
    drawChart(codeCurrencySelected);

})

getCurrencies(); 