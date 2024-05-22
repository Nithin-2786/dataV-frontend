import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import AboutUs from './components/about' // Assuming the file name is AboutUs.jsx or AboutUs.js
import News from './components/news'
import LoginSignup from './components/signup'
import MapWithMarkers from './components/testmap'
import HeatMap from './components/heatmap'
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/testmap" element={<MapWithMarkers />} />
        <Route path="/heatmap" element={<HeatMap />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
