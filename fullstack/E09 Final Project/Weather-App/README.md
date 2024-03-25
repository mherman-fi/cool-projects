# Weather App

## Description

The project is a simple weather app. The app connects to two APIs. The Openweather API is used to access the relevant weather statistics. The Google Places API is used for autocomplete functionality. The Google API key used in the project is associated with the Maps Javascript API and the Places API. Both are necessary for autocomplete funcationality. 

The App features a responsive interface and simple, intuitive UI. It is accessible via keyboard and mouse. A range of weather conditions are available. The standard temperature in Celsius, 'feels like' and wind speed were selected for use. The temperature is of obvious relevance. 'Feels like' and wind options seemed the most appropriate information to include given Finnish climate conditions. 

The app has four native states. The first is the loading state. During this state no weather information is accessed. A 'loading' message briefly appears and the app window appears slightly squashed. During this phase a random background image with a 'landscape' tag is accessed from Unsplash.com. Once the loading phase is complete, the app appears in its default state. An appropriate weather icon is downloaded from the openweather database and the weather is displayed. Weather conditions for Jyväskylä are displayed by default. Background images from Unsplash with the tag 'jyvaskylä' are displayed. 

In the third state, the autocomplete function is engaged in the search bar. Locations can be selected from the list which appears as input is added. They can also be typed out in their entirety. After the search button is clicked or the Enter key is hit, the app enters its final state. Here the weather for the location displayed, an icon is fetched. The input is stored as a variable. An background image from Unsplash with the input variable tag is displayed.

A breakdown of the technical details of the project follows below. 

## Code Breakdown

### index.js

The index.js file initialises a Node.js server listening for requests on port 3000. The server logs a message to the console indicating it is running. It then returns weather data for a given city using the WeatherAPI.com API.

Backend functionality was incorporated into the project because of the security risks associated with hardcoding API keys into public-facing applications. These can easily be inspected in the console and used for malicious purposes. The dotenv module was used to load the API key into the environment for this reason. The key is not available in the repository because .env files have been added to the .gitignore. This enables the app to work while storing sensitive data securely. 

The server initializes the Express framework and uses CORS middleware to enable cross-origin resource sharing. This is of particular importance for browser-based apps because it allows browsers to enforce the same-origin policy. This security measure prevents malicious scripts from accessing resources they should not have access to.

The server listens for GET requests to the /weather/:city endpoint. The :city endpoint (rather obviously) specifies the city for which weather data is requested. The server constructs the API URL using the WEATHER_API_KEY environment variable and the city parameter. It then sends an HTTP request using the node-fetch module to retrieve the weather data. 

After receiving the weather data a connection to a MongoDB database is established using the MongoDB driver for Node.js. The useUnifiedTopology: true option is used to enable the topology engine in the MongoDB driver. Weather data is then extracted from the API response and saved to the weather collection. The database connection is then closed using the close() method.

The basic database functionality could be expanded for a range of more sophisticated purposes. These could include weather trend and app usage analysis. The implementation of these features are beyond the scope of the project, however. 

### script.js

The script.js file defines client-side functionality for the app. The main feature is a search bar in which a location can be entered by a user. 

The initMap() function initializes a new Google Map instance and sets the center and zoom level. It creates a Google Maps Autocomplete instance that listens for changes to the input field and triggers a weather.fetchWeather() function call with the formatted address of the selected location. A default latitude and longitude were provided. Autocomplete will not work without this information. The coordinates 62.2417 latitude and 25.7469 longitidude are for Jyväskylä. 

The weather object contains three functions:

The fetchWeather(city) function makes a GET request to a local server (http://localhost:3000/weather/${city}) with the city name as a parameter and calls displayWeather() with the resulting weather data.

The displayWeather(data) function extracts weather information from the data object and updates the HTML elements with the corresponding data. It also sets the background image of the page to a picture of the location using the Unsplash API. 

When the user clicks the search button or presses Enter the search() function is called. It extracts the input value and calls fetchWeather() with the city name. The code adds event listeners to the search button and search bar that call the search() function when clicked or when the Enter key is pressed.

### index.html

The index.html forms the basis of the frontend structure. It seems unnecessary to delve too deeply into the specific details of the html because most of the app's features are defined elsewhere. Some features are nevertheless worth noting. 

Considerable time and effort was expended understanding how to implement the Google Places API correctly. After many, *many* hours of fruitless troubleshooting and redundant code revisions, it was discovered that the API was only using the initMap callback. After including the libraries=places syntax, the autocomplete functionality worked as expected. 

The "onload" attribute of the 'body' tag calls a JavaScript function to fetch the weather data for the city of Jyväskylä. This is how the default behaviour of the app is achieved. A significant amount of effort and thought was also put into the design elements. The app is also highly responsive. All the elements work together to create a functional and visually appealing application. 

## Future Developement

The app currently has rather limited functionality. The backend exists solely for API management. The most obvious improvements would therefore be to expand server-side functions. Superior peformance and user experience could be achieved by allowing the server to cache weather and image data. This would allow the app to respond more rapidly to subsequent requests. Other useful features include the possibility to create accounts and save locations.

## Final Thoughts

On a personal note, I would like to add that this project required a substantial amount of work. It has occupied significant mental real estate for many weeks now. I have spent almost every moment of my free time since the Christmas break working on it. The course was very demanding. I am glad (and relieved) I was able to get through it all. 


