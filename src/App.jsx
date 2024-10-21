import { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import clear from './assets/clear.png';
import cloud from './assets/cloud.png';
import drizzle from './assets/drizzle.png';
import humidity from './assets/humidity.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import wind from './assets/wind.png';

const WeatherappImage = ({ icons, temp, city, country, lat, log, humiditys, winds }) => {
  return (
    <>
      <div className="images">
        <img src={icons} alt="weather icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cords">
        <div><span className='lat'>Latitude {lat}</span></div>
        <div><span className='log'>Longitude {log}</span></div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="humidity icon" />
          <div className="data">
            <div className="humidity-percent">{humiditys}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind} alt="wind icon" />
          <div className="data">
            <div className="wind-percent">{winds} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [icons, setIcons] = useState(rain);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humiditys, setHumiditys] = useState(0);
  const [winds, setWinds] = useState(0);
  const [text, setText] = useState("chennai");
  const [citynotfound, setCitynotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  let apikey = "46106470b9bca15ca87572b990776b30";

  const weatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async () => {
    setLoading(true);
    setCitynotfound(false);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;
    try {
      let res = await fetch(url);
      let result = await res.json();

      if (result.cod === "404") {
        setCitynotfound(true);
        setLoading(false);
        return;
      }

      setHumiditys(result.main.humidity);
      setWinds(result.wind.speed);
      setTemp(Math.floor(result.main.temp));
      setCity(result.name);
      setCountry(result.sys.country);
      setLat(result.coord.lat);
      setLog(result.coord.lon);
      const weatherIconCode = result.weather[0].icon;
      setIcons(weatherIconMap[weatherIconCode] || clear);
    } catch (err) {
      console.error("An error occurred:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleOnkeydown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="maincontainer">
        <div className="subcontainer">
          <div className="group">
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => search()} />
            <input
              id="query"
              className="input"
              type="search"
              placeholder="Search City"
              name="searchbar"
              onKeyDown={handleOnkeydown}
              value={text}
              onChange={handleCity}
            />
          </div>

          {citynotfound ? (
            <div className="error-message">City not found. Please try again.</div>
          ) : (
            <WeatherappImage
              icons={icons}
              temp={temp}
              city={city}
              country={country}
              lat={lat}
              log={log}
              humiditys={humiditys}
              winds={winds}
            />
          )}

          <p className="copyright">
            Designed by <span>Shushanth B S</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
