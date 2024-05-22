document.addEventListener('DOMContentLoaded', function () {
    username = document.getElementById("username")
    city = document.getElementById("city")
    temperature = document.getElementById("temperature")
    description = document.getElementById("description")
    button = document.getElementById("btn-search")
    input_search = document.getElementById("input-search")
    button_refresh = document.getElementById("btn-refresh")
    img_weather = document.getElementById("img-weather")
    city_fav = document.getElementById("city-fav")
    temperature_fav = document.getElementById("temperature-fav")
    description_fav = document.getElementById("description-fav")
    img_weather_fav = document.getElementById("img-weather-fav")
    button_get_fav = document.getElementById("btn-get-favorite")
    button_set_fav = document.getElementById("btn-set-favorite")
    button_hist = document.getElementById("btn-search-hist")



    button_hist.addEventListener("click", (event) => {
        sendToServer_hist()
    })

    window.addEventListener("load", (event) => {
        sendToServer_fav_get()
    })
    button_get_fav.addEventListener("click", (event) => {
        sendToServer_fav_get()
    })
    button_set_fav.addEventListener("click", (event) => {
        sendToServer_fav_set()
        sendToServer_fav_get()//+aktualization of the current html
    })

    async function sendToServer_fav_set() {
        console.log("set_fav_loc_start")
        try {
            // Retrieve the input value
            const inputSearch = document.getElementById('input-search');
            var newFavoritePlace = inputSearch.value.trim(); // Trim to remove any extra spaces
            if (newFavoritePlace == '') {
                newFavoritePlace = "praha"
            }
            newFavoritePlace = formatCityName(newFavoritePlace)
    
            // Get the username from the cookie
            const username = getCookieValue('username');
    
            if (!username) {
                alert('Username not found in cookies');
                return;
            }
    
            const url = `/user/favorite_set?username=${encodeURIComponent(username)}&favoritePlace=${encodeURIComponent(newFavoritePlace)}`;
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to set favorite place');
            }
    
            // Call the method to get and display the favorite place
            await sendToServer_fav_get();
    
        } catch (error) {
            console.error('Error:', error);
            alert('Error setting favorite place');
        }
    }

    async function sendToServer_fav_get() {
        console.log("get_fav_loc_start")
        try {
            //user/favorite_get?username=asdf
            const username = getCookieValue('username');//should be asdf
            // Fetch the favorite location
            var response = await fetch('/user/favorite_get?username=' + username);

            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            var answer = await response.json();
            
            if (answer.location === '') {
                city_fav.textContent = "No favorite location yet"
                temperature_fav.textContent = "---"
                description_fav.textContent = "---"
                return
            }
            var location = answer.location
            location = location.trim();
            city_fav.textContent = location
            //console.log('-',location,'-')
            temperature_fav.textContent = "Loading..."
            description_fav.textContent = "Loading..."
            try {
                response = await fetch('/weather?address=' + location).then(response => {
                    //console.log(response)
                    return response
                })
                answer = await response.json()
                city_fav.textContent = answer.forecast.name
                temperature_fav.textContent = answer.forecast.main.temp
                description_fav.textContent = answer.forecast.weather[0].description
                img_weather_fav.src = "https://openweathermap.org/img/wn/" + answer.forecast.weather[0].icon + "@2x.png"


            } catch (e) {
                city_fav.textContent = "location unavailable"
                temperature_fav.textContent = "Unavailable"
                description_fav.textContent = "Unavailable"
                console.log("fetch failed:")
                console.log(e)
            }
        } catch (e) {
            console.log("failed to load favorite location")
            console.log(e)
        }



    }


    async function sendToServer_hist() {
        var data_addr = input_search.value

        if (data_addr == '') {
            data_addr = "praha"
        }

        data_addr = formatCityName2(data_addr)
        // to prevent searching the same
        if (data_addr == city.textContent)
            return
        try {
            const todayDate = getTodayDate() // Get today's date in the format yyyy-mm-dd
            const yesterdayDate = getPreviousDay(todayDate) // Get yesterday's date
            const beforeyesterdayDate = getPreviousDay(yesterdayDate) // Get yesterday's date
            // Array to store the dates to fetch
            const datesToFetch = [todayDate, yesterdayDate, beforeyesterdayDate]

            // Loop over each date and fetch data
            // Array to store fetched answers
            const answers = []

            // Loop over each date and fetch data
            for (const date of datesToFetch) {
                const response = await fetch('/subscription/weather?' + new URLSearchParams({
                    address: data_addr,
                    date: date
                }))
                const answer = await response.json()
                answers.push(answer)
            }

            // Call renderWeatherTiles with the array of answers after fetching all data
            renderWeatherTiles(answers)

        } catch (e) {
            console.log("fetch failed (historical):")
            console.log(e)
        }

    }

    /**
     * function rendering additional 
     */
    const renderWeatherTiles = (answers) => {
        //console.log(answers)
        const container = document.getElementById('weather-container')
        container.innerHTML = '' // Clear any existing content

        // Iterate through each answer in the array
        answers.forEach(answer => {
            // Check if the answer contains location and forecast properties
            if (answer.location && answer.forecast) {
                const location = answer.location
                const forecast = answer.forecast

                // Adding the location name to the forecast part of the json
                const forecast_with_location = forecast.map(forecast => ({
                    ...forecast,
                    locationName: location.name
                }))

                // Create weather tiles for each forecast in the answer
                forecast_with_location.forEach(forecast => {
                    const tile = createWeatherTile(forecast)
                    container.appendChild(tile)
                })
            } else {
                console.error("Answer does not contain location and forecast properties.")
            }
        })
    }

    /**
     * function for creating tiles with info for weather
     * mainly for historical weather
     */
    const createWeatherTile = (weatherForecast) => {
        const tile = document.createElement('div');
        tile.className = 'weather-tile';

        const locationName = document.createElement('h3');
        locationName.textContent = weatherForecast.locationName;

        const date = document.createElement('div');
        date.textContent = `Date: ${weatherForecast.date}`;

        const avgTemp = document.createElement('div');
        avgTemp.textContent = `Avg Temp: ${weatherForecast.avgtemp_c}°C`;

        const conditionText = document.createElement('div');
        conditionText.textContent = weatherForecast.condition.text;

        const conditionIcon = document.createElement('img');
        conditionIcon.src = weatherForecast.condition.icon;
        conditionIcon.alt = weatherForecast.condition.text;

        tile.appendChild(locationName);
        tile.appendChild(date);
        tile.appendChild(avgTemp);
        tile.appendChild(conditionText);
        tile.appendChild(conditionIcon);

        return tile;
    }

    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }


    function formatCityName2(city) {
        // Normalize the string to decompose combined characters into individual components
        const normalizedString = city.normalize('NFD');

        // Remove diacritical marks using a regular expression
        const noDiacriticsString = normalizedString.replace(/[\u0300-\u036f]/g, '');

        // Convert the string to lowercase
        const lowerCaseString = noDiacriticsString.toLowerCase();
        //const formattedString = lowerCaseString.replace(/\s+/g, ' ');
        //return formattedString;
        return lowerCaseString
    }

    function formatCityName(city) {
        // Normalize the string to decompose combined characters into individual components
        const normalizedString = city.normalize('NFD');

        // Remove diacritical marks using a regular expression
        const noDiacriticsString = normalizedString.replace(/[\u0300-\u036f]/g, '');

        // Convert the string to lowercase
        const lowerCaseString = noDiacriticsString.toLowerCase();
        const formattedString = lowerCaseString.replace(/\s+/g, '+');
        return formattedString;
        //return lowerCaseString
    }

    const getTodayDate = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const day = today.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const getPreviousDay = (dateString) => {
        const date = new Date(dateString)
        date.setDate(date.getDate() - 1)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }


})