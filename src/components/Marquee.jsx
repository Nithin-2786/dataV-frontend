import React, { useRef, useEffect, useState } from 'react';
import './Marquee.css';

const getColorForAQI = (aqi) => {
  if (aqi <= 80) return '#BBFF33';
  if (aqi <= 85) return '#4FFF33';
  if (aqi <= 90) return '#F3FF33';
  if (aqi <= 95) return '#FFB633';
  if (aqi <= 300) return 'red';
  return 'maroon';
};

const Marquee = ({ cities }) => {
  const marqueeRef = useRef(null);
  const [gradientStops, setGradientStops] = useState('');

  useEffect(() => {
    const stops = cities.map((city, index) => {
      const color = getColorForAQI(city.averageAQI);
      const position = (index / cities.length) * 100;
      return `${color} ${position}%`;
    }).join(', ');
    setGradientStops(stops);
  }, [cities]);

  const handleMouseEnter = () => {
    if (marqueeRef.current) {
      marqueeRef.current.classList.add('marquee-paused');
    }
  };

  const handleMouseLeave = () => {
    if (marqueeRef.current) {
      marqueeRef.current.classList.remove('marquee-paused');
    }
  };

  return (
    <div 
      className="marquee" 
      ref={marqueeRef} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      style={{ '--gradient-stops': gradientStops }}
    >
      <div className="marquee-content">
        {cities.concat(cities).map((city, index) => (
          <span 
            key={index} 
            className="marquee-item" 
            style={{ color: getColorForAQI(city.averageAQI) }}
          >
            {city.cityName}: {city.averageAQI.toFixed(2)}
          </span>
        ))}
      </div>
      <div className="color-bar"></div>
      <div className="labels">
        <b><span className="label-item-green">&lt;85</span></b>
        <b><span className="label-item-yellow">85-95</span></b>
        <b><span className="label-item-red">95&lt;</span></b>
      </div>
    </div>
  );
};

export default Marquee;
