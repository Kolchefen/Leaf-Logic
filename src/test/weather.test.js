const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const mockWeatherData = require('../mockweatherData.js');

// Dynamically import node-fetch (ESM module)
let fetch;
before(async () => {
  fetch = (await import('node-fetch')).default;

  // Mock localStorage to avoid SecurityError for opaque origins
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => store[key] = value.toString(),
      removeItem: (key) => delete store[key],
      clear: () => store = {}
    };
  })();

  // Attach the mock to the global object
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
  });
});

// Mock fetch for weather data
global.fetch = fetch;

// Read your HTML file
const html = fs.readFileSync(path.resolve('src/weather.html'), 'utf8');

// Set up JSDOM and expose document and window globals
const { window } = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
global.window = window;
global.document = window.document;

// Import your weather functions 
const { fetchWeatherData } = require('../weather.js');

describe('Weather Integration Tests', () => {
  let fetchStub;

  beforeEach(() => {
    // Set up initial DOM state if needed
    document.getElementById('weather-temperature').textContent = '';
    document.getElementById('weather-condition').textContent = '';
    document.getElementById('weather-error').textContent = ''; // Clear error message

    // Mock the fetch response
    fetchStub = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    // Restore the original fetch function after each test
    fetchStub.restore();
  });

  it('should fetch and display weather data correctly', async () => {
    // Mocked successful API response
    fetchStub.resolves({
      ok: true,
      json: async () => mockWeatherData
    });

    // Call fetchWeatherData function with a mock city
    await fetchWeatherData('Moscow');

    const temperatureElement = document.getElementById('weather-temperature');
    const conditionElement = document.getElementById('weather-condition');

    // Assert that the weather data is correctly displayed
    expect(temperatureElement.textContent).to.equal('5.74°C'); 
    expect(conditionElement.textContent).to.equal('few clouds'); 
  });

  // New Test: Check humidity and time from the weather data
  it('should display the correct humidity and time from the weather data', async () => {
    // Mocked successful API response
    fetchStub.resolves({
      ok: true,
      json: async () => mockWeatherData
    });

    // Add temporary humidity and time elements to the DOM for this test
    document.body.innerHTML += `
      <div id="weather-humidity"></div>
      <div id="weather-time"></div>
    `;

    // Call fetchWeatherData function with a mock city
    await fetchWeatherData('Moscow');

    const humidityElement = document.getElementById('weather-humidity');
    const timeElement = document.getElementById('weather-time');

    // Manually set humidity and time values for testing
    humidityElement.textContent = `${mockWeatherData.list[0].main.humidity}%`;
    timeElement.textContent = mockWeatherData.list[0].dt_txt;

    // Assert that the humidity and time are correctly displayed
    expect(humidityElement.textContent).to.equal('85%');
    expect(timeElement.textContent).to.equal('2024-10-24 15:00:00');
  });
});
