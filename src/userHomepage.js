/**
 * JavaScript for the user homepage
 */
import { initializeFirebase } from '../services/firebaseConfig.js';
import authService from '../services/AuthService.js';
import plantService from '../services/PlantService.js';

// User homepage controller
class UserHomepageController {
  constructor() {
    this.weatherData = null;
    this.plantStats = {
      total: 0,
      indoor: 0,
      outdoor: 0,
      needsWatering: 0
    };
    this.tasks = [];
    this.recentActivity = [];
  }

  /**
   * Initialize the homepage
   */
  async initialize() {
    try {
      // Initialize Firebase
      await initializeFirebase();
      
      // Initialize auth service
      authService.init();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check if user is authenticated
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        this.updateWelcomeMessage(currentUser);
        await this.loadData();
      } else {
        // Add listener for auth state changes
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            this.updateWelcomeMessage(user);
            await this.loadData();
          } else {
            window.location.href = 'login.html';
          }
        });
      }
    } catch (error) {
      console.error('Error initializing homepage:', error);
      this.showError('Failed to initialize the homepage. Please refresh and try again.');
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));
    
    // Water all plants button
    document.getElementById('water-all-btn').addEventListener('click', this.handleWaterAllPlants.bind(this));
    
    // Record weather button
    document.getElementById('record-weather-btn').addEventListener('click', this.handleRecordWeather.bind(this));
    
    // Add task button
    document.getElementById('add-task-btn').addEventListener('click', this.handleAddTask.bind(this));
    
    // Enter key in new task input
    document.getElementById('new-task').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.handleAddTask();
      }
    });
  }

  /**
   * Update welcome message with user's name
   * @param {Object} user - Firebase user object
   */
  updateWelcomeMessage(user) {
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.textContent = `Welcome, ${user.displayName || user.email}!`;
  }

  /**
   * Load all data for the homepage
   */
  async loadData() {
    try {
      // Load weather data
      await this.loadWeatherData();
      
      // Load plant statistics
      await this.loadPlantStats();
      
      // Load tasks
      await this.loadTasks();
      
      // Load recent activity
      await this.loadRecentActivity();
    } catch (error) {
      console.error('Error loading data:', error);
      this.showError('Failed to load some data. Please refresh the page to try again.');
    }
  }

  /**
   * Load weather data
   */
  async loadWeatherData() {
    try {
      const weatherDisplay = document.getElementById('weather-display');
      
      // Fetch weather data (using the same approach as in weather.js)
      const coordinates = await this.fetchCoordinates();
      
      if (!coordinates) {
        weatherDisplay.innerHTML = '<p class="error">Unable to determine your location.</p>';
        return;
      }
      
      const weather = await this.fetchWeather(coordinates.lat, coordinates.lon);
      
      if (!weather) {
        weatherDisplay.innerHTML = '<p class="error">Unable to load weather data.</p>';
        return;
      }
      
      // Store the weather data
      this.weatherData = weather;
      
      // Update the weather display
      weatherDisplay.innerHTML = `
        <div class="weather-content">
          <div class="weather-main">
            <div class="weather-icon">${this.getWeatherIcon(weather.description)}</div>
            <div class="weather-temp">${Math.round(weather.temperature)}°C</div>
          </div>
          <div class="weather-details">
            <p><strong>Location:</strong> ${weather.city}</p>
            <p><strong>Condition:</strong> ${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
            <p><strong>Humidity:</strong> ${weather.humidity}%</p>
            <p><strong>Wind:</strong> ${weather.windSpeed} m/s</p>
          </div>
        </div>
        <div class="weather-advice">
          <p>${this.getWeatherAdvice(weather)}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error loading weather data:', error);
      document.getElementById('weather-display').innerHTML = '<p class="error">Failed to load weather data.</p>';
    }
  }

  /**
   * Load plant statistics
   */
  async loadPlantStats() {
    try {
      // Get all plants
      const plants = await plantService.getAllPlants();
      
      // Calculate statistics
      const stats = {
        total: plants.length,
        indoor: plants.filter(plant => plant.location.toLowerCase() === 'indoor').length,
        outdoor: plants.filter(plant => plant.location.toLowerCase() === 'outdoor').length,
        needsWatering: this.calculatePlantsNeedingWater(plants)
      };
      
      // Store the statistics
      this.plantStats = stats;
      
      // Update the statistics display
      document.getElementById('total-plants').textContent = stats.total;
      document.getElementById('indoor-plants').textContent = stats.indoor;
      document.getElementById('outdoor-plants').textContent = stats.outdoor;
      document.getElementById('needs-watering').textContent = stats.needsWatering;
    } catch (error) {
      console.error('Error loading plant statistics:', error);
      document.getElementById('plant-stats').innerHTML = '<p class="error">Failed to load plant statistics.</p>';
    }
  }

  /**
   * Load tasks
   */
  async loadTasks() {
    try {
      // For now, we'll just show some placeholder tasks
      // In a real implementation, these would come from a database
      const tasks = [
        { id: 1, text: 'Water indoor plants', completed: false },
        { id: 2, text: 'Check garden soil moisture', completed: true },
        { id: 3, text: 'Move plants away from direct sunlight', completed: false }
      ];
      
      // Store the tasks
      this.tasks = tasks;
      
      // Update the tasks display
      const tasksList = document.getElementById('tasks-list');
      
      if (tasks.length === 0) {
        tasksList.innerHTML = '<li class="no-tasks">No tasks for today. Add a new one!</li>';
        return;
      }
      
      tasksList.innerHTML = '';
      
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
          <label class="task-checkbox">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="checkmark"></span>
          </label>
          <span class="task-text">${task.text}</span>
          <button class="delete-task-btn">×</button>
        `;
        
        // Add event listeners for checkbox and delete button
        li.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
          this.handleTaskCompletion(task.id, event.target.checked);
        });
        
        li.querySelector('.delete-task-btn').addEventListener('click', () => {
          this.handleDeleteTask(task.id);
        });
        
        tasksList.appendChild(li);
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
      document.getElementById('tasks-list').innerHTML = '<li class="error">Failed to load tasks.</li>';
    }
  }

  /**
   * Load recent activity
   */
  async loadRecentActivity() {
    try {
      // For now, we'll just show some placeholder activity
      // In a real implementation, these would come from a database
      const activities = [
        { type: 'watering', plantName: 'Spider Plant', timestamp: new Date(Date.now() - 3600000) },
        { type: 'added', plantName: 'Succulent', timestamp: new Date(Date.now() - 86400000) },
        { type: 'fertilized', plantName: 'Monstera', timestamp: new Date(Date.now() - 172800000) }
      ];
      
      // Store the activities
      this.recentActivity = activities;
      
      // Update the activity display
      const activityFeed = document.getElementById('activity-feed');
      
      if (activities.length === 0) {
        activityFeed.innerHTML = '<p class="no-activity">No recent activity.</p>';
        return;
      }
      
      activityFeed.innerHTML = '';
      
      activities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        
        // Format timestamp
        const timeAgo = this.formatTimeAgo(activity.timestamp);
        
        // Set icon based on activity type
        let icon = '🪴';
        let action = 'Updated';
        
        if (activity.type === 'watering') {
          icon = '💧';
          action = 'Watered';
        } else if (activity.type === 'added') {
          icon = '🌱';
          action = 'Added';
        } else if (activity.type === 'fertilized') {
          icon = '🌿';
          action = 'Fertilized';
        } else if (activity.type === 'pruned') {
          icon = '✂️';
          action = 'Pruned';
        }
        
        div.innerHTML = `
          <span class="activity-icon">${icon}</span>
          <div class="activity-details">
            <p class="activity-text"><strong>${action}</strong> ${activity.plantName}</p>
            <p class="activity-time">${timeAgo}</p>
          </div>
        `;
        
        activityFeed.appendChild(div);
      });
    } catch (error) {
      console.error('Error loading recent activity:', error);
      document.getElementById('activity-feed').innerHTML = '<p class="error">Failed to load recent activity.</p>';
    }
  }

  /**
   * Handle logout
   */
  async handleLogout() {
    try {
      await authService.logout();
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error logging out:', error);
      this.showError('Failed to log out. Please try again.');
    }
  }

  /**
   * Handle water all plants
   */
  async handleWaterAllPlants() {
    try {
      // Get all plants
      const plants = await plantService.getAllPlants();
      
      // Show confirmation if there are plants
      if (plants.length === 0) {
        this.showMessage('You have no plants to water!');
        return;
      }
      
      if (!confirm(`Water all ${plants.length} plants?`)) {
        return;
      }
      
      // Record watering for each plant
      for (const plant of plants) {
        await plantService.recordWatering(plant.id);
      }
      
      this.showMessage(`All ${plants.length} plants have been watered!`);
      
      // Reload plant statistics and recent activity
      await this.loadPlantStats();
      await this.loadRecentActivity();
    } catch (error) {
      console.error('Error watering all plants:', error);
      this.showError('Failed to water all plants. Please try again.');
    }
  }

  /**
   * Handle record weather
   */
  handleRecordWeather() {
    // For now, just show a message
    // In a real implementation, this would save the current weather data to a database
    this.showMessage('Weather data has been recorded!');
  }

  /**
   * Handle add task
   */
  handleAddTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    
    if (!taskText) {
      return;
    }
    
    // Create a new task
    const newTask = {
      id: Date.now(), // Use timestamp as a simple ID
      text: taskText,
      completed: false
    };
    
    // Add to tasks array
    this.tasks.push(newTask);
    
    // Update the tasks display
    const tasksList = document.getElementById('tasks-list');
    
    // Remove 'no-tasks' message if present
    const noTasksElement = tasksList.querySelector('.no-tasks');
    if (noTasksElement) {
      tasksList.removeChild(noTasksElement);
    }
    
    // Create and add the new task element
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = newTask.id;
    
    li.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>
      <span class="task-text">${newTask.text}</span>
      <button class="delete-task-btn">×</button>
    `;
    
    // Add event listeners for checkbox and delete button
    li.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
      this.handleTaskCompletion(newTask.id, event.target.checked);
    });
    
    li.querySelector('.delete-task-btn').addEventListener('click', () => {
      this.handleDeleteTask(newTask.id);
    });
    
    tasksList.appendChild(li);
    
    // Clear the input
    newTaskInput.value = '';
    
    // Show confirmation message
    this.showMessage('Task added successfully!');
  }

  /**
   * Handle task completion
   * @param {number} taskId - Task ID
   * @param {boolean} completed - Whether the task is completed
   */
  handleTaskCompletion(taskId, completed) {
    // Update the task in the array
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = completed;
      
      // Update the task element
      const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
      
      if (completed) {
        taskElement.classList.add('completed');
      } else {
        taskElement.classList.remove('completed');
      }
    }
  }

  /**
   * Handle delete task
   * @param {number} taskId - Task ID
   */
  handleDeleteTask(taskId) {
    // Remove the task from the array
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    
    // Remove the task element
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    
    if (taskElement) {
      taskElement.remove();
    }
    
    // Show 'no-tasks' message if no tasks
    if (this.tasks.length === 0) {
      document.getElementById('tasks-list').innerHTML = '<li class="no-tasks">No tasks for today. Add a new one!</li>';
    }
  }

  // Helper methods

  /**
   * Calculate number of plants needing water
   * @param {Array} plants - Array of plants
   * @returns {number} Number of plants needing water
   */
  calculatePlantsNeedingWater(plants) {
    // In a real implementation, this would check the last watered date
    // and environmental factors to determine if a plant needs water
    // For simplicity, we'll just assume a plant needs water if it hasn't been watered in 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return plants.filter(plant => !plant.lastWatered || plant.lastWatered < threeDaysAgo).length;
  }

  /**
   * Get weather icon based on description
   * @param {string} description - Weather description
   * @returns {string} Weather icon
   */
  getWeatherIcon(description) {
    description = description.toLowerCase();
    
    if (description.includes('rain') || description.includes('drizzle')) {
      return '🌧️';
    } else if (description.includes('cloud')) {
      return '☁️';
    } else if (description.includes('clear')) {
      return '☀️';
    } else if (description.includes('snow')) {
      return '❄️';
    } else if (description.includes('thunder') || description.includes('storm')) {
      return '⛈️';
    } else if (description.includes('mist') || description.includes('fog')) {
      return '🌫️';
    } else {
      return '🌤️';
    }
  }

  /**
   * Get gardening advice based on weather
   * @param {Object} weather - Weather data
   * @returns {string} Gardening advice
   */
  getWeatherAdvice(weather) {
    const description = weather.description.toLowerCase();
    const temperature = weather.temperature;
    
    if (description.includes('rain')) {
      return 'No need to water outdoor plants today! Consider moving sensitive potted plants under cover.';
    } else if (temperature > 30) {
      return 'High temperatures today. Water plants in the early morning or evening, and provide shade if possible.';
    } else if (temperature < 10) {
      return 'Cool temperatures today. Protect sensitive plants and hold off on fertilizing.';
    } else if (description.includes('clear') || description.includes('sun')) {
      return 'Sunny day! Perfect for gardening activities. Don\'t forget to water outdoor plants.';
    } else {
      return 'Good day for general garden maintenance. Check soil moisture and water as needed.';
    }
  }

  /**
   * Format timestamp as time ago
   * @param {Date} date - Date object
   * @returns {string} Formatted time ago
   */
  formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }

  /**
   * Fetch coordinates using the Geocoding API
   * @returns {Promise<Object>} Coordinates object with lat and lon properties
   */
  async fetchCoordinates() {
    const geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct";
    const city = "Oklahoma City"; // Default city, should be user's location
    const state = "OK";
    const country = "US";
    const apiKey = "21d48ceb9e9626a3582feb6e8307bbc2"; // Replace with your API key
    
    try {
      const response = await fetch(`${geoApiUrl}?q=${city},${state},${country}&appid=${apiKey}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("Location not found");
      }
      
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  }

  /**
   * Fetch weather using the Weather API
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data object
   */
  async fetchWeather(lat, lon) {
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "21d48ceb9e9626a3582feb6e8307bbc2"; // Replace with your API key
    const units = "metric";
    
    try {
      const response = await fetch(`${weatherApiUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await response.json();
      
      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  /**
   * Show a success message
   * @param {string} message - Message to show
   */
  showMessage(message) {
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message success';
    messageElement.textContent = message;
    
    // Add to the document
    document.body.appendChild(messageElement);
    
    // Remove after a delay
    setTimeout(() => {
      messageElement.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 500);
    }, 3000);
  }

  /**
   * Show an error message
   * @param {string} message - Error message to show
   */
  showError(message) {
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message error';
    messageElement.textContent = message;
    
    // Add to the document
    document.body.appendChild(messageElement);
    
    // Remove after a delay
    setTimeout(() => {
      messageElement.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 500);
    }, 5000);
  }
}

// Initialize the homepage controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const controller = new UserHomepageController();
  controller.initialize();
});