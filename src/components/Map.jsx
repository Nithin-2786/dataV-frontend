import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles.css' // Import CSS file for styling
import { Chart, registerables } from 'chart.js' // Import Chart.js components
import PieChart from './PieChart'
import hydImage from '../images/Hyd.jpeg'
import mumbaiImage from '../images/mumbai.jpeg'
import delhiImage from '../images/delhi.jpeg'
import ahmedabadImage from '../images/ahmedabad.jpeg'
import ApexCharts from './Circular-graphs'

Chart.register(...registerables)

export default function Map(props) {
  const mapRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [chartData, setChartData] = useState(null)

  const cities = [
    {
      name: 'Hyderabad',
      image: hydImage,
      coords: [17.385044, 78.486671],
    },
    {
      name: 'Mumbai',
      image: mumbaiImage,
      coords: [19.076, 72.8777],
    },
    {
      name: 'Delhi',
      image: delhiImage,
      coords: [28.7041, 77.1025],
    },
    {
      name: 'Ahmedabad',
      image: ahmedabadImage,
      coords: [23.0225, 72.5714],
    },
  ]
  const satelliteLayerRef = useRef(null)
  const streetLayerRef = useRef(null)
  const aerialLayerRef = useRef(null)
  const transportLayerRef = useRef(null)
  const outdoorsLayerRef = useRef(null)
  const SpinalLayerRef = useRef(null)
  const NeighbourLayerRef = useRef(null)

  //const pieChartRef = useRef(null);
  //const [userDataset, setUserDataset] = useState(null);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCityClick = (coords) => {
    mapRef.current.setView(coords, 12)
    setSidebarOpen(false)
  }
  const createMarkers = async (data) => {
    // Define the grid size
    const gridSize = 0.02 // Adjust as needed

    // Initialize an object to store occupied grid cells
    const occupiedGridCells = {}

    for (const region of data) {
      const { latitude, longitude, air_index } = region
      const markerColorClass = calculateTextBoxClass(air_index)
      const textBox = L.divIcon({
        className: markerColorClass,
        html: `<div class="air-index-text">${air_index}</div>`,
        iconSize: [60, 60],
      })

      try {
        // Fetch the address for the marker
        const address = await fetchAddress(latitude, longitude)

        // Create popup content with air index and address
        const popupContent = `<b>Air Index:</b> ${air_index}<br><b>Address:</b> ${address}`

        // Find the grid cell for the marker
        const gridCell = `${Math.floor(latitude / gridSize)},${Math.floor(
          longitude / gridSize,
        )}`

        let marker // Declare marker variable

        // Check if the grid cell is already occupied
        if (occupiedGridCells[gridCell]) {
          // If occupied, adjust the marker position
          const [latOffset, lonOffset] = occupiedGridCells[gridCell]
          const newLat = latitude + latOffset
          const newLon = longitude + lonOffset
          occupiedGridCells[gridCell] = [latOffset + 0.001, lonOffset + 0.001] // Adjust the offset for next marker
          marker = L.marker([newLat, newLon], { icon: textBox }).addTo(
            mapRef.current,
          )
          marker.bindPopup(popupContent)
        } else {
          // If not occupied, add the marker to the grid cell
          occupiedGridCells[gridCell] = [0.001, 0.001] // Initialize offset for this grid cell
          marker = L.marker([latitude, longitude], { icon: textBox }).addTo(
            mapRef.current,
          )
          marker.bindPopup(popupContent)
        }

        // Handle marker click event
        marker.on('click', () => {
          handleMarkerClick(region)
        })

        // Generate freehand outline around the marker
        const outlinePoints = generateOutlinePoints(
          latitude,
          longitude,
          0.015,
          15,
        ) // Adjust radius and number of points as needed
        const polyline = L.polyline(outlinePoints, {
          color: 'blue', // Set the border color of the polyline to blue
          fill: true, // Enable filling inside the polyline
          fillColor: 'blue', // Set the fill color of the polyline to blue
          fillOpacity: 0.5, // Set the opacity of the fill color to 50%
        }).addTo(mapRef.current)
      } catch (error) {
        console.error('Error fetching address:', error)
      }
    }
  }

  const generateOutlinePoints = (
    latitude,
    longitude,
    radius,
    numberOfPoints,
  ) => {
    const outlinePoints = []
    for (let i = 0; i <= numberOfPoints; i++) {
      // Generate random deviations
      const deviationX = (Math.random() - 0.5) * radius * 0.5 // Adjust the factor as needed
      const deviationY = (Math.random() - 0.5) * radius * 0.5 // Adjust the factor as needed

      // Generate random variations in radius and angle
      const randomRadius = radius * (0.5 + Math.random() * 0.5) // Adjust randomness as needed
      const randomAngle =
        (i / numberOfPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.5 // Adjust randomness as needed

      // Calculate coordinates with added deviations
      const x = latitude + (randomRadius + deviationX) * Math.cos(randomAngle)
      const y = longitude + (randomRadius + deviationY) * Math.sin(randomAngle)
      outlinePoints.push([x, y])
    }
    // Connect the last point with the first point to form a closed figure
    outlinePoints.push(outlinePoints[0])
    return outlinePoints
  }

  const handleMarkerClick = async (region) => {
    try {
      const address = await fetchAddress(region.latitude, region.longitude)
      const pollutants = {
        pm25Levels: region.pm25Levels,
        pm10Levels: region.pm10Levels,
        so2Levels: region.so2Levels,
        o3Levels: region.o3Levels,
        coLevels: region.coLevels,
        no2Levels: region.no2Levels,
      }
      setChartData(null)
      updateChartData(pollutants)
      setSelectedMarker({ address, pollutants })
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }
  const updateChartData = (pollutants) => {
    if (pollutants) {
      const totalLevels = Object.values(pollutants).reduce(
        (total, level) => total + level,
        0,
      )
      const labels = Object.keys(pollutants)
      const dataPercentage = labels.map((key) =>
        ((pollutants[key] / totalLevels) * 100).toFixed(2),
      )

      setChartData({
        labels: labels,
        datasets: [
          {
            label: '% of Pollutants',
            data: dataPercentage,
            backgroundColor: [
              '#00ff40', // Brighter green with increased opacity
              '#e70000', // Brighter red with increased opacity
              '#0015d2', // Brighter blue with increased opacity
              '#eeff00', // Brighter black with increased opacity
              '#EE82EE', // Brighter violet with increased opacity
              '#00ffc0', // Brighter yellow with increased opacity
            ],
            borderColor: [
              '#00ff40', // Brighter green with increased opacity
              '#e70000', // Brighter red with increased opacity
              '#0015d2', // Brighter blue with increased opacity
              '#eeff00', // Brighter black with increased opacity
              '#EE82EE', // Brighter violet with increased opacity
              '#00ffc0', // Brighter yellow with increased opacity
            ],
            borderWidth: 1,
          },
        ],
      })
    }
  }

  const fetchAddress = async (latitude, longitude) => {
    const geocodingUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${longitude},${latitude}&outSR=4326`
    const response = await fetch(geocodingUrl)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    const address = data.address.Match_addr
    return address
  }

  const calculateTextBoxClass = (airIndex) => {
    if (airIndex >= 0 && airIndex <= 80) {
      return 'custom-text-box'
    } else if (airIndex > 80 && airIndex <= 93) {
      return 'custom-yellow-text-box'
    } else {
      return 'custom-red-text-box'
    }
  }

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map with satellite view
      mapRef.current = L.map('map').setView([17.385044, 78.486671], 12)

      // Add satellite tile layer
      satelliteLayerRef.current = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a> contributors',
        },
      )

      // Add street tile layer (hidden initially)
      streetLayerRef.current = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a> contributors',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        },
      ).addTo(mapRef.current)

      aerialLayerRef.current = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a> contributors',
        },
      )

      // Add other types of layers (e.g., terrain, hybrid, etc.)
      transportLayerRef.current = L.tileLayer(
        'https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=0a77f2a5178449cabd5d57ad0f37e3a0',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://manage.thunderforest.com/dashboard">Thunder Forest</a> contributors',
        },
      )
      outdoorsLayerRef.current = L.tileLayer(
        'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=0a77f2a5178449cabd5d57ad0f37e3a0',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://manage.thunderforest.com/dashboard">ThunderForest</a> contributors',
        },
      )
      SpinalLayerRef.current = L.tileLayer(
        'https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=0a77f2a5178449cabd5d57ad0f37e3a0',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://manage.thunderforest.com/dashboard">ThunderForest</a> contributors',
        },
      )
      NeighbourLayerRef.current = L.tileLayer(
        'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=0a77f2a5178449cabd5d57ad0f37e3a0',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://manage.thunderforest.com/dashboard">ThunderForest</a> contributors',
        },
      )

      // Create layer control
      const baseLayers = {
        'Satellite View': satelliteLayerRef.current,
        'Street View': streetLayerRef.current,
        'Aerial View': aerialLayerRef.current,
        'Transport View': transportLayerRef.current,
        'Outdoor View': outdoorsLayerRef.current,
        'Hydro View': SpinalLayerRef.current,
        'Neighbourhood View': NeighbourLayerRef.current,
      }
      L.control.layers(baseLayers).addTo(mapRef.current)
      satelliteLayerRef.current.addTo(mapRef.current) // Add satellite view by default
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current.removeLayer(layer)
      }
    })

    if (props.data) {
      createMarkers(props.data)
    }
  }, [props.data])

  const handleMyLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Create a marker for the user's location
          const userLocationMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [32, 48], // Adjust the size as needed
              iconAnchor: [32, 48],
            }),
          }).addTo(mapRef.current)

          // Create a popup with latitude and longitude
          const popupContent = `
            <b>Latitude:</b> ${latitude}<br/>
            <b>Longitude:</b> ${longitude}
          `
          userLocationMarker.bindPopup(popupContent).openPopup()

          // Set the map view to the user's location
          mapRef.current.setView([latitude, longitude], 15)
        },
        (error) => {
          console.error('Error getting current location:', error)
          alert('Failed to fetch location. Please try again later.')
        },
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <div className="container-1">
      <br />
      <br />
      <br />
      <div className="map-container">
        <div id="map"></div>
        <div className="sidebar-container">
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
              {cities.map((city, index) => (
                <div
                  key={index}
                  className="city-item"
                  onClick={() => handleCityClick(city.coords)}
                >
                  <img src={city.image} alt={city.name} />
                  <span>{city.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            {sidebarOpen ? '>>' : '<<'}
          </button>
        </div>
        <div className="my-location-button">
          <button onClick={handleMyLocationClick}>My Location</button>
        </div>
        <div className="pie-chart-container">
          <PieChart chartData={chartData} />
        </div>
      </div>

      {selectedMarker && selectedMarker.pollutants && (
        <div className="radial-graph-container">
          {Object.entries(selectedMarker.pollutants).map(
            ([pollutant, level]) => (
              <ApexCharts key={pollutant} pollutant={pollutant} level={level} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
