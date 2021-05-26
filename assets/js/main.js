// URLs, EndPoints & Options
const baseUrl = "https://api.covid19api.com";
const summaryUrl = "/summary";
const countriesUrl = "/countries";
const requestOptions = {
  method: "GET",
  redirect: "follow",
};

//DOM Elements
const selectCountries = document.getElementById("combo");
const selecData = document.getElementById("sdata");
const txtconf = document.getElementById("confirmed");
const txtdeath = document.getElementById("death");
const txtrecovered = document.getElementById("recovered");
const txtactives = document.getElementById("active");
const txttconf = document.getElementById("tconfirmed");
const txttdeath = document.getElementById("tdeath");
const txttrecovered = document.getElementById("trecovered");
const txttactives = document.getElementById("tactive");

globalInfo();
//DO FETCH para o nosso global, faz a inclusão das informações globais.
function globalInfo() {
  fetch("https://api.covid19api.com/summary")
    .then((res) => res.json())
    .then((data) => {
      const globalTypes = data["Global"];
      txtconf.textContent =
        globalTypes["TotalConfirmed"].toLocaleString("pt-BR");
      txtdeath.textContent = globalTypes["TotalDeaths"].toLocaleString("pt-BR");
      txtrecovered.textContent =
        globalTypes["TotalRecovered"].toLocaleString("pt-BR");
      txtactives.textContent = (
        globalTypes["TotalConfirmed"] -
        (globalTypes["TotalDeaths"] + globalTypes["TotalRecovered"])
      ).toLocaleString("pt-BR");
    });
}
//faz a inclusão dos países no campo de seleção.
function SetCountries() {
  fetch("https://api.covid19api.com/countries")
    .then((res) => res.json())
    .then((data) => {
      selectCountries.appendChild(new Option("Global", "global"));
      for (con of data) {
        selectCountries.appendChild(new Option(con.Country, con.Slug));
      }
    });
}
SetCountries();

// recebe as informações dos países pela API do covid
function countriesInfo(select, sdate) {
  let formatDate = "?from=" + sdate[1] + "&to=" + sdate[0];
  fetch("https://api.covid19api.com/country/" + select + formatDate)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      txtconf.textContent = data[2].Confirmed.toLocaleString("pt-BR");
      txtdeath.textContent = data[2].Deaths.toLocaleString("pt-BR");
      txtrecovered.textContent = data[2].Recovered.toLocaleString("pt-BR");
      txtactives.textContent = data[2].Active.toLocaleString("pt-BR");
      txttconf.textContent = compararValorDiario(
        data[0].Confirmed,
        data[1].Confirmed,
        data[2].Confirmed
      );
      txttdeath.textContent = compararValorDiario(
        data[0].Deaths,
        data[1].Deaths,
        data[2].Deaths
      );
      txttrecovered.textContent = compararValorDiario(
        data[0].Recovered,
        data[1].Recovered,
        data[2].Recovered
      );
      txttactives.textContent = compararValorDiario(
        data[0].Active,
        data[1].Active,
        data[2].Active
      );
    });
}

// compara o valor diário de ontem e de hoje para verificar se subiu ou desceu as informações
function compararValorDiario(anteOntem, ontem, hoje) {
  let diarioOntem = ontem - anteOntem;
  let diarioHoje = hoje - ontem;
  if (diarioOntem > diarioHoje) {
    //Se o diário de ontem for maior que o diário de hoje, seta para baixo
    return "\u2B9F diario " + diarioHoje.toLocaleString("pt-BR");
  } else if (diarioOntem < diarioHoje) {
    //se o diário de ontem for menor que o diário de hoje, seta para cima
    return "\u2B9D diario " + diarioHoje.toLocaleString("pt-BR");
  } else {
    // se for igual, o balanço está igual "-"
    return "- diario " + diarioHoje.toLocaleString("pt-BR");
  }
}

//função para passar as informações dos países que foram selecionados.
function SetInfoByCountrie() {
  //console.log(selectCountries);
  let slcCountry = document.getElementById("combo").value;
  if (slcCountry == "global") {
    globalInfo();
  } else {
    countriesInfo(slcCountry, formatDate());
  }
}

// fomata a data para padrão ISO
function formatDate() {
  let allDatas = getData();
  let initialDate = allDatas[0];
  let anteOntemDate = allDatas[1];
  initialDate = initialDate.toISOString();
  anteOntemDate = anteOntemDate.toISOString();

  return [initialDate, anteOntemDate];
}

//Pega a data que foi selecionada no campo Sdate.
function getData() {
  let stringDate = document.getElementById("sdata").value;
  let initialDate = new Date(stringDate);
  let anteOntemDate = new Date(stringDate);
  anteOntemDate.setDate(anteOntemDate.getDate() - 2);
  return [initialDate, anteOntemDate];
}

//Botão
document
  .getElementById("btnSearch")
  .addEventListener("click", () => SetInfoByCountrie());
