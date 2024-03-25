function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 62.2417, lng: 25.7469 },
    zoom: 12,
  });

  const input = document.querySelector('input');
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.formatted_address !== undefined) {
    weather.fetchWeather(place.formatted_address)
    }
  });
}

const weather = {
  fetchWeather: function(city) {
    fetch(`http://localhost:3000/weather/${city}`)
    .then((response) => response.json())
    .then((data) => this.displayWeather(data));
  },

  displayWeather: function(data) {
    const { name, region } = data.location;
    const { temp_c, feelslike_c, wind_kph, condition: { text, icon } } = data.current;
    console.log(name, region, icon, text, temp_c, feelslike_c, wind_kph);
    document.getElementById("city").innerText = `Weather in ${name}`;
    document.getElementById("temp").innerText = `${temp_c}° C`;
    document.getElementById("icon").src = icon;
    document.getElementById("description").innerText = text
    document.getElementById("feelslike").innerText = `Feels like: ${feelslike_c}° C`;
    document.getElementById("wind").innerText = `Wind speed: ${wind_kph} km/h`;
    document.body.style.backgroundImage = "url('https://source.unsplash.com/2000x1000/?" + name + "')"
  },

  search: function() {
    const city = document.querySelector(".search-bar").value;
    this.fetchWeather(city);
  }
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keypress", function(event) {
  if (event.key == "Enter") {
    weather.search();
  }
});




