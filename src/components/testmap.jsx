import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from './Navbar'
import '../styles.css'

const MapWithMarkers = () => {
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) {
      // If the map instance already exists, do not reinitialize
      return
    }

    // Initialize map
    mapRef.current = L.map('map').setView([17.3575, 78.3147], 12) // Set initial view to Himayat Sagar Lake

    // Add a custom tile layer (CartoDB Positron)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(mapRef.current)

    // Define coordinates for Himayat Sagar Lake border
    const himayatSagarBorderCoordinates = [
      [17.3817, 78.2869],
      [17.3764, 78.3086],
      [17.3687, 78.3086],
      [17.366, 78.3185],
      [17.3575, 78.3147],
      [17.3554, 78.315],
      [17.3527, 78.3141],
      [17.3495, 78.3174],
      [17.3494, 78.3244],
      [17.3547, 78.3358],
      [17.3624, 78.3365],
      [17.372, 78.3415],
      [17.3747, 78.3448],
      [17.3764, 78.3448],
      [17.3811, 78.3349],
      [17.3817, 78.328], // back to the starting point
    ]

    // Create a polyline to represent the lake border with custom styling
    const lakeBorder = L.polyline(himayatSagarBorderCoordinates, {
      color: 'blue',
      weight: 3,
      dashArray: '5, 10', // Dashed line
    }).addTo(mapRef.current)

    // Fit map bounds to include the lake border
    mapRef.current.fitBounds(himayatSagarBorderCoordinates)

    // Add zoom control and scale bar
    L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
    L.control.scale().addTo(mapRef.current)

    // Add markers for cities with custom icons and popups
    const cityMarkers = {
      Hyderabad: [17.385, 78.4867],
      Delhi: [28.7041, 77.1025],
      Mumbai: [19.076, 72.8777],
      Ahmedabad: [23.0225, 72.5714],
      Chennai: [13.0827, 80.2707],
    }

    const customIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // Custom icon URL
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png', // Custom shadow URL
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

    // Cleanup map instance on component unmount
    return () => {
      mapRef.current.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div>
      <Navbar />

      <div
        id="map"
        style={{ width: '100%', height: '400px', marginBottom: '20px' }}
      />
    </div>
  )
}

export default MapWithMarkers
