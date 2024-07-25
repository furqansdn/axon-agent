import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Cloud, CloudRain, Thermometer, Wind } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

export function CurrentWeatherLoading() {
  return (
    <Card className="w-[325px] max-w-[325px] p-4 h-[300px] max-h-[300px] flex flex-col text-gray-50 bg-black">
      <div className="flex justify-between items-center mb-1">
        <Skeleton className="h-[16px] w-[100px]" />
        <Skeleton className="h-[16px] w-[75px]" />
      </div>
      <div className="text-left mb-4">
        <Skeleton className="h-[16px] w-[125px]" />
      </div>
      <div className="flex-grow flex flex-col justify-center items-center mb-8">
        <div className="flex flex-row gap-2">
          <Skeleton className="h-[96px] w-[48px] rounded-3xl" />
          <Skeleton className="h-[96px] w-[48px] rounded-3xl" />
          <Skeleton className="w-[32px] h-[32px] rounded-full" />
        </div>
      </div>
      <div className="pb-4">
        <Skeleton className="h-[26px] rounded-3xl w-full" />
      </div>
    </Card>
  );
}

interface Weather {
  main: string;
  description: string;
  icon: string;
}

interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: Weather[];
}

export interface WeatherProps {
  current: CurrentWeather;
  city: string;
  date: string;
}

export const WeatherComponent = ({ current, city, date }: WeatherProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Weather */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Image
              src={`https://openweathermap.org/img/wn/${current.weather[0].icon}.png`}
              alt="weather-icon"
              width={80}
              height={80}
            />
            <div>
              <h2 className="text-3xl font-bold">
                {current.temp.toFixed(0)}°C
              </h2>
              <p className="text-gray-500">{current.weather[0].main}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg">{city}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Additional Weather Info */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Thermometer className="h-6 w-6 mr-2 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Feels like</p>
              <p className="font-semibold">{current.feels_like.toFixed(0)}°C</p>
            </div>
          </div>
          <div className="flex items-center">
            <Wind className="h-6 w-6 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-semibold">{current.wind_speed} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
