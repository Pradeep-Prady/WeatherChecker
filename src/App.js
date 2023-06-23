import moment from "moment";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from "react-icons/wi";

 

function App() {
  const [state, setState] = useState({});

  const timeStampToDateTime = (timeStamp) => {
    return {
      format: (value) => {
        return moment(new Date(timeStamp * 1000)).format(value);
      },
    };
  };

  const getType = (value) => {
    if (value.includes("clouds")) return "clouds";
    if (value.includes("rain")) return "rain";
    if (value.includes("snow")) return "snow";
    if (value.includes("fog")) return "fog";
    return "sun";
  };

  const getWeatherReport = useCallback(() => {
    if (window.navigator?.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        fetch(
          `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((response) => {
            response.json().then((res) => {
              console.log(res, "res");
              setState({
                city: res.name,
                temp: res.main.temp,
                humidity: res.main.humidity,
                windSpeed: res.wind.speed.toFixed(0),
                sunRise: timeStampToDateTime(res.sys.sunrise).format("h;mm a"),
                sunSet: timeStampToDateTime(res.sys.sunset).format("h;mm a"),
                error: false,
                description: res.weather[0].description,
                icon: res.weather[0].icon,
                type: getType(res.weather[0].main.toLowerCase()),
              });
            });
          })
          .catch((error) => {
            setState({ error: true });
          });
      });
    }
  }, []);
  useEffect(() => {
    getWeatherReport();
  }, [getWeatherReport]);

  if (_.isEmpty(state)) {
    return <i className="fa-solid fa-spinner fa-spin" />;
  }

  if (state.error) {
    return (
      <div className="App">
        <h1>Error</h1>
        <button type="button" onClick={getWeatherReport}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={ `${state.type} App `  } >
      <div className="container-app">
        <h2>Weather Report</h2>
        <div className="icon-weather">
          {state.type === "sun" && <i class="fa-solid fa-sun"></i>}
          {state.type === "snow" && <i class="fa-solid fa-snowflake"></i>}
          {state.type === "fog" && <i class="fa-solid fa-fog"></i>}
          {state.type === "clouds" && <i class="fa-solid fa-cloud"></i>}
          {state.type === "rain" && <i class="fa-solid fa-cloud-rain"></i>}
        </div>
        <div className="date">{moment().format("dddd, Do MMMM")}</div>
        <div className="city text-center">
          <p>
            {" "}
            <i class="fa-solid fa-location-dot" />
            {state.city}
          </p>
        </div>

        <div className="temp">
          {state.type && (
            <p>
              <i class="fa-solid fa-temperature-three-quarters"></i>
              {`${Math.round(state.temp)}\u00B0`}{" "}
            </p>
          )}
        </div>

        <div>{moment().format("dddd")}</div>

        <hr className="line" />

        <div className="sec text-center">
          <div className="top-1">
            <p className="sunrise">
              <WiSunrise className="icon" />
              {state.sunRise}
            </p>
            <p className="sunset">
              <WiSunset className="icon" />
              {state.sunSet}
            </p>
          </div>
          <div className="top-2">
            <p className="humidity">
              <WiHumidity className="icon" />
              {state.humidity}
            </p>
            <p className="windSpeed">
              <WiStrongWind className="icon" />
              {state.windSpeed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
