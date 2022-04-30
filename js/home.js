
loadHome();
async function loadHome() {

    const responseTopList = await getTopList();
    const topListJson = await responseTopList.json();

    // console.info("topListJson: " + topListJson);
    let topListMap = new Map(Object.entries(topListJson));

    loadTabs(topListMap);

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

function loadTabs (topListMap) {

    for (let [jogoKey, jogoValue] of topListMap.entries()) {

        let jogoValueMap = new Map(Object.entries(jogoValue));
        jogoValueMap = ordered(jogoValueMap);

        const keys = [];
        for (let [key, value] of jogoValueMap.entries()) {
            keys.push(key);
        }

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
    `<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
    <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">...</div>
  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
  <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
</div>`

}