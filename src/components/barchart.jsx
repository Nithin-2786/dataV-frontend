import React from 'react'
import ReactApexChart from 'react-apexcharts'
import './login.css'
import AirQualityChart from './AirQualityChart' // Import the AirQualityChart component

const cities = ['Hyderabad', 'Delhi', 'Mumbai', 'Ahmedabad', 'Chennai']

class BarChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCity: 'Hyderabad',
      series: [],
      options: {
        chart: {
          type: 'bar',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              console.log(config.dataPointIndex)
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            barHeight: '70%',
            distributed: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(2)
          },
          style: {
            fontSize: '12px',
            colors: ['#fff'],
          },
        },
        title: {
          text: 'Average AQI by City',
          align: 'center',
          style: {
            fontSize: '20px',
            color: '#fff',
          },
        },
        subtitle: {
          text: 'Air Quality Index',
          align: 'center',
          style: {
            fontSize: '16px',
            color: '#fff',
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '14px',
              colors: '#fff',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '14px',
              colors: '#fff',
            },
          },
        },
        legend: {
          labels: {
            colors: '#fff',
          },
        },
        colors: [],
      },
      treemapSeries: [],
      treemapOptions: {
        chart: {
          type: 'treemap',
          toolbar: {
            show: false,
          },
        },
        title: {
          text: 'Average AQI by City (Treemap)',
          align: 'center',
          style: {
            fontSize: '20px',
            color: '#fff',
          },
        },
        colors: [],
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: true,
            useFillColorAsStroke: true,
            enableTooltip: true,
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
              },
            },
          },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return `Average AQI: ${value}`
            },
          },
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            console.log(`Selected City: ${config.data.x}`)
            console.log(`Average AQI: ${config.data.y}`)
          },
        },
      },
    }
  }

  componentDidMount() {
    this.updateChart(this.props.data)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.updateChart(this.props.data)
    }
  }

  updateChart(data) {
    if (data && data.length > 0) {
      const seriesData = data.map((city) => city.averageAQI)
      const categories = data.map((city) => city.cityName)
      const colors = this.generateColorPalette(data.length)
      const treemapData = data.map((city) => ({
        x: city.cityName,
        y: city.averageAQI,
      }))

      // Shuffle treemapData to randomly arrange treemap
      treemapData.sort(() => Math.random() - 0.5)

      this.setState({
        series: [{ data: seriesData }],
        options: {
          ...this.state.options,
          xaxis: {
            categories: categories,
          },
          colors: colors,
        },
        treemapSeries: [
          {
            data: treemapData,
          },
        ],
        treemapOptions: {
          ...this.state.treemapOptions,
          colors: colors,
          plotOptions: {
            treemap: {
              distributed: true,
              enableShades: false,
              useFillColorAsStroke: true,
              enableTooltip: true,
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '14px',
                  fontWeight: 'normal',
                  color: '#fff',
                  zIndex: -1, // Ensure labels are behind the colors
                },
              },
            },
          },
        },
      })
    }
  }

  generateColorPalette(numColors) {
    const palette = [
      '#388E3C', // Darker shade of #66BB6A
      '#FBC02D', // Darker shade of #FFEB3B
      '#1976D2', // Darker shade of #42A5F5
      '#E64A19', // Darker shade of #FF8A65
      '#9575CD', // Darker shade of #D1C4E9
      '#D81B60', // Darker shade of #FF80AB
      '#607D8B', // Darker shade of #90A4AE
      '#F57C00', // Darker shade of #FFB74D
      '#78909C', // Darker shade of #B0BEC5
      '#6D4C41', // Darker shade of #A1887F
    ]
    return palette.slice(0, numColors)
  }
  handleCityChange = (e) => {
    this.setState({ selectedCity: e.target.value })
  }

  render() {
    const { selectedCity } = this.state
    return (
      <div>
        <div className="bar-chart-container">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={400}
          />
        </div>
        <div className="treemap-container">
          <ReactApexChart
            options={this.state.treemapOptions}
            series={this.state.treemapSeries}
            type="treemap"
            height={400}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="city-select" style={{ marginRight: '10px' }}>
            Select City:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={this.handleCityChange} // Use the method to handle change event
            style={{
              padding: '5px 10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#f0f0f0',
              color: '#333',
            }}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {/* Render AirQualityChart component */}
          <AirQualityChart selectedCity={selectedCity} />
        </div>
      </div>
    )
  }
}

export default BarChart
