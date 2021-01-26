
// CLOCK
(function() { 
const hr = document.getElementById("hr");
const mn = document.getElementById("mn");
const sc = document.getElementById("sc");

const initialTransformStyle = "translate(-50%, -50%) ";
const deg = 6;

setInterval(() => {
    const curHr = new Date().getHours() * 30;
    const curMn = new Date().getMinutes() * deg;
    const curSc = new Date().getSeconds() * deg;

    hr.style.transform = initialTransformStyle + `rotate(${curHr + (curMn/12)}deg)`;
    mn.style.transform = initialTransformStyle + `rotate(${curMn}deg)`;
    sc.style.transform = initialTransformStyle + `rotate(${curSc}deg)`;
})
})();


// LOCATION
function initialize() {
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition((pos) => {
            getAddress(pos);
        }, (err) => {
            console.error(err);
        });
    }
}

function getAddress(pos) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    console.log(pos.coords);
    geocoder.geocode({ location: latlng }, (results, status) => {
        console.log("Results", results);
        if ( status === "OK" ) {
            const addressComponent = results[0].address_components;
            let city, state, country;
            addressComponent.forEach(component => {
                if (component.types[0] === "locality") {
                    city = component.long_name;
                }
                if (component.types[0] === "administrative_area_level_1") {
                    state = component.long_name;
                }
                if (component.types[0] === "country") {
                    country = component.long_name;
                }
            });
            const address = `${city}, ${state}, ${country}`;
            displayLocation(address);
            setTimeout(getWeatherData, 1000, pos);
            // getWeatherData(pos);
        }
    })
}

function displayLocation(location) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const today  = new Date();
    const date = today.toLocaleDateString("en-US", options);
    const markup = 
    `<i class="fas fa-map-marker-alt"></i>
    <div class="location">${location}</div>
    <div class="time">${date}</div>`;
    const el = document.getElementById("loc-info");
    el.insertAdjacentHTML("afterbegin", markup);
}

function getWeatherData(pos) {
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "3caf3ca397mshaab5dfba31e33b6p15c42ajsn25d474264011"
        }
    })
    .then(res => {
        return res.json();
    })
    .then((response) => {
        console.log("Response", response);
        const markup = `
            <div class="row-1">
                <img class="temp-icon" id="temperature-icon">
                <div id="temperature"></div>
            </div>
            <div class="row-2">

                <div class="info" id="humidity">
                    <i class="fas fa-tint"></i>
                    <div class="heading">Humidity : </div>
                    <div class="text"></div>
                </div>

                <div class="info" id="pressure">
                    <i class="fas fa-tachometer-alt"></i>
                    <div class="heading">Pressure : </div>
                    <div class="text"></div>
                </div>

                <div class="info" id="wind">
                    <i class="fas fa-wind"></i>
                    <div class="heading">Wind : </div>
                    <div class="text"></div>
                </div>
                <div class="info" id="visibility">
                    <i class="fas fa-eye"></i>
                    <div class="heading">Visibility : </div>
                    <div class="text"></div>
                </div>
            </div>
        `
        const current_temp_wrapper = document.querySelector(".current-temp-wrapper");
        current_temp_wrapper.innerHTML = markup;
        displayTemp(response);
    })
    .catch(err => {
        console.log(err);
    });
}

function displayTemp(response) {
    const IMAGE_BASE = "http://openweathermap.org/img/wn/";
    const img = document.getElementById("temperature-icon");
    img.setAttribute("src", IMAGE_BASE + response.weather[0].icon + "@2x.png");
    const temperature = Math.round(response.main.temp - 273.15) + "&#176" + "C";
    const humidity = response.main.humidity + "%";
    const pressure = response.main.pressure + " hpa";
    const wind = Math.floor(response.wind.speed)+ " m/s";
    const visibility = formatUnit(response.visibility) + " metres";

    const temperature_el = document.getElementById("temperature");
    const humidity_el = document.querySelector("#humidity .text");
    const pressure_el = document.querySelector("#pressure .text");
    const wind_el = document.querySelector("#wind .text");
    const visibility_el = document.querySelector("#visibility .text");

    temperature_el.innerHTML = temperature;
    humidity_el.innerText = humidity;
    pressure_el.innerText = pressure;
    wind_el.innerText = wind;
    visibility_el.innerText = visibility;
}

function formatUnit(str) {
    str = str+"";
    if (str.length <= 3) {
        return str;
    } else {
        const st = str.length - 3;
        return str.substring(0, st) + "," + str.substring(st);
    }
}


// Digital Clock
const clockEl = document.getElementById("clock");
const digiEl = document.getElementById("digital");
digiEl.innerText = new Date().toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' })
clockEl.addEventListener("mouseenter", showDigitalClock);
clockEl.addEventListener("mouseleave", hideDigitalClock);

function showDigitalClock() {
    digiEl.style.cursor = "pointer";
    digiEl.style.transform = "perspective(500px) translateZ(0) translate(-50%, -50%) scale(1)"
}

function hideDigitalClock(e) {
    digiEl.style.cursor = "auto";
    digiEl.style.transform = "perspective(500px) translateZ(0) translate(-50%, -50%) scale(0)";
}
