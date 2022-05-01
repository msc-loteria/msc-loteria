
loadHome();
async function loadHome() {

    const responseTopList = await getTopList();
    const topListJson = await responseTopList.json();

    // console.info("topListJson: " + topListJson);
    let topListMap = new Map(Object.entries(topListJson));

    loadNavTabs(topListMap);

}

function highCharts (divID, dataCharts, titleText) {

    Highcharts.chart(divID, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: titleText
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Números',
            colorByPoint: true,
            data: dataCharts
        }]
    });
}

function ordered (topListMap) {

    // console.log("topListMap:", topListMap);
    let keys = []
    for (let [key, value] of topListMap) {
        keys.push(key)
    }

    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            if ( topListMap.get(keys[i]) < topListMap.get(keys[j]) ) {
                let temp = keys[i];
                keys[i] = keys[j];
                keys[j] = temp;
            }
        }
    }

    // console.log("keys:", keys);
    const numbers = new Map();
    for (let key of keys) {
        // console.log("By value:", topListMap.get(key));
        numbers.set(key, topListMap.get(key));
    }

    // console.log("numbers: ", numbers);
    return numbers;
}

function loadNavTabs (topListMap) {

    for (let [jogoKey, jogoValue] of topListMap.entries()) {

        let jogoValueMap = new Map(Object.entries(jogoValue));
        jogoValueMap = ordered(jogoValueMap);

        let dataCharts = [];
        for (let [key, value] of jogoValueMap.entries()) {
            dataCharts.push({name: "N:" + key, y: value});
        }

        let chartContainer = "topListID-" + jogoKey;
        let conf = getConf(jogoKey);

        let charts = dataCharts.slice((conf.qtdNumerosExibidos * -1), dataCharts.length);
        highCharts(chartContainer + "-mais", charts, jogoKey.toUpperCase() + ': Números mais saíram nos ultimos 100 jogos');

        charts = dataCharts.slice(0, conf.qtdNumerosExibidos);
        highCharts(chartContainer + "-menos", charts, jogoKey.toUpperCase() + ': Números menos saíram nos ultimos 100 jogos');

    }

}

function getConf (jogoKey) {
    let jogo = new Map();
    jogo.set("mega-sena", getMegasenaConf());
    jogo.set("lotofacil", getLotofacilConf());

    return jogo.get(jogoKey);
}

function getMegasenaConf() {

    let obj = new Object();
    obj.nome = "mega-sena";
    obj.qtdNumerosExibidos = 12;

    return obj
}

function getLotofacilConf() {

    let obj = new Object();
    obj.nome = "lotofacil";
    obj.qtdNumerosExibidos = 12;

    return obj
}

function gerarJogo(menorNumero, maiorNumero, qtdNumeros) {

    console.log("menorNumero", menorNumero, "maiorNumero", maiorNumero, "qtdNumeros", qtdNumeros);
    if (!Number.isInteger(Number.parseInt(menorNumero)) || !Number.isInteger(Number.parseInt(maiorNumero))
        || !Number.isInteger(Number.parseInt(qtdNumeros))) {
        console.log("not a number");
        return false
    }

    let numbersMap = new Map();
    let i = 0;
    while (i < qtdNumeros) {
        const number = Math.floor(Math.random() * Number.parseInt(maiorNumero)) + Number.parseInt(menorNumero);
        let val = numbersMap.get(number);
        if (number >= menorNumero && !Number.isInteger(val)) {
            // console.log("i: " + i + " - number: " + number);
            numbersMap.set(number, number);
            i++;
        }
    }

    numbersMap = ordered(numbersMap);
    console.log("numbersMap: " + numbersMap);
    return numbersMap;
}