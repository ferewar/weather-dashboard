// Define API key and select HTML elements
var weatherApiKey = "206aaf9cd7b42be9d6890a33b5224542";
var searchFormElement = document.querySelector("#search-form");
var cityInputElement = document.querySelector("#city-input");
var searchHistoryContainer = document.querySelector("#search-history-container");
var currentWeatherContainer = document.querySelector("#current-weather-container");
var forecastContainer = document.querySelector("#forecast-container");

// Event listener for the search form submission
searchFormElement.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = cityInputElement.value.trim().toUpperCase();
  if (cityName !== "") {
    searchWeather(cityName);
  }
});

// Function to search for weather data
function searchWeather(cityName) {
  // Current weather API URL
  var currentWeatherApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherApiKey + "&units=metric";

  // Fetch current weather data
  fetch(currentWeatherApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // Display current weather data
        displayCurrentWeather(data);

        // Save city name to search history
        saveSearchHistory(cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });

  // 5-day forecast API URL
  var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + weatherApiKey + "&units=metric";

  // Fetch 5-day forecast data
  fetch(forecastApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // Display 5-day forecast data
        displayForecast(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

// Function to display current weather data
function displayCurrentWeather(data) {
  var city = data.name;
  var date = new Date(data.dt * 1000).toLocaleDateString();
  var iconUrl =
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  var temperature = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  // Generate HTML for current weather
  var html = "<h1 class='dashboard-header'>" + city + " (" + date + ") " + "<img src='" + iconUrl + "' alt='" + data.weather[0].description + "'></h1>" + "<p>Temperature: " + temperature + " &deg;C</p>" + "<p>Humidity: " + humidity + "%</p>" + "<p>Wind Speed: " + windSpeed + " m/s</p>";

  // Set HTML to current weather container
  currentWeatherContainer.innerHTML = html;
  currentWeatherContainer.classList.add("current-weather");
}

// Function to display 5-day forecast data
function displayForecast(data) {
  var forecastItems = data.list.filter(function (item) {
    return item.dt_txt.includes("12:00:00");
  });

  // Generate HTML for 5-day forecast
  var html = "<h2 class='dashboard-subheader'>5-Day Forecast:</h2>";

  forecastItems.forEach(function (item) {
    var date = new Date(item.dt * 1000).toLocaleDateString();
    var iconUrl =
      "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
    var temperature = item.main.temp;
    var windSpeed = item.wind.speed;

    html +="<div class='forecast-item'>" + "<h5>" + date +"</h5>" +"<img src='" + iconUrl +"' alt='" + item.weather[0].description + "'>" + "<p>Temp: " + temperature + " &deg;C</p>" + "<p>Humidity: " + item.main.humidity + "%</p>" + "<p>Wind Speed: " + windSpeed + " m/s</p>" +"</div>";
  });

  // Set HTML to forecast container
  forecastContainer.innerHTML = html;
  forecastContainer.classList.add("forecast");
}

// Function to save search history to local storage
function saveSearchHistory(cityName) {
  // Get search history from local storage or create an empty array
  var searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  
  // Add new city to search history
  searchHistory.push(cityName);
  
  // Remove duplicates from search history
  var searchHistoryNoDuplicates = [];
  searchHistory.forEach(function (city) {
    if (!searchHistoryNoDuplicates.includes(city)) {
      searchHistoryNoDuplicates.push(city);
    }
  });
  
  // Set the new search history to local storage
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistoryNoDuplicates));

  // Display updated search history
  displaySearchHistory();
}

// Function that creates buttons for each city in the search history array and displays them on the page in the search-history div
function displaySearchHistory() {
  // Get search history from local storage or create an empty array
  var searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  
  // Generate HTML for search history
  var html = "<h2 class='dashboard-subheader'>Search History</h2>";
  searchHistory.forEach(function (city) {
    html += "<button class='search-history-button'>" + city + "</button>";
  });

  // Set HTML to search history container
  searchHistoryContainer.innerHTML = html;
}

// Function to display the weather and forecast for the city button that was clicked in the search history div on the page
function displayWeatherFromHistory(event) {
  var cityName = event.target.textContent;
  searchWeather(cityName);
}

// Event listener for the search history div on the page
searchHistoryContainer.addEventListener("click", displayWeatherFromHistory);

// Display search history on page load
displaySearchHistory();

// Function to clear the search history from local storage and the page
function clearSearchHistory() {
  localStorage.removeItem("weatherSearchHistory");
  displaySearchHistory();
}

// Event listener for the clear search history button
document
  .querySelector("#clear-history")
  .addEventListener("click", clearSearchHistory);
