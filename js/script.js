
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
        if ( status === "OK" ) {
            displayLocation(results[results.length-2].formatted_address);
            getLocation(pos, results[results.length-2].formatted_address);
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

function getLocation(pos, address) {
    const a = address.split(",");
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&q=${a[0]}`, {
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
        displayTemp(response);
    })
    .catch(err => {
        console.log(err);
    });
}

function displayTemp(response) {
    const tempEl = document.getElementById("temperature");
    const tempDes = document.getElementById("desc");
    const markup = `<span style="font-family: sans-serif;">${Math.round(response.main.temp - 273.15)}&deg;</span>C`;
    tempEl.innerHTML =  markup;
    tempDes.innerText = response.weather[0].description;
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
