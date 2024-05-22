import { React, useEffect } from "react";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function PieChart(props) {
  useEffect(() => {
    if (props.chartData) {
      const ctx = document.getElementById('pie-chart').getContext('2d');
      const existingChart = Chart.getChart(ctx);

      if (existingChart) {
        existingChart.destroy(); // Destroy existing chart if it exists
      }

      // Set pie chart height to match map height
      new Chart(ctx, {
        type: 'pie',
        data: props.chartData,
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'black', // Change label color to black
                font: {
                  size: 14, // Increase font size for better visibility
                },
              },
            },
          },
          elements: {
            arc: {
              borderWidth: 2, // Increase border thickness
            },
          },
        },
      });
    }
  }, [props.chartData]);

  return (
    <canvas id="pie-chart" width="300" height="300"></canvas>
    // Adjust the width and height attributes as needed to reduce the size of the pie chart
  );
}
