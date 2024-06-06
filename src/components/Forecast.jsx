import React, { useRef } from "react";
import { useState, useEffect } from "react";

const api_key = "ffcfa0d04c3dd19c74c814e2e52e7fa2";

export function Forecast({ closeModal, lat, lon }) {
  const [forecastData, setForecastData] = useState([]);
  const modalRef = useRef(null);

  const fetchForecastData = async () => {
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=Metric&appid=${api_key}`;
    const res = await fetch(url2);
    const response = await res.json();
    setForecastData(response.list.slice(0, 5));
  };

  useEffect(() => {
    fetchForecastData();
  }, [lat, lon]);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      setTimeout(() => {
        modal.classList.add("show");
      }, 380); // slight delay to trigger transition
    }
    return () => {
      if (modal) {
        modal.classList.remove("show");
      }
    };
  }, []);

  const handleClose = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.classList.remove("show");
    }
    setTimeout(() => {
      closeModal(false);
    }, 800); // Delay to allow animation to complete
  };

  return (
    <div className="modal_black">
      <div className="modal_background" ref={modalRef}>
        <div className="modal_container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
            }}
          >
            <div className="hourly-head">
              <h4>3-Hour Forecast</h4>
            </div>

            <button onClick={handleClose}>X</button>
          </div>

          <div style={{ width: "100%", marginTop: "10px" }}>
            <hr />

            <div className="hourly-app">
              {forecastData.map((data, index) => (
                <div key={index} className="hourly-app-content">
                  <p>
                    {new Date(data.dt_txt).toLocaleString("en-GB", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                  <p>{Math.floor(data.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DailyWeather({ closeModal2, lat, lon }) {
  const [dailyData, setDailyData] = useState([]);
  const modalRef = useRef(null);

  const fetchDailyData = async () => {
    const url3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const res = await fetch(url3);
    const response = await res.json();
    const dailyForecast = aggregateDailyData(response.list);
    setDailyData(dailyForecast.slice(0, 5));
  };

  const aggregateDailyData = (list) => {
    const dailyMap = new Map();

    list.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date).push(item);
    });

    const aggregatedData = [];
    dailyMap.forEach((value, key) => {
      const tempSum = value.reduce((sum, item) => sum + item.main.temp, 0);
      const tempAvg = tempSum / value.length;
      const tempMin = Math.min(...value.map((item) => item.main.temp_min));
      const tempMax = Math.max(...value.map((item) => item.main.temp_max));
      const weather = value[0].weather[0]; // Assuming the weather description for the first item
      aggregatedData.push({
        date: key,
        tempAvg,
        tempMin,
        tempMax,
        weather,
      });
    });

    return aggregatedData;
  };

  useEffect(() => {
    fetchDailyData();
  }, [lat, lon]);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      setTimeout(() => {
        modal.classList.add("show");
      }, 300);
    }

    return () => {
      if (modal) {
        if (modal) {
          modal.classList.remove("show");
        }
      }
    };
  }, []);

  const handleClose = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.classList.remove("show");
    }
    setTimeout(() => {
      closeModal2(false);
    }, 800); // Delay to allow animation to complete
  };

  return (
    <div className="modal_black">
      <div className="modal_background daily_back" ref={modalRef}>
        <div className="modal_container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
            }}
          >
            <div className="hourly-head">
              <h4>Daily Forecast</h4>
            </div>

            <button onClick={handleClose}>X</button>
          </div>
          <div style={{ width: "100%" }}>
            <hr />

            <div className="daily-app">
              {dailyData.map((data, index) => (
                <div key={index} className="daily-app-content">
                  <p style={{ textAlign: "center" }}>{data.date}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
                    alt="weather icon"
                  />
                  <p style={{ textAlign: "center" }}>
                    {Math.round(data.tempAvg)}°
                  </p>
                  <p>
                    Min: {Math.round(data.tempMin)}° |&nbsp; Max:{" "}
                    {Math.round(data.tempMax)}°
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
