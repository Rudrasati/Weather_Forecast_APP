const placeTime1 = document.getElementById("placeTime");
const location1 = document.getElementById("location");
const time1 = document.getElementById("time");
const date1 = document.getElementById("Cdate");
const CWeatherInfo1 = document.getElementById("CweatherInfo");
const CTemp1 = document.getElementById("todayTemp");
const FTemp1 = document.getElementById("subForecast");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

setInterval(() => {
  const time = new Date();
  const hour = time.getHours();
  const Formathrs = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  const day = time.getDay();
  const date = time.getDate();
  const month = time.getMonth();
  time1.innerHTML =
    (Formathrs < 10 ? "0" + Formathrs : Formathrs) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  date1.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { wind_speed, humidity, pressure, sunrise, sunset } = data.current;

  placeTime1.innerHTML = data.timezone;
  location1.innerHTML = data.lat + "N " + data.lon + "E";

  CWeatherInfo1.innerHTML = `<div class="weatherInfo">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weatherInfo">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weatherInfo">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
    
        <div class="weatherInfo">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
        </div>
        <div class="weatherInfo">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
        </div>`;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      CTemp1.innerHTML = `
                <img src="http://openweathermap.org/img/wn//${
                  day.weather[0].icon
                }@4x.png" alt="weathericon" class="wicon">
                    
                    <div class="day">${window
                      .moment(day.dt * 1000)
                      .format("dddd")}</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    
                    `;
    } else {
      otherDayForcast += `
                <div class="nextDay">
                    <div class="day">${window
                      .moment(day.dt * 1000)
                      .format("ddd")}</div>
                    <img src="http://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }@2x.png" alt="weathericon" class="wicon">
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                </div>
                
                `;
    }
  });

  FTemp1.innerHTML = otherDayForcast;
}
