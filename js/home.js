
loadHome();
async function loadHome() {

    const responseTopList = await getTopList();
    const topListJson = await responseTopList.json();

    // console.info("topListJson: " + topListJson);
    let topListMap = new Map(Object.entries(topListJson));

    // loadTabs(topListMap);
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

/*function loadTabs (topListMap) {

    for (let [jogoKey, jogoValue] of topListMap.entries()) {

        let jogoValueMap = new Map(Object.entries(jogoValue));
        jogoValueMap = ordered(jogoValueMap);

        // const keys = [];
        // for (let [key, value] of jogoValueMap.entries()) {
        //     keys.push(key);
        // }

        let dataCharts = [];
        for (let [key, value] of jogoValueMap.entries()) {
            dataCharts.push({name: "N:" + key, y: value});
        }

        let chartContainer = "topListID-" + jogoKey;
        if (jogoKey === 'mega-sena') {

            let charts = dataCharts.slice(-12, dataCharts.length);
            highCharts(chartContainer + "-mais", charts, jogoKey.toUpperCase() + ': Números mais saíram nos ultimos 100 jogos');

            charts = dataCharts.slice(0, 12);
            highCharts(chartContainer + "-menos", charts, jogoKey.toUpperCase() + ': Números menos saíram nos ultimos 100 jogos');

        }

        if (jogoKey === 'lotofacil') {

            let charts = dataCharts.slice(-15, dataCharts.length);
            highCharts(chartContainer + "-mais", charts, jogoKey.toUpperCase() + ': Números mais saíram nos ultimos 100 jogos');

            charts = dataCharts.slice(0, 15);
            highCharts(chartContainer + "-menos", charts, jogoKey.toUpperCase() + ': Números menos saíram nos ultimos 100 jogos');

        }

    }

}*/

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

    let numbersMap = new Map();
    for (let i = 0; i < qtdNumeros; i++) {

        // console.log("i: " + i);
        let number = Math.floor(Math.random() * Number.parseInt(maiorNumero)) + Number.parseInt(menorNumero);
        let val = numbersMap.get(number);
        if (number < menorNumero || val === 'undefined') {
            i--
            continue
        }
        numbersMap.set(number, number);
    }

    numbersMap = ordered(numbersMap);
    return numbersMap;
}