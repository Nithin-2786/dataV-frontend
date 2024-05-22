import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Line } from 'react-chartjs-2'
import Navbar from './Navbar'
import ApexCharts from 'react-apexcharts' // Import ApexCharts
import '../styles.css'
import airQualityData from '../air_quality_data.json' // Ensure the path is correct

const cities = ['Hyderabad', 'Delhi', 'Mumbai', 'Ahmedabad', 'Chennai']

const MapWithMarkers = () => {
  const [chartData, setChartData] = useState(null)
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const [heatmapData, setHeatmapData] = useState([]) // State for heatmap data
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) {
      return
    }

    mapRef.current = L.map('map').setView([17.3575, 78.3147], 12)

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(mapRef.current)

    const himayatSagarBorderCoordinates = [
      [17.3817, 78.2869],
      // coordinates...
      [17.3817, 78.328], // back to the starting point
    ]

    const lakeBorder = L.polyline(himayatSagarBorderCoordinates, {
      color: 'blue',
      weight: 3,
      dashArray: '5, 10',
    }).addTo(mapRef.current)

    mapRef.current.fitBounds(himayatSagarBorderCoordinates)

    L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
    L.control.scale().addTo(mapRef.current)

    const cityMarkers = {
      Hyderabad: [17.385, 78.4867],
      Delhi: [28.7041, 77.1025],
      Mumbai: [19.076, 72.8777],
      Ahmedabad: [23.0225, 72.5714],
      Chennai: [13.0827, 80.2707],
    }

    const customIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      iconSize: [38, 95],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    })

    Object.keys(cityMarkers).forEach((city) => {
      L.marker(cityMarkers[city], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${city}</b>`)
    })

    return () => {
      mapRef.current.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const processData = () => {
      const labels = []
      const cityData = {
        airIndex: [],
        pm25Levels: [],
        pm10Levels: [],
        so2Levels: [],
        o3Levels: [],
        coLevels: [],
        no2Levels: [],
      }

      airQualityData.forEach((entry) => {
        if (entry.city === selectedCity) {
          if (!labels.includes(entry.date)) {
            labels.push(entry.date)
          }

          cityData.airIndex.push(entry['Air index'])
          cityData.pm25Levels.push(entry.pm25Levels)
          cityData.pm10Levels.push(entry.pm10Levels)
          cityData.so2Levels.push(entry.so2Levels)
          cityData.o3Levels.push(entry.o3Levels)
          cityData.coLevels.push(entry.coLevels)
          cityData.no2Levels.push(entry.no2Levels)
        }
      })

      setChartData({
        labels,
        datasets: [
          {
            label: `${selectedCity} - Air Index`,
            data: cityData.airIndex,
            borderColor: 'rgba(0, 123, 255, 1)',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - PM2.5 Levels`,
            data: cityData.pm25Levels,
            borderColor: 'rgba(220, 53, 69, 1)',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - PM10 Levels`,
            data: cityData.pm10Levels,
            borderColor: 'rgba(40, 167, 69, 1)',
            backgroundColor: 'rgba(40, 167, 69, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - SO2 Levels`,
            data: cityData.so2Levels,
            borderColor: 'rgba(255, 193, 7, 1)',
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - O3 Levels`,
            data: cityData.o3Levels,
            borderColor: 'rgba(23, 162, 184, 1)',
            backgroundColor: 'rgba(23, 162, 184, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - CO Levels`,
            data: cityData.coLevels,
            borderColor: 'rgba(108, 117, 125, 1)',
            backgroundColor: 'rgba(108, 117, 125, 0.2)',
            borderWidth: 3,
            fill: true,
          },
          {
            label: `${selectedCity} - NO2 Levels`,
            data: cityData.no2Levels,
            borderColor: 'rgba(52, 58, 64, 1)',
            backgroundColor: 'rgba(52, 58, 64, 0.2)',
            borderWidth: 3,
            fill: true,
          },
        ],
      })

      // Process data for heatmap
      const processedHeatmapData = airQualityData
        .filter((entry) => entry.city === selectedCity)
        .map((entry) => ({
          x: new Date(entry.date).getTime(),
          y: entry['Air index'],
        }))

      setHeatmapData(processedHeatmapData)
    }

    processData()
  }, [selectedCity])

  const options = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      heatmap: {
        radius: 25,
      },
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Date',
      },
    },
    yaxis: {
      title: {
        text: 'Air Index',
      },
    },
    title: {
      text: `${selectedCity} - Air Quality Heatmap`,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
  }
  return (
    <div>
      <Navbar />

      <div
        id="map"
        style={{ width: '100%', height: '400px', marginBottom: '20px' }}
      />
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="city-select">Select City: </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {chartData && (
        <div
          className="line-chart-container"
          style={{
            color: '#f0f0f0',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px',
            background: 'rgba(0, 10, 39, 0.685)',
            boxShadow: '0 0 20px rgb(255, 255, 255)',
            textAlign: 'center',
          }}
        >
          <Line
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Levels',
                  },
                },
              },
            }}
          />
        </div>
      )}
      {heatmapData.length > 0 && (
        <div
          className="heatmap-chart-container"
          style={{
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px',
            background: 'rgba(0, 10, 39, 0.685)',
            boxShadow: '0 0 20px rgb(255, 255, 255)',
            textAlign: 'center',
          }}
        >
          <ApexCharts
            options={options}
            series={[{ data: heatmapData }]}
            type="heatmap"
            height={350}
          />
        </div>
      )}
    </div>
  )
}
export default MapWithMarkers
