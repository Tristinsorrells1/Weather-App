import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ForecastType } from "./APICalls/APICalls";

import { useEffect, useState } from "react";

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
          <span>{forecast.name}</span>
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