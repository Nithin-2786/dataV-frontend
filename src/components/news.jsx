import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import '../styles.css'
import {
  WiThermometer,
  WiStrongWind,
  WiHumidity,
  WiCloudy,
  WiRaindrops,
  WiBarometer,
  WiDaySunny,
} from 'react-icons/wi' // Importing weather icons
import { FiGlobe } from 'react-icons/fi' // Importing globe icon

function News() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [additionalWeather, setAdditionalWeather] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [locationError, setLocationError] = useState(false)

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const apiKey = '5adda4c1145b4fb6b41105356240805'
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        const data = await response.json()
        setAdditionalWeather(data.current)
        setLatitude(data.location.lat)
        setLongitude(data.location.lon)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            fetchWeatherData(latitude, longitude)
          },
          (error) => {
            console.error('Error getting current location:', error)
            setLocationError(true)
          },
        )
      } else {
        console.error('Geolocation is not supported by your browser.')
        setLocationError(true)
      }
    }

    getLocation()
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://static.elfsight.com/platform/platform.js'
    script.defer = true
    script.setAttribute('data-use-service-core', '')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <Navbar />
      <div className="weather-container">
        <h2>
          {' '}
          Weather {latitude} {longitude}{' '}
        </h2>
        {additionalWeather && (
          <div className="weather-details">
            <div className="weather-info">
              <WiThermometer size={30} />
              <p>{additionalWeather.temp_c}°C</p>
            </div>
            <div className="weather-info">
              <WiThermometer size={30} />
              <p>Feels Like: {additionalWeather.feelslike_c}°C</p>
            </div>
            <div className="weather-info">
              <WiStrongWind size={30} />
              <p>Wind Speed: {additionalWeather.wind_kph} km/h</p>
            </div>
            <div className="weather-info">
              <WiStrongWind size={30} />
              <p>Wind Direction: {additionalWeather.wind_dir}</p>
            </div>
            <div className="weather-info">
              <WiHumidity size={30} />
              <p>Humidity: {additionalWeather.humidity}%</p>
            </div>
            <div className="weather-info">
              <WiCloudy size={30} />
              <p>Cloud Cover: {additionalWeather.cloud}%</p>
            </div>
            <div className="weather-info">
              <WiRaindrops size={30} />
              <p>Precipitation: {additionalWeather.precip_mm} mm</p>
            </div>
            <div className="weather-info">
              <WiBarometer size={30} />
              <p>Pressure: {additionalWeather.pressure_mb} mb</p>
            </div>
            <div className="weather-info">
              <WiDaySunny size={30} />
              <p>Visibility: {additionalWeather.vis_km} km</p>
            </div>
            <div className="weather-info">
              <WiDaySunny size={30} />
              <p>UV Index: {additionalWeather.uv}</p>
            </div>
            <div className="weather-info">
              <FiGlobe size={30} />
              <p>Latitude: {latitude}</p>
            </div>
            <div className="weather-info">
              <FiGlobe size={30} />
              <p>Longitude: {longitude}</p>
            </div>
          </div>
        )}
        {locationError && (
          <p>Please enable location services to fetch weather details.</p>
        )}
      </div>
      <div className="elfsight-widget-container">
        <div
          className="elfsight-app-b1726cc7-97e5-4dd7-92ee-d33119bde11f"
          data-elfsight-app-lazy
        ></div>
      </div>
    </div>
  )
}

export default News
