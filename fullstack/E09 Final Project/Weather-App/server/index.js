require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
const weatherApiKey = process.env.WEATHER_API_KEY;
const mongoUrl = process.env.MONGO_URL='mongodb+srv://michael:12345@cluster0.6zrrdun.mongodb.net/test';
const dbName = process.env.test;

app.use(cors());
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=no`;

  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default(apiUrl);
    const weatherData = await response.json();
    const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    
    await client.connect();
    const db = client.db(dbName);
    const weatherCollection = db.collection('weather');
    const weather = {
      city,
      temperature_c: weatherData.current.temp_c,
      feelslike_c: weatherData.current.feelslike_c,
      wind_kph: weatherData.current.wind_kph,
      date: new Date()
    };
    await weatherCollection.insertOne(weather);

    await client.close();

    res.json(weatherData);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});