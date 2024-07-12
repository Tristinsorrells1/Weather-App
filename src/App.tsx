import "./App.css";
import moment from "moment";
import WeatherContainer from "./WeatherContainer";
import { useEffect, useState } from "react";
import { getHighsAndLows, getWeatherForecast, getLatAndLong, ForecastType, CoordinatesType, AddressType, TemperatureType } from "./APICalls/APICalls";

function App() {
  const [coordinates, setCoordinates] = useState<CoordinatesType | undefined>(undefined);
  const [address, setAddress] = useState<AddressType | undefined>(undefined);
  const [temps, setTemps] = useState<TemperatureType | undefined>(undefined);
  const [forecast, setForecast] = useState<ForecastType["forecast"] | undefined>(undefined);
  const [forecastTime, setForecastTime] = useState<ForecastType["date"] | undefined>(undefined);
  const [highs, setHighs] = useState<number[] | undefined>(undefined);
  const [lows, setLows] = useState<number[] | undefined>(undefined);
  const [street, setStreet] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (forecast && temps) {
      convertTemps();
    }
  }, );

  const weatherIcon = (forecast: string): string | undefined => {
    if (forecast.includes("Sunny") || forecast.includes("Clear")) {
      return "/sun.png";
    } else if (forecast.includes("Rain") || forecast.includes("Showers")) {
      return "/rain.png";
    } else if (forecast.includes("Cloudy")) {
      return "/cloudy.png";
    } else {
      return undefined;
    }
  };

  const convertTemps = (): void => {
    if (forecast && temps) {
      const idealUnit = forecast[0].temperatureUnit;
      const currentUnit = temps.max.uom[temps.max.uom.length - 1];

      if (idealUnit !== currentUnit) {
        const convertToIdealUnit = (value: number): number => {
          if (idealUnit === "F" && currentUnit === "C") {
            return Math.round(value * (9 / 5) + 32);
          } else if (idealUnit === "C" && currentUnit === "F") {
            return Math.round((value - 32) * (5 / 9));
          }
          return Math.round(value);
        };

        const convertedHighTemps = temps.max.values.map((item) => convertToIdealUnit(item.value));
        const convertedLowTemps = temps.min.values.map((item) => convertToIdealUnit(item.value));

        setHighs(convertedHighTemps);
        setLows(convertedLowTemps);
      }
    }
  };

  const checkInputs = (): void => {
    document.getElementById("street")?.classList.remove("error");
    document.getElementById("city")?.classList.remove("error");
    document.getElementById("state")?.classList.remove("error");

    if (!street) {
      document.getElementById("street")?.classList.add("error");
    }
    if (!city) {
      document.getElementById("city")?.classList.add("error");
    }
    if (!state) {
      document.getElementById("state")?.classList.add("error");
    }

    if (!state || !city || !street) {
      return;
    }

    getLatAndLong(street, city, state).then((res) => {
      if (res) {
        setAddress({
          city: res.address.city.charAt(0).toUpperCase() + res.address.city.slice(1).toLowerCase(),
          state: res.address.state,
        });
        setCoordinates({
          x: res.coordinates.x,
          y: res.coordinates.y,
        });
        setError(false);
      } else {
        setError(true);
      }
    });
  };

  useEffect(() => {
    if (coordinates && coordinates.x && coordinates.y) {
      getHighsAndLows(coordinates.x, coordinates.y).then((res) => {
        if (res) {
          setTemps(res);
        }
      });
      getWeatherForecast(coordinates.x, coordinates.y).then((res) => {
        if (res) {
          let date = moment(res.date);
          let formattedDate = date.format("MMMM Do [at] h:mma");
          setForecastTime(formattedDate);
          setForecast(res.forecast);
        }
      });
    }
  }, [coordinates]);

  return (
    <main style={{ backgroundImage: `url(/clouds.png)`, backgroundSize: "cover" }}>
      <section className={forecast ? "search-bar-section" : "centered-search-bar-section"}>
        <div className="search-bar">
          <input
            id="street"
            placeholder="Street"
            value={street}
            onChange={(event) => {
              setStreet(event.target.value);
            }}
          ></input>
          <input
            id="city"
            placeholder="City"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
            }}
          ></input>
          <input
            id="state"
            placeholder="State"
            value={state}
            onChange={(event) => {
              setState(event.target.value);
            }}
          ></input>
          <img className="search-icon" src="./search.png" alt="search icon" onClick={() => checkInputs()}></img>
        </div>
      </section>
      {error && (
        <div className="spacer">
          <span>Please enter a valid street, city, and state. </span>
        </div>
      )}
      {forecast && !error && (
        <section className="todays-weather-section">
          <div className="weather-container">
            {address && <span className="location">{`${address.city}, ${address.state}`}</span>}
            <div>
              <img className="big-icon" src={weatherIcon(forecast[0].shortForecast)} alt={forecast[0].shortForecast}></img>
              <span className="temperature">{forecast[0].temperature}</span>
              <span className="temp-unit">{forecast[0].temperatureUnit}</span>
            </div>
            <p className="detailed-forecast">{forecast[0].shortForecast}</p>
            <div>
              <div>
                <img className="small-icon" src="high.png" alt="high temperature icon"></img>
                {highs && <span>{highs[0]}</span>}
              </div>
              <div>
                <img className="small-icon" src="low.png" alt="low temperature icon"></img>
                {lows && <span>{lows[0]}</span>}
              </div>
              <div>
                <img className="small-icon" src="wind.png" alt="wind icon"></img>
                <span>{`${forecast[0].windSpeed} ${forecast[0].windDirection}`}</span>
              </div>
            </div>
            {forecastTime && <p className="updated-time-text">Updated as of {forecastTime}</p>}
          </div>
        </section>
      )}
      <section className="weekly-weather-section">{forecast && !error && <WeatherContainer highs={highs} lows={lows} forecast={forecast} weatherIcon={weatherIcon} />}</section>
    </main>
  );
}

export default App;
