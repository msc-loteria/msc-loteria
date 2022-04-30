
const URL_BASE = "https://msc-loteria-api.herokuapp.com/msc-loteria-api"

let jogosNome = ["mega-sena", 'loteria']

async function getLatests (loteria) {

    const URL_FINAL = URL_BASE + "/" + loteria + "/latest";
    let response = await fetch(URL_FINAL, {
        method: "GET",
        headers: {

        },
    });

    return response
}

async function getTopList () {

    const URL_FINAL = URL_BASE + "/top";
    let response = await fetch(URL_FINAL, {
        method: "GET",
        headers: {
        },
    });

    return response
}