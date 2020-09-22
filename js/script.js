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
if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition((pos) => {
        getAddress(pos);
    }, (err) => {
        console.error(err);
    });
}

function getAddress(pos) {
    console.log(pos)
}

