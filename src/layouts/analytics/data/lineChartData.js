const lineChartData = {
  labels: ["July", "August", "September", "October", "November", "December"], // X-axis labels
  datasets: [
    {
      label: "Revenue", // Label for the chart
      tension: 0, // Straight lines between points
      borderWidth: 3, // Thickness of the line
      pointRadius: 6, // Makes data points large and visible
      pointBackgroundColor: "rgba(255, 255, 255, 1)", // White background for points
      pointBorderColor: "rgba(75, 192, 192, 1)", // Border color of data points
      pointBorderWidth: 3, // Thickness of the point border
      borderColor: "rgba(75, 192, 192, 1)", // Line color
      backgroundColor: "rgba(75, 192, 192, 0.2)", // Slightly shaded fill below the line
      fill: true, // Enables fill below the line
      data: [4500, 5000, 4000, 4800, 5200, 6000], // Revenue data
    },
  ],
};

export default lineChartData;
