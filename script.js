// Page Elements
const temprature = document.querySelector(".temperature-one");
const dateEl = document.querySelector(".date");
const countryCity = document.querySelector(".country-and-city");
const dayOfWeek = document.querySelector(".day-of-week");
const description = document.querySelector(".description");

// Boxes Elements
const h12 = document.querySelector(".h12");
const h2 = document.querySelector(".h2");
const h4 = document.querySelector(".h4");
const h6 = document.querySelector(".h6");
const h8 = document.querySelector(".h8");
const h10 = document.querySelector(".h10");
const h12a = document.querySelector(".h12a");
const h2a = document.querySelector(".h2a");
const h4a = document.querySelector(".h4a");

// Buttons
const tomorrow = document.querySelector(".tomorrow");
const today = document.querySelector(".today");
const yesterday = document.querySelector(".yesterday");
const buttons = document.querySelectorAll(".tomorrow, .today, .yesterday");

// Global variables for latitude and longitude
let lat, lon;

// Function To Render Temperature by Hours
function renderDay(index, data) {
    const hours = data.forecast.forecastday[index].hour;

    h12a.textContent = hours[0].temp_c + "°C"; // 12am
    h2a.textContent = hours[2].temp_c + "°C"; // 2am
    h4a.textContent = hours[4].temp_c + "°C"; // 4am
    h12.textContent = hours[12].temp_c + "°C"; // 12pm
    h2.textContent = hours[14].temp_c + "°C"; // 2pm
    h4.textContent = hours[16].temp_c + "°C"; // 4pm
    h6.textContent = hours[18].temp_c + "°C"; // 6pm
    h8.textContent = hours[20].temp_c + "°C"; // 8pm
    h10.textContent = hours[22].temp_c + "°C"; // 10pm
}

// Get User Location
navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=db4efef2013e4d28a1201955251708&q=${lat},${lon}&days=3`;

    // Fetch Forecast API
    fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
            // Current Temperature
            temprature.textContent = `${data.current.temp_c} °C`;

            // Date
            const rawDate = data.current.last_updated;
            const dateObj = new Date(rawDate);
            const dateOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            dateEl.textContent = dateObj.toLocaleDateString(
                "en-US",
                dateOptions
            );

            // Country + City
            countryCity.textContent = `${data.location.name}, ${data.location.country}`;

            // Day of the Week
            const dayOptions = { weekday: "long" };
            dayOfWeek.textContent = dateObj.toLocaleDateString(
                "en-US",
                dayOptions
            );

            // Description
            description.textContent = data.current.condition.text;

            // Button Events
            buttons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    buttons.forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");

                    if (today.classList.contains("active")) {
                        renderDay(0, data);
                    } else if (tomorrow.classList.contains("active")) {
                        renderDay(1, data);
                    }
                });
            });

            // Auto select Today
            today.classList.add("active");
            renderDay(0, data);
        })
        .catch((error) => {
            console.error("OOPS! There Are An Error", error);
        });

    // Yesterday Button Event
    yesterday.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        yesterday.classList.add("active");

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const formattedDate = yesterdayDate.toISOString().split("T")[0];

        const HISTORY_URL = `https://api.weatherapi.com/v1/history.json?key=db4efef2013e4d28a1201955251708&q=${lat},${lon}&dt=${formattedDate}`;

        fetch(HISTORY_URL)
            .then((res) => res.json())
            .then((data) => {
                renderDay(0, data);
            })
            .catch((err) => console.error("OOPS! There Are An Error", err));
    });
});
