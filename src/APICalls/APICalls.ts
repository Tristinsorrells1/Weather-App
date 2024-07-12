export type AddressType = {
  city: string;
  state: string;
};

export type CoordinatesType = {
  x: number;
  y: number;
};

export type LocationType = {
  address: AddressType;
  coordinates: CoordinatesType;
};

export type TemperatureType = {
  max: {
    values: { validTime: string; value: number }[]; 
    uom: string; 
  };
  min: {
    values: { validTime: string; value: number }[]; 
    uom: string; 
  };
};

export type TemperaturesType = {
  dailyForecast: TemperatureType;
};

export type WeeklyForecastType = [{
  name: string;
  windDirection: string;
  windSpeed: string;
  icon: string;
  shortForecast: string;
  temperature: string;
  temperatureUnit: string;
  detailedForecast: string;
}]

export type ForecastType = {
  date: string;
  forecast: WeeklyForecastType;
};


export const getLatAndLong = async (street: string, city: string, state: string): Promise<{ address: AddressType; coordinates: CoordinatesType } | undefined> => {
  let encodedStreet = encodeURIComponent(street);
  let encodedCity = encodeURIComponent(city);
  let encodedState = encodeURIComponent(state);
  let address = `https://geocoding.geo.census.gov/geocoder/locations/address?street=${encodedStreet}&city=${encodedCity}&state=${encodedState}&benchmark=Public_AR_Current&format=json`;
  let path = `https://cors-anywhere.herokuapp.com/${address}`;
  try {
    let response = await fetch(path);
    let json = await response.json();
    let addressComponents = json.result.addressMatches[0].addressComponents;
    let coordinates = json.result.addressMatches[0].coordinates;
    return { address: addressComponents, coordinates };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getHighsAndLows = async (x: number, y: number): Promise<TemperatureType | undefined> => {
  try {
    const gridDataResponse = await fetch(`https://api.weather.gov/points/${y},${x}`);
    const gridData = await gridDataResponse.json();

    const forecastGridDataUrl = gridData.properties.forecastGridData;

    const forecastDataResponse = await fetch(forecastGridDataUrl);
    const forecastData = await forecastDataResponse.json();

    const minTemperatureValues = forecastData.properties.minTemperature.values.map((value: any) => ({
      validTime: value.validTime,
      value: value.value,
    }));
    const maxTemperatureValues = forecastData.properties.maxTemperature.values.map((value: any) => ({
      validTime: value.validTime,
      value: value.value,
    }));

   
    const temperatures: TemperatureType = 
      {
        max: {
          values: maxTemperatureValues,
          uom: forecastData.properties.maxTemperature.uom,
        },
        min: {
          values: minTemperatureValues,
          uom: forecastData.properties.minTemperature.uom,
        },
      }
    

    return temperatures;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getWeatherForecast = async (x: number, y: number): Promise<ForecastType | undefined> => {
  return fetch(`https://api.weather.gov/points/${y},${x}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response.properties.forecast;
    })
    .then((response) => {
      return fetch(`${response}`);
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return { date: response.properties.generatedAt, forecast: response.properties.periods };
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};
