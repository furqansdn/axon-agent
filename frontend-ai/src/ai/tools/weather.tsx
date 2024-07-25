import {
  CurrentWeatherLoading,
  WeatherComponent,
  WeatherProps,
} from "@/components/prebuild/weather";
import { createRunnableUI } from "@/utils/server";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import moment from "moment";

export const weatherSchema = z.object({
  city: z.string().describe("The city name to get weather for"),

  country: z
    .string()
    .optional()
    .default("use")
    .describe("The two letter country abbreviation to get weather for"),
});

export async function weatherData(
  input: z.infer<typeof weatherSchema>
): Promise<{ input: z.infer<typeof weatherSchema>; weather: WeatherProps }> {
  const openWeatherAPIKey = process.env.OPENWEATHER_API_KEY;

  const geoCodeResponse = await fetch(`
        https://api.openweathermap.org/geo/1.0/direct?q=${input.city.toLocaleLowerCase()},${input.country.toLocaleLowerCase()}&limit=5&appid=${openWeatherAPIKey}
    `);

  if (!geoCodeResponse.ok) {
    console.log("No geocode data found.");
    throw new Error("Failed to fetch geocode data");
  }

  const geoCodeData = await geoCodeResponse.json();

  const { lat, lon } = geoCodeData[0];

  const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=metric`;

  const openWeatherResponse = await fetch(weatherUrl);

  if (!openWeatherResponse.ok) {
    console.log("No weather data found.");
    throw new Error("Failed to fetch weather data");
  }

  const openWeatherData = await openWeatherResponse.json();

  return {
    input: { ...input },
    weather: {
      current: openWeatherData.current,
      city: input.city,
      //
      date: moment().format("dddd, MMMM dd"),
    },
  };
}

export const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description:
    "A tool to fetch the current weather, given a city and state. If the city/state is not provide, ask the user for both the city and state.",
  schema: weatherSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(config, <CurrentWeatherLoading />);
    const {
      weather: { city, current, date },
    } = await weatherData(input);

    stream.done(<WeatherComponent city={city} current={current} date={date} />);
    return JSON.stringify({}, null, 2);
  },
});
