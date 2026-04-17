const apiKey = "2c5883ebc88fbb7b1da61af6fc3b562b";

const form = document.getElementById("form");
const loader = document.getElementById("loader");
const error = document.getElementById("error");
const weatherBox = document.getElementById("weatherBox");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    let city = document.getElementById("city").value;

    loader.classList.remove("hidden");
    error.innerHTML = "";
    weatherBox.classList.add("hidden");

    try {
        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error("City not found");

        let data = await res.json();

        updateUI(data);
        loader.classList.add("hidden");

    } catch (err) {
        loader.classList.add("hidden");
        error.innerHTML = err.message;
    }
});

function updateUI(data) {

    // 🌙 Day/Night logic
    let currentTime = data.dt;
    let sunrise = data.sys.sunrise;
    let sunset = data.sys.sunset;

    if (currentTime >= sunrise && currentTime <= sunset) {
        document.body.classList.remove("night");
        document.body.classList.add("day");
    } else {
        document.body.classList.remove("day");
        document.body.classList.add("night");
    }

    // ===== DATA =====
    document.getElementById("cityName").innerHTML = data.name;
    document.getElementById("temp").innerHTML = data.main.temp + "°C";
    let temp = data.main.temp;

    if (temp > 35) {
        document.querySelector(".left").style.background =
            "linear-gradient(135deg, #ff512f, #dd2476)";
    }
    else if (temp < 15) {
        document.querySelector(".left").style.background =
            "linear-gradient(135deg, #00c6ff, #0072ff)";
    }
    else {
        document.querySelector(".left").style.background =
            "linear-gradient(135deg, #36d1dc, #5b86e5)";
    } 


    document.getElementById("desc").innerHTML = data.weather[0].description;

    document.getElementById("hum").innerHTML = data.main.humidity + "%";
    document.getElementById("wind").innerHTML = data.wind.speed + " m/s";
    document.getElementById("feels").innerHTML = data.main.feels_like + "°C";
    document.getElementById("pressure").innerHTML = data.main.pressure + " hPa";

    // ===== ICON =====
    let icon = data.weather[0].icon;
    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${icon}@4x.png`;

    weatherBox.classList.remove("hidden");

    // ===== EFFECTS CONTROL =====
    const effects = document.getElementById("effects");
    effects.className = "";

    let condition = data.weather[0].main.toLowerCase();

    if (condition.includes("thunderstorm")) {
        effects.classList.add("rain", "lightning");
    }
    else if (condition.includes("rain") || condition.includes("drizzle")) {
        effects.classList.add("rain");
    }
    else if (condition.includes("cloud")) {
        effects.classList.add("clouds");
    }
    else if (
        condition.includes("haze") ||
        condition.includes("mist") ||
        condition.includes("fog")
    ) {
        effects.classList.add("fog");
    }
    else if (condition.includes("clear")) {
        effects.classList.add("sunny");
    }

     getForecast(data.name);

}

async function getForecast(city) {

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    try {
        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        let data = await res.json();

        // take first 8 items (~24 hours)
        data.list.slice(0, 8).forEach(item => {

            let dateObj = new Date(item.dt_txt);
            let day = String(dateObj.getDate()).padStart(2, '0');
            let month = String(dateObj.getMonth() + 1).padStart(2, '0');
            let year = dateObj.getFullYear();
            
            let hours = String(dateObj.getHours()).padStart(2, '0');

            let formattedDate = `${day}/${month}/${year}`;
            let temp = Math.round(item.main.temp);
            let icon = item.weather[0].icon;

            let card = `
                <div class="forecast-card">
                    <p>${formattedDate}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png">
                    <p>${temp}°C</p>
                </div>
            `;

            forecastDiv.innerHTML += card;
        });

    } catch (err) {
        console.log("Forecast error");
    }
}

    const slider = document.getElementById("forecast");

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => isDown = false);
    slider.addEventListener("mouseup", () => isDown = false);

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;

        slider.scrollLeft = scrollLeft - walk;
    });