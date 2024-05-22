import React, { useEffect, useState } from 'react'
import { Line, Bar, Radar } from 'react-chartjs-2'
import airQualityData from '../air_quality_data.json' // Ensure the path is correct

const AirQualityChart = ({ selectedCity }) => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    // Process air quality data to chart.js format
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
    }

    processData()
  }, [selectedCity])
  const heatMapData = {
    labels: chartData ? chartData.labels : [],
    datasets: [
      {
        data: airQualityData
          .filter((entry) => entry.city === selectedCity)
          .map((entry) => ({
            x: entry.longitude,
            y: entry.latitude,
            value: entry['Air index'], // Value for the heat map intensity
          })),
        borderWidth: 1,
      },
    ],
  }

  return (
    <div
      className="air-quality-chart-container"
      style={{
        color: '#f0f0f0',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        width: '95%',
        maxWidth: '100%',
        background: 'rgba(0, 0, 0, 0)',
        boxShadow: '5px 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
      }}
    >
      {/* Check if chartData is not null before rendering */}
      {chartData && chartData.labels && (
        <>
          <div
            className="chart-container"
            style={{
              background: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <h2 style={{ color: '#000000', marginBottom: '20px' }}>
              Line Chart
            </h2>
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                      color: '#000000', // X-axis title color
                      font: {
                        size: 16, // X-axis title font size
                      },
                    },
                    ticks: {
                      color: '#000000', // X-axis tick color
                    },
                    grid: {
                      color: '#000000', // X-axis grid lines color
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Levels',
                      color: '#000000', // Y-axis title color
                      font: {
                        size: 16, // Y-axis title font size
                      },
                    },
                    ticks: {
                      color: '#000000', // Y-axis tick color
                    },
                    grid: {
                      color: '#000000', // Y-axis grid lines color
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#000000', // Legend label color
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                    titleColor: '#f0f0f0', // Tooltip title color
                    bodyColor: '#f0f0f0', // Tooltip body color
                  },
                },
              }}
            />
          </div>
          <div
            className="chart-container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <div
              className="chart-container"
              style={{
                flex: 1,
                background: '#f0f0f0',
                padding: '20px',
                borderRadius: '8px',
              }}
            >
              <h2 style={{ color: '#000000', marginBottom: '20px' }}>
                Bar Chart
              </h2>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                        color: '#000000', // X-axis title color
                        font: {
                          size: 16, // X-axis title font size
                        },
                      },
                      ticks: {
                        color: '#000000', // X-axis tick color
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)', // X-axis grid lines color
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Levels',
                        color: '#000000', // Y-axis title color
                        font: {
                          size: 16, // Y-axis title font size
                        },
                      },
                      ticks: {
                        color: '#000000', // Y-axis tick color
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)', // Y-axis grid lines color
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: '#000000', // Legend label color
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                      titleColor: '#f0f0f0', // Tooltip title color
                      bodyColor: '#f0f0f0', // Tooltip body color
                    },
                  },
                }}
              />
            </div>
            <div
              className="chart-container"
              style={{
                flex: 1,
                background: '#f0f0f0',
                padding: '20px',
                borderRadius: '8px',
              }}
            >
              <h2 style={{ color: '#000000', marginBottom: '20px' }}>
                Stacked Bar Chart
              </h2>
              <Bar
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: 'PM2.5 Levels',
                      data: chartData.datasets[1].data,
                      backgroundColor: 'rgba(220, 53, 69, 0.5)',
                    },
                    {
                      label: 'PM10 Levels',
                      data: chartData.datasets[2].data,
                      backgroundColor: 'rgba(40, 167, 69, 0.5)',
                    },
                    {
                      label: 'SO2 Levels',
                      data: chartData.datasets[3].data,
                      backgroundColor: 'rgba(255, 193, 7, 0.5)',
                    },
                    {
                      label: 'O3 Levels',
                      data: chartData.datasets[4].data,
                      backgroundColor: 'rgba(23, 162, 184, 0.5)',
                    },
                    {
                      label: 'CO Levels',
                      data: chartData.datasets[5].data,
                      backgroundColor: 'rgba(108, 117, 125, 0.5)',
                    },
                    {
                      label: 'NO2 Levels',
                      data: chartData.datasets[6].data,
                      backgroundColor: 'rgba(52, 58, 64, 0.5)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                        color: '#000000',
                      },
                      stacked: true,
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Levels',

                        color: '#000000',
                      },
                      stacked: true,
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: '#000000',
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </div>
          <div
            className="chart-container"
            style={{
              background: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            <h2 style={{ color: '#000000', marginBottom: '20px' }}>
              Radar Chart
            </h2>
            <Radar
              data={chartData}
              options={{
                responsive: true,
                elements: {
                  line: {
                    borderWidth: 2, // Increase the line thickness
                    borderColor: '#000000', // Set the line color to black for contrast
                  },
                },
                scales: {
                  r: {
                    angleLines: {
                      color: '#000000', // Color of radial lines
                    },
                    pointLabels: {
                      font: {
                        size: 14, // Font size of the labels on the points
                        color: '#000000', // Color of the labels on the points
                      },
                    },
                    ticks: {
                      color: '#000000', // Color of the scale labels
                      backdropColor: 'rgba(255, 255, 255, 0)', // Background color behind the scale labels
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#000000', // Legend label color
                    },
                  },
                  tooltip: {
                    backgroundColor: '#000000', // Tooltip background color
                    titleColor: '#ffffff', // Tooltip title color
                    bodyColor: '#ffffff', // Tooltip body color
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AirQualityChart
