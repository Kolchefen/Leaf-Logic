//src/mockWeatherData.js

const mockWeatherData = {
    list: [
      {
        main: { temp: 298.55, humidity: 85 },
        weather: [{ main: "Rain", description: "light rain" }],
        dt_txt: "2024-10-24 15:00:00"
      },
      {
        main: { temp: 299.75, humidity: 78 },
        weather: [{ main: "Clouds", description: "broken clouds" }],
        dt_txt: "2024-10-24 18:00:00"
      },
      {
        main: { temp: 300.00, humidity: 80 },
        weather: [{ main: "Clear", description: "clear sky" }],
        dt_txt: "2024-10-24 21:00:00"
      }
    ]
  };
  
  module.exports = mockWeatherData;
  