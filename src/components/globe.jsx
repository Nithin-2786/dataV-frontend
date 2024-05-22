import React, { useEffect, useState, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';

import { COUNTRIES_DATA } from './countries_data';
import HEX_DATA from './countries_hex_data.json';

const getRandomCountry = () => {
  return COUNTRIES_DATA[Math.floor(Math.random() * COUNTRIES_DATA.length)];
};

export default function CustomGlobe() {
  const globeEl = useRef();
  const country = getRandomCountry();
  const [selectedCountry, setSelectedCountry] = useState({
    lat: country.latitude,
    lng: country.longitude,
    label: country.name,
  });
  const [hex, setHex] = useState({ features: [] });

  useEffect(() => {
    setHex(HEX_DATA);
  }, []);

  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      (async () => {
        const country = getRandomCountry();
        setSelectedCountry({
          lat: country.latitude,
          lng: country.longitude,
          label: country.name,
        });
      })();
    }, 3000); //Every 3 seconds
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 1.2;

    const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
    globeEl.current.pointOfView(MAP_CENTER, 0);
  }, [globeEl]);

  useEffect(() => {
    const countryLocation = {
      lat: selectedCountry.lat,
      lng: selectedCountry.lng,
      altitude: 1.5,
    };

    globeEl.current.pointOfView(countryLocation, 0);
  }, [selectedCountry]);

  return (
    <Globe
      ref={globeEl}
      width={450}
      height={450}
      
      backgroundColor='#0000'
      labelsData={[selectedCountry]}
      labelText={'label'}
      labelSize={5}
      labelColor={useCallback(() => '#ffff', [])}
      labelDotRadius={0.9}
      labelAltitude={0.05}
      hexPolygonsData={hex.features}
      hexPolygonResolution={3} //values higher than 3 makes it buggy
      hexPolygonMargin={0.62}
      hexPolygonColor={useCallback(() => '#fff', [])} // Change hexagon color
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" // Use colorful earth image
    />
  );
}
