document.addEventListener('DOMContentLoaded', function () {
    city = document.getElementById("city")
    temperature = document.getElementById("temperature")
    description = document.getElementById("description")
    button = document.getElementById("btn-search")
    input_search = document.getElementById("input-search")
    button_refresh = document.getElementById("btn-refresh")
    img_weather = document.getElementById("img-weather")
    button_hist = document.getElementById("btn-search-hist")



    button_hist.addEventListener("click", (event) => {
        sendToServer_hist()
    })

    async function sendToServer_hist() {
        var data_addr = input_search.value

        if (data_addr == '') {
            data_addr = "praha"
        }

        data_addr = formatCityName(data_addr)
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
                const response = await fetch('/subscription/weather?'+ new URLSearchParams({
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
    };



    function formatCityName(city) {
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