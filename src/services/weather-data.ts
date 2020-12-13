import { WeatherResponse } from "../interfaces/weather";
import { SettingsData } from "./settings-data";
import { convertFromKelvin } from "../helpers/utils";

class WeatherDataController {
    public data: WeatherResponse;
    private apiKey: string = "";

    constructor() { }

    async load() {
        if (this.data) {
            return this.data;
        } else {
            return await this.refreshWeather();
        }
    }

    async refreshWeather() {
        let [location, unit] = await Promise.all([
            SettingsData.getLocation(),
            SettingsData.getTemperatureUnit()
        ]);

        let response;

        try {
            if (location.useCoords) {
                response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&APPID=${this.apiKey}`
                );
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            } else {
                response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${location.name}&APPID=${this.apiKey}`
                );
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }

        let weatherData = await response.json();
        return this.processData(weatherData, unit);
    }

    processData(data: WeatherResponse, unit: string) {
        data.main.temp = parseFloat(convertFromKelvin(data.main.temp, unit).toFixed(1));
        data.main.temp_min = parseFloat(convertFromKelvin(data.main.temp_min, unit).toFixed(1));
        data.main.temp_max = parseFloat(convertFromKelvin(data.main.temp_max, unit).toFixed(1));
        return (this.data = data);
    }

    async getCurrentWeather() {
        const data = await this.load();
        return data;
    }
}

export const WeatherData = new WeatherDataController();