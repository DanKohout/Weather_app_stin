document.addEventListener('DOMContentLoaded', function () {
    city = document.getElementById("city")
    temperature = document.getElementById("temperature")
    description = document.getElementById("description")
    button = document.getElementById("btn-search")
    input_search = document.getElementById("input-search")
    button_refresh = document.getElementById("btn-refresh")
    img_weather = document.getElementById("img-weather")
    


    /*window.addEventListener("load", (event) => {
        log.textContent += "load\n"
        city.textContent = ""

        try {
            fetch('/weather',)
            fetch('/weather?address=' + location).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error
                    } else {
                        messageOne.textContent = data.location
                        messageTwo.textContent = data.forecast
                    }
                })
            })
        } catch () {

        }


    })*/
    window.addEventListener("load", (event) => {
        sendToServer()
    })

    button.addEventListener("click", (event) => {
        sendToServer()
    })

    button_refresh.addEventListener("click", (event) => {
        city.textContent = city.textContent + " "
        sendToServer()
    })

    function formatCityName(city) {
        // Normalize the string to decompose combined characters into individual components
        const normalizedString = city.normalize('NFD');
        
        // Remove diacritical marks using a regular expression
        const noDiacriticsString = normalizedString.replace(/[\u0300-\u036f]/g, '');
        
        // Convert the string to lowercase
        const lowerCaseString = noDiacriticsString.toLowerCase();
        
        // Replace spaces with plus signs
        const formattedString = lowerCaseString.replace(/\s+/g, '+');
        
        return formattedString;
      }

    async function sendToServer() {
        var data_addr = input_search.value

        if (data_addr == '') {
            data_addr = "praha"
        }

        data_addr = formatCityName(data_addr)
        // to prevent searching the same
        if (data_addr == city.textContent)
            return

        city.textContent = data_addr
        temperature.textContent = "Loading..."
        description.textContent = "Loading..."
        try {
            const response = await fetch('/weather?address=' + data_addr).then(response => {
                console.log(response)
                return response
            })
            const answer = await response.json()
            city.textContent = answer.forecast.name//data_addr
            temperature.textContent = answer.forecast.main.temp
            description.textContent = answer.forecast.weather[0].description
            img_weather.src = "https://openweathermap.org/img/wn/"+answer.forecast.weather[0].icon+"@2x.png"
            /*//old API
            temperature.textContent = answer.forecast.temperature
            description.textContent = answer.forecast.weather_descriptions[0]
            console.log(answer.forecast.weather_icons[0])
            img_weather.src = answer.forecast.weather_icons[0]*/

        } catch (e) {
            city.textContent = data_addr + " unavailable"
            temperature.textContent = "Unavailable"
            description.textContent = "Unavailable"
            console.log("fetch failed:")
            console.log(e)
        }

    }



})