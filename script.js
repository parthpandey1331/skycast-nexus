const apiKey = "2c5883ebc88fbb7b1da61af6fc3b562b";

const form = document.getElementById("form");

let lastCity = localStorage.getItem("city");

if (lastCity) {
    document.getElementById("city").value = lastCity;
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    let city = document.getElementById("city").value;
    let error = document.getElementById("error");
    let weatherBox = document.getElementById("weatherBox");

    error.innerHTML ="Loading...";
    weatherBox.classList.add("hidden");



    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        if (!res.ok) {
            let errData = await res.json();
            throw new Error(errData.message);
        }

        let data = await res.json();
        error.innerHTML = "";

        document.getElementById("cityName").innerHTML = data.name;
        document.getElementById("temp").innerHTML = data.main.temp  + "°C";
        document.getElementById("desc").innerHTML = data.weather[0].description;
        document.getElementById("hum").innerHTML = data.main.humidity + "%";
        document.getElementById("wind").innerHTML = data.wind.speed + " m/s";
        document.getElementById("feels").innerHTML = data.main.feels_like + "°C";
        document.getElementById("pressure").innerHTML = data.main.pressure + " hPa";
        
        let icon = data.weather[0].icon;
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        weatherBox.classList.remove("hidden");

        localStorage.setItem("city", city);

        let condition = data.weather[0].main.toLowerCase();

        if (condition.includes("rain")) {
    document.body.style.background = "linear-gradient(135deg,#4e54c8,#8f94fb)";
        } 
        else if (condition.includes("clear")) {
                document.body.style.background = "linear-gradient(135deg,#f7971e,#ffd200)";
        }   
        else if (condition.includes("cloud")) {
                document.body.style.background = "linear-gradient(135deg,#757f9a,#d7dde8)";
        }
        else {
            document.body.style.background = "linear-gradient(135deg,#4facfe,#00f2fe)";
        }
        
        

    } catch (err) {
        error.innerHTML = err.message;
    }
});


if (lastCity) {
    form.dispatchEvent(new Event("submit"));
}