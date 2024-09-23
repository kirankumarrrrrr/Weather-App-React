import React from 'react'
import { useState, useEffect, useRef } from "react";
import search from "../assets/search.png"
import humidity from  "../assets/humidity.png"
import wind from  "../assets/wind.png"
import feels_like from "../assets/feels-like.png"
import pressure from  "../assets/pressure.jfif"
import "./WheatherHome.css"

function WheatherHome() {

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();
      if (data && data.name) {
        getdata(data.name);
      } else {
        console.log('City not found');
        getdata('Hyderabad');
      }
    } catch (err) {
      console.log('Error fetching city name');
    }
  };

  useEffect(() => {
    getLocation();
  },[]);

  const [showAlert, setShowAlert] = useState(false);
  const [apiAlert, setapiAlert] = useState(false);
  const [apiAlertmessage, setapiAlertmessage] = useState("");

  const location = useRef();
  const [weatherData, setweatherData] = useState(false);

  async function getdata(city){
    if(city === '' || city === undefined){
      setShowAlert(true);
      setTimeout(()=>{setShowAlert(false)},4000);
    }else{
      setShowAlert(false);
      try{
        let data;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        await fetch(url).then(response => response.json()).then(json =>{ data = json});
        if(data.cod !== 200){
          setapiAlert(true);
          setapiAlertmessage(data.message);
          location.current.value = "";
          setTimeout(()=>{setapiAlert(false);setapiAlertmessage("")},4000);
        }else{
          setweatherData({
            temperature : data.main.temp,
            location: data.name,
            humidity: data.main.humidity,
            windspeed: data.wind.speed,
            mintemp : data.main.temp_min,
            maxtemp : data.main.temp_max,
            icon : `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            feelslike : data.main.feels_like,
            pressure : data.main.pressure
          });
          location.current.value = "";
        }
      }catch(err){
        console.log(err);
      }
    }
  }

  return (
    <div className='weather'>
      <div className='search'>
      <input type='text' placeholder='search' ref={location} />
      <img src={search} alt="search-icon" onClick={()=>{getdata(location.current.value)}} />
      </div>
      {apiAlert===true?<span className='alert'>{apiAlertmessage}</span>: null}
      {showAlert===true? <span className='alert'>Location can't be empty</span> : null}
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

      <div className='weatherData'>
        <div className='col'>
          <img src={feels_like} alt="feelslike-icon" />
          <div>
            <p>{weatherData.feelslike}°C</p>
            <span>FeelsLike</span>
          </div>
        </div>
        <div className='col'>
          <img src={pressure} alt="pressure-icon" />
          <div>
            <p>{weatherData.pressure} hPa</p>
            <span>pressure</span>
          </div>
        </div>
      </div>
  </div>
  )
}

export default WheatherHome