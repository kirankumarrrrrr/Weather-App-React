import React from 'react'
import { useState, useEffect, useRef } from "react";
import search from "../assets/search.png"
import humidity from  "../assets/humidity.png"
import wind from  "../assets/wind.png"
// import snow from  "../assets/snow.png"
import "./WheatherHome.css"

function WheatherHome() {

  const location = useRef();
  const [weatherData, setweatherData] = useState(false);

  async function getdata(city){
    try{
      let data;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      await fetch(url).then(response => response.json()).then(json =>{ data = json});
      setweatherData({
        temperature : data.main.temp,
        location: data.name,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        mintemp : data.main.temp_min,
        maxtemp : data.main.temp_max,
        icon : `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      })
    }catch(err){
      console.log(err);
    }

  }

  useEffect(() => {
    getdata('Hyderabad');
  });

  return (
    <div className='weather'>
      <div className='search'>
      <input type='text' placeholder='search' ref={location} />
      <img src={search} alt="search-icon" onClick={()=>{getdata(location.current.value)}} />
      </div>
      <img src={weatherData.icon} alt="weather-icon" className='clear-icon' />
      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='city'>{weatherData.location}</p>

      <div className='weatherData'>
        <div className='col'>
          <img src={humidity} alt="humidity-icon" />
          <div>
            <p>{weatherData.humidity} %</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className='col'>
          <img src={wind} alt="wind-icon" />
          <div>
            <p>{weatherData.windspeed} km/hr</p>
            <span>wind</span>
          </div>
        </div>
      </div>
  </div>
  )
}

export default WheatherHome