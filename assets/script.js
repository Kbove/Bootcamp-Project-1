




function getCurrent() {
  var currentURL = 'https://covid19.mathdro.id/api/'
  fetch(currentURL)
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {
       console.log(data.confirmed.value);
       var casesConfirmed = data.confirmed.value;
       $("#total-case-current").text(casesConfirmed) 
        }
     )
    }
getCurrent();
function displayDate(){
var now = moment().format("MM-DD-YYYY");
console.log(now)
$("#current-date").text(now);
}
displayDate();

// =======================================
let chartCanvas = document.getElementById('vaccChartCanvas').getContext('2d');
let chartOptions = {
  responsive: true,
  interaction: {
      mode: 'index',
      intersect: false,
  },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Covid Vaccine Data History',
        fontsize: 25
      },
    },
  scales: {
      y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            text:  'Daily Vaccine Count',
            display: true,
            // font:
            // color:
            // padding:
          }
        },
      y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            text:  'Total Vaccine Count',
            display: true,
            font: 'monospace',
            // color:
            // padding:
          },
          grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
      }
  },
  tooltips: {
    enabled:true
  }
};

let data1 = []
let data2 = []
let chartLabels = []
let userInputDays = 7
let vaccChart


function getVaccApi(countryName, lastDays) {
    // fetch request gets a list of all the repos for the node.js organization
    let vaccAPIUrl = 'https://disease.sh/v3/covid-19/vaccine/coverage/countries/'+ countryName +'?lastdays='+ lastDays +'&fullData=true';

//function to retrieve and display vaccine data
//will change display from none to flex once called the first time.
function getVaccApi(countryName, lastDays = 30) {
  if($('#vaccSection').css('display') !== "flex") {
    $('#vaccSection').css('display','flex');  
  }
  let vaccAPIUrl = 'https://disease.sh/v3/covid-19/vaccine/coverage/countries/'+ countryName +'?lastdays='+ lastDays +'&fullData=true';

  
    fetch(vaccAPIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        data1 = []
        data2 = []
        chartLabels = []
        for (i = 0; i < data.timeline.length; i++) {
            //console.log(data.timeline[i])
            data1.push(data.timeline[i].daily);
            data2.push(data.timeline[i].total);
            chartLabels.push(data.timeline[i].date);
        }
        let charData = {
          datasets:[
          {
            type: 'line',
            label: 'Total Vacc',
            data: data2,
            yAxisID: 'y1',
            borderColor: 'orange',
          },{
            type: 'bar',
            label: 'Daily Vacc',
            data: data1,
            yAxisID: 'y',
            backgroundColor:'lightblue',
            boederWidth:1,
            hoverBorderColor: '#000',
          }
      ],
          labels: chartLabels,
      };
        vaccChart = new Chart(chartCanvas, {
          data: charData,
          options: chartOptions
      });
    });
  }

// mock api call to show data before search button
// should be replaced by search event triger
getVaccApi('USA', 30);
$('#dateRange').change((e)=>{
  if (vaccChart) {
    vaccChart.destroy()
  }
  console.log(e.target.value)
  getVaccApi('USA', e.target.value);
  
})

$( "#dateRange" ).on( "input", function(e) {
  $('#rangeVal').text(e.target.value);
});






  getVaccApi('USA', 7);


// ====================================================
let dataOfAllCountries = null;
let defaultCountries = ["US"];
let countries = [];

  function render(){
  let innerHTML = "";
  // render countries
  const dataOfAllCountriesKeys = Object.keys(dataOfAllCountries);

  let countriesDatas = countries.map((country) => {
    const countryKey = dataOfAllCountriesKeys.find((key) => {
      return key.toLowerCase() === country.toLowerCase();
    });
    if (countryKey) {
      return dataOfAllCountries[countryKey];
    }
    return null;
  });
  countriesDatas.filter((item) => {
    return item !== null;
  });
  countriesDatas = countriesDatas.map((item) => {
    return item.All;
  });

  countriesDatas.forEach((item) => {
    innerHTML += `
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">${item.country}</h5>
          <p class="card-text">Population: ${item.population}</p>
          <p class="card-text">Confirmed: ${item.confirmed}</p>
          <p class="card-text">Deaths: ${item.deaths}</p>
          <p class="card-text">Mortality Rate: ${(
            item.deaths / item.confirmed
          ).toFixed(2)}%</p>
        </div>
      </div>`;
  });
  document.getElementById("cards").innerHTML = innerHTML;

} 
function setUp(country = "US") {
  countries = defaultCountries;
  fetch(`https://covid-api.mmediagroup.fr/v1/cases`)
    .then((res) => res.json())
    .then((data) => {
      dataOfAllCountries = data;
      render();
    });
}

function handleClickSearch() {
const countryInput = document.getElementById("country-input");
const country = countryInput.value;
if (!country.trim()) countries = defaultCountries;
else countries = [country.trim()];
render();
}

setUp();
document
.getElementById("search-btn")
.addEventListener("click", handleClickSearch);



