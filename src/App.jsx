import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './components/Map';
import Navbar from './components/Navbar';
import AboutUs from './components/about';
import News from './components/news';
import './styles.css';
import BarChart from './components/barchart';
import LoginSignup from './components/signup';
import MapWithMarkers from './components/testmap';
import Upload from "./components/uploadedfiles";
import HeatMap from './components/heatmap';
import Marquee from './components/Marquee'; // Import the Marquee component

const Popup = ({ city, onClose }) => (
  <div className="popup">
    <div className="popup-content">
      <span className="close-button" onClick={onClose}>
        &times;
      </span>
      <h3>{city.cityName}</h3>
      <p>Average AQI: {city.averageAQI.toFixed(2)}</p>
      {/*<p>Date: Undefined {city.date}</p>*/}
    </div>
  </div>
);

export default function App() {
  const [region, setRegion] = useState([]);
  const [reloadMap, setReloadMap] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [cityAverages, setCityAverages] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [uploadKey, setUploadKey] = useState(0); // Add this state for forcing re-render of Upload component

  const processData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Expected an array of data objects");
      return;
    }

    const processedData = [];
    const cityMap = {};

    data.forEach(coord => {
      const {
        latitude,
        longitude,
        city,
        air_index,
        pm25Levels,
        pm10Levels,
        so2Levels,
        o3Levels,
        coLevels,
        no2Levels,
        date
      } = coord;

      const coordData = {
        latitude,
        longitude,
        air_index,
        pm25Levels,
        pm10Levels,
        so2Levels,
        o3Levels,
        coLevels,
        no2Levels,
        city,
        date,
      };

      processedData.push(coordData);

      if (!cityMap[city]) {
        cityMap[city] = { totalAQI: air_index, count: 1, dates: [date] };
      } else {
        cityMap[city].totalAQI += air_index;
        cityMap[city].count++;
        cityMap[city].dates.push(date);
      }
    });

    const cityAverages = [];
    for (const cityName in cityMap) {
      if (cityMap.hasOwnProperty(cityName)) {
        const { totalAQI, count, dates } = cityMap[cityName];
        const averageAQI = totalAQI / count;
        cityAverages.push({ cityName, averageAQI, dates });
      }
    }

    cityAverages.sort((a, b) => a.averageAQI - b.averageAQI);
    setRegion(processedData);
    setCityAverages(cityAverages);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setAlertMessage('No file selected.');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://datav-backend-1.onrender.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': accessToken
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = JSON.parse(e.target.result);
          processData(fileData);
          setReloadMap(prev => !prev);
          setAlertMessage('File uploaded successfully!');
          setAlertType('success');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            setAlertMessage('Loading data...');
            setAlertType('loading');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }, 3000);
          setUploadKey(prevKey => prevKey + 1); // Force re-render of Upload component
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          setAlertMessage('Error parsing JSON.');
          setAlertType('error');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      };
      reader.onerror = () => {
        setAlertMessage('Failed to read file. Please try again.');
        setAlertType('error');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error during file upload:', error.message);
      setAlertMessage('Failed to upload file. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('dataset1.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        processData(data);
      } catch (error) {
        console.error('Error while fetching dataset:', error);
        setAlertMessage('Error while fetching dataset.');
        setAlertType('error');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };

    fetchData();

    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleLogin = (token) => {
    setLogin(true);
    setAccessToken(token);
    sessionStorage.setItem("accessToken", token);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} />
        Choose File
      </div>
      {showAlert && (
        <div className={`alert-box alert-${alertType}`}>
          <span>{alertMessage}</span>
        </div>
      )}
      <Marquee cities={cityAverages} /> {/* Add the Marquee component here */}
      <Routes>
        <Route path="/" element={<Map key={reloadMap} data={region} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<LoginSignup onLogin={handleLogin} />} />
        <Route path="/testmap.jsx" element={<MapWithMarkers />} />
        <Route path="/heatmap" element={<HeatMap />} />
      </Routes>
      <div id="content-container">
        <div id="table-container">
          <h3 className="rankings-header">City Rankings</h3>
          <table id="data-table">
            <thead>
              <tr>
                <th>City Name</th>
                <th>AQI</th>
              </tr>
            </thead>
            <tbody>
              {cityAverages.map((city, index) => (
                <tr key={index} onClick={() => { setSelectedCity(city); setShowPopup(true); }}>
                  <td>{city.cityName}</td>
                  <td>{city.averageAQI.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="chart-container">
          <BarChart data={cityAverages} />
        </div>
      </div>
      {showPopup && selectedCity && (
        <Popup
          city={selectedCity}
          onClose={() => setShowPopup(false)}
        />
      )}
      <Upload key={uploadKey} accessToken={accessToken} processData={processData} /> {/* Add key prop to force re-render */}
    </div>
  );
}
