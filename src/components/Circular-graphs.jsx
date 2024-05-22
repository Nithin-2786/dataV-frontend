import React from 'react'
import ReactApexChart from 'react-apexcharts'
import '../styles.css' // Import CSS file for styling

class ApexChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      series: [props.level],
      options: {
        chart: {
          type: 'radialBar',
          // height: '200px', // Adjust height as needed
          // width: '200px', // Adjust width as needed
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '60%',
            },
            track: {
              strokeWidth: '120%',
            },
            dataLabels: {
              name: {
                show: true,
                color: '#020014',
                fontsize: 'auto',
              },

              value: {
                offsetY: 5,
                color: '#020014',
                fontSize: 'auto',
              },
            },
            
          },
        },
        labels: [props.pollutant],
        fill: {
          colors: [getColor(this.props.level, this.props.pollutant)],
        },
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.level !== this.props.level ||
      prevProps.pollutant !== this.props.pollutant
    ) {
      this.setState({
        series: [this.props.level],
        options: {
          ...this.state.options,
          labels: [this.props.pollutant],
          fill: {
            colors: [getColor(this.props.level, this.props.pollutant)],
          },
        },
      })
    }
  }

  render() {
    return (
      <div className="apex-chart-container">
        {' '}
        {/* Apply external CSS class */}
        <div className="chart-wrapper">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
          />
        </div>
      </div>
    )
  }
}

function getColor(level, pollutant) {
  switch (pollutant) {
    case 'pm25Levels':
      if (level <= 12) return '#0f0' // Light green
      if (level <= 35.4) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    case 'pm10Levels':
      if (level <= 54) return '#0f0' // Light green
      if (level <= 154) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    case 'so2Levels':
      if (level <= 35) return '#0f0' // Light green
      if (level <= 75) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    case 'o3Levels':
      if (level <= 54) return '#0f0' // Light green
      if (level <= 70) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    case 'coLevels':
      if (level <= 4.4) return '#0f0' // Light green
      if (level <= 9.4) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    case 'no2Levels':
      if (level <= 53) return '#0f0' // Light green
      if (level <= 100) return '#FFD700' // Gold
      return '#FF6347' // Tomato red
    default:
      return '#FF6347' // Tomato red
  }
}

export default ApexChart
