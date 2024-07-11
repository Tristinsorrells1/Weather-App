import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {  ForecastType } from "./APICalls/APICalls";
import WeatherCard  from "./WeatherCard"

import { useEffect, useState } from "react";

type WeatherContainerProps = {
  forecast: ForecastType["forecast"];
  highs: number[] | undefined;
  lows: number[] | undefined;
  weatherIcon: (forecast: string) => string | undefined;
};

type EvenIndexedForecast = {
  name: string;
  shortForecast: string;
  high: number | undefined;
  low: number | undefined;
  icon: string | undefined;
};

const WeatherContainer: React.FC<WeatherContainerProps> = ({ forecast, highs, lows, weatherIcon }) => {
  const evenIndexedForecasts: EvenIndexedForecast[] = forecast
    .filter((_, index) => index % 2 === 0)
    .map((item, index) => ({
      name: item.name,
      shortForecast: item.shortForecast,
      high: highs ? highs[index] : undefined,
      low: lows ? lows[index] : undefined,
      icon: weatherIcon(item.shortForecast),
    }));

  return <WeatherCard evenIndexedForecasts={evenIndexedForecasts} weatherIcon={weatherIcon} />;
};

export default WeatherContainer;