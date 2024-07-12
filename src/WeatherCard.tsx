import React from "react";
import "./App.css";

type EvenIndexedForecast = {
  name: string;
  shortForecast: string;
  high: number | undefined;
  low: number | undefined;
  icon: string | undefined;
};

type WeatherCardProps = {
  evenIndexedForecasts: EvenIndexedForecast[];
  weatherIcon: (forecast: string) => string | undefined;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ evenIndexedForecasts, weatherIcon }) => {
  return (
    <>
      {evenIndexedForecasts.map((forecast, index) => (
        <div className="card" key={index}>
          <span>{forecast.name.split(" ")[0]}</span>
          <img src={weatherIcon(forecast.shortForecast)} alt={forecast.shortForecast}></img>
          <span className="short-forecast">{forecast.shortForecast}</span>
          <span>
            {forecast.high} / {forecast.low}
          </span>
        </div>
      ))}
    </>
  );
};

export default WeatherCard;