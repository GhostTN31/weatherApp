import React from "react";
import { useState, useEffect } from "react";
import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import loader from "../assets/images/loading.gif";
import { Forecast, DailyWeather } from "./Forecast.jsx";

const WeatherApp = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [load, setLoad] = useState(false);
  const api_key = "ffcfa0d04c3dd19c74c814e2e52e7fa2";

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoad(true);
      const defaultLocation = "New Delhi";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
      setLoad(false);
    };
    fetchDefaultWeather();
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoad(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${api_key}`;
    const res = await fetch(url);
    const locationData = await res.json();
    setData(locationData);
    setLoad(false);
  };

  const handleInput = (e) => {
    setLocation(e.target.value);
  };

  const search = async () => {
    if (location !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const searchData = await res.json();
      console.log(searchData);
      if (searchData.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(searchData);
        setLocation("");
      }
      setLoad(false);
      setModal(false);
      setModal2(false);
    }
  };

  const keyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const handleDefaultLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching geolocation: ", error);
          fetchDefaultWeather(); // Fallback to default location
        }
      );
    } else {
      fetchDefaultWeather(); // Fallback to default location if geolocation is not supported
    }
  };

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
    Drizzle: rainy,
    Thunderstorm: rainy,
    Dust: cloudy
  };

  const weatherImg = data.weather ? weatherImages[data.weather[0].main] : null;

  const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d6d4, #71eeec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #c8c2c6, #e7e3e3)",
    Mist: "linear-gradient(to right, #c8c2c6, #e7e3e3)",
    Drizzle: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Dust: "linear-gradient(to right, #57d6d4, #71eeec)",
    Thunderstorm: "linear-gradient(to right, #5bc8fb, #80eaff)" 
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : "linear-gradient(to right, #f3b07c, #fcd283)";

  {
    /*Date Format*/
  }
  const currentDate = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const dayOfWeek = days[currentDate.getDay()];
  const currentMonth = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();

  const formatDate = `${dayOfWeek}, ${dayOfMonth} ${currentMonth}`;

  return (
    <div className="main-container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{
          backgroundImage:
            backgroundImage && backgroundImage.replace
              ? backgroundImage.replace("to right", "to top")
              : null,
        }}
      >
        {/* Search part starts */}
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data.name}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInput}
              onKeyDown={keyPress}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
            <i
              className="fa-solid fa-location def_loc"
              onClick={handleDefaultLocationClick}
            ></i>
          </div>
        </div>

        <div
          className="hour_daily"
          style={{ display: data.notFound ? "none" : "flex" }}
        >
          <h4
            style={{ cursor: "pointer", zIndex: "10" }}
            onClick={() => {
              setModal(true);
              setModal2(false);
            }}
          >
            Hourly
          </h4>
          <h4
            style={{ cursor: "pointer", zIndex: "10" }}
            onClick={() => {
              setModal2(true);
              setModal(false);
            }}
          >
            Daily
          </h4>
        </div>

        {/* Search part ends */}

        {/*error handle part*/}
        {load ? (
          <img className="loader" src={loader} alt="loading" />
        ) : data.notFound ? (
          <div className="not-found">Not Found 🙄</div>
        ) : (
          <>
            {/* weather type starts */}
            <div className="weather">
              <img src={weatherImg} alt="No Image" />
              <div className="weather-type">
                {data.weather ? data.weather[0].main : null}
              </div>
              <div className="weather-desc">
                {data.weather ? data.weather[0].description : null}
              </div>
              <div className="temp">
                {data.main ? `${Math.floor(data.main.temp)}°` : null}
              </div>
            </div>
            {/* weather type ends */}

            {/* weather date starts */}
            <div className="weather-date">
              <p>{formatDate}</p>
            </div>
            {/* weather date ends */}

            {/* weather datas starts */}
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">
                  {data.main ? data.main.humidity : null}%
                </div>
              </div>

              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">
                  {data.wind ? data.wind.speed : null}km/hr
                </div>
              </div>
            </div>
            {/* weather datas ends */}
          </>
        )}
        {/*error handle part ends*/}
      </div>
      {modal && (
        <Forecast
          closeModal={setModal}
          lat={data.coord.lat}
          lon={data.coord.lon}
        />
      )}
      {modal2 && (
        <DailyWeather
          closeModal2={setModal2}
          lat={data.coord.lat}
          lon={data.coord.lon}
        />
      )}
    </div>
  );
};

export default WeatherApp;
