import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles.css'; // Import CSS file for styling

import { Chart, registerables } from 'chart.js'; // Import Chart.js components
import PieChart from './PieChart';
Chart.register(...registerables);

export default function Map(props) {
  const mapRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to track sidebar open/close
  const cities = [
    { name: 'Hyderabad', image: '/hyderabad.jpg', coords: [17.385044, 78.486671] },
    { name: 'Mumbai', image: '/mumbai.jpg', coords: [19.0760, 72.8777] },
    { name: 'Delhi', image: '/delhi.jpg', coords: [28.7041, 77.1025] },
    { name: 'Bangalore', image: '/bangalore.jpg', coords: [12.9716, 77.5946] },
  ];

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCityClick = (coords) => {
    mapRef.current.setView(coords, 12);
    setSidebarOpen(false);
  };

  useEffect(() => {
    // Your existing useEffect code here
  }, [props.data]);

  const handleMyLocationClick = () => {
    // Your existing handleMyLocationClick function
  };

  return (
    <div>
      <div className="map-container">
        <div id="map"></div>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Sidebar content */}
          <div className="sidebar-content">
            {cities.map((city, index) => (
              <div key={index} className="city-item" onClick={() => handleCityClick(city.coords)}>
                <img src={city.image} alt={city.name} />
                <span>{city.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="my-location-button">
          <button onClick={handleMyLocationClick}>My Location</button>
        </div>
        <div className="pie-chart-container">
          <PieChart chartData={chartData} />
        </div>
        {/* Sidebar toggle button */}
        <button className="sidebar-toggle" onClick={handleToggleSidebar}>
          {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
      </div>
    </div>
  );
}
