import React, { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { point, featureCollection } from '@turf/helpers'
import hexGrid from '@turf/hex-grid'
import Navbar from './Navbar' // Import Navbar component
const HeatmapOverlay = require('leaflet-heatmap/leaflet-heatmap.js')

const Heatmap = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('india_aqi_data.json') // Assuming data is stored in a JSON file named "india_aqi_data.json"
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        return data
      } catch (error) {
        console.error(error.message)
        return null
      }
    }

    const initializeMaps = async () => {
      const data = await fetchData()
      if (!data) return

      const testData = {
        max: 600,
        data: data,
      }

      const cfg = {
        radius: 3,
        maxOpacity: 0.8, // Adjusted maxOpacity to a valid value
        scaleRadius: true,
        useLocalExtrema: false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'aqi',
      }

      // Initialize weighted heat map
      const heatmapLayer = new HeatmapOverlay(cfg)
      const map1 = L.map('heatmap1').setView([20.5937, 78.9629], 5) // Centered on India
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '...',
        maxZoom: 18,
      }).addTo(map1)
      heatmapLayer.addTo(map1)
      heatmapLayer.setData(testData)

      // Initialize cell heat map
      const map2 = L.map('heatmap2').setView([20.5937, 78.9629], 5) // Centered on India
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '...',
        maxZoom: 18,
      }).addTo(map2)

      // Create hexgrid
      const bbox = [68.1766451354, 6.75189646488, 97.4025614766, 35.5087007833] // Bounding box for India
      const cellSize = 0.5 // Adjust cell size as needed
      const hexgrid = hexGrid(bbox, cellSize, { units: 'degrees' })

      // Convert heatmap data to Turf points
      const points = data.map((d) => point([d.lng, d.lat], { aqi: d.aqi }))
      const pointsFeatureCollection = featureCollection(points)

      // Calculate density for each hex cell
      hexgrid.features.forEach((hex) => {
        let totalWeight = 0
        pointsFeatureCollection.features.forEach((pt) => {
          const [hexX, hexY] = hex.geometry.coordinates[0][0]
          const [ptX, ptY] = pt.geometry.coordinates
          if (Math.sqrt((hexX - ptX) ** 2 + (hexY - ptY) ** 2) < cellSize) {
            totalWeight += pt.properties.aqi
          }
        })
        hex.properties.density = totalWeight
      })

      // Define a color scale
      const getColor = (density) => {
        return density > 100
          ? '#3f007d' // Dark purple
          : density > 50
          ? '#2e759f' // Dark blue
          : density > 20
          ? '#2e8d6b' // Dark green
          : density > 10
          ? '#847e00' // Dark yellow
          : density > 5
          ? '#a35709' // Dark orange
          : density > 1
          ? '#840067' // Dark pink
          : '#ffffff' // Dark gray
      }

      // Add the hexgrid with heat values to the cell heat map
      L.geoJSON(hexgrid, {
        style: function (feature) {
          const density = feature.properties.density
          return {
            color: 'blue',
            weight: 0.5,
            fillOpacity: 0.6,
            fillColor: getColor(density),
          }
        },
        onEachFeature: function (feature, layer) {
          const density = feature.properties.density
          layer.bindTooltip(`AQI: ${density}`)
        },
      }).addTo(map2)
    }

    initializeMaps()

    // Clean up the maps when the component is unmounted
    return () => {
      if (L.DomUtil.get('heatmap1')) {
        L.DomUtil.get('heatmap1')._leaflet_id = null
      }
      if (L.DomUtil.get('heatmap2')) {
        L.DomUtil.get('heatmap2')._leaflet_id = null
      }
    }
  }, [])

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <div id="heatmap1" style={{ height: '80vh', width: '80%' }}></div>{' '}
        {/* Weighted Heat Map */}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <div id="heatmap2" style={{ height: '80vh', width: '80%' }}></div>{' '}
        {/* Cell Heat Map */}
      </div>
    </div>
  )
}

export default Heatmap
