const barChartData = {
  labels: [
    "01 Jan",
    "02 Jan",
    "03 Jan",
    "04 Jan",
    "05 Jan",
    "06 Jan",
    "07 Jan",
    "08 Jan",
    "09 Jan",
    "10 Jan",
  ], // X-axis labels
  datasets: [
    {
      label: "Signups", // Label for the legend
      backgroundColor: "rgba(54, 162, 235, 0.6)", // Bar fill color
      borderColor: "rgba(54, 162, 235, 1)", // Bar border color
      borderWidth: 1, // Bar border thickness
      hoverBackgroundColor: "rgba(54, 162, 235, 0.8)", // Color when hovering
      hoverBorderColor: "rgba(54, 162, 235, 1)", // Border color when hovering
      data: [45, 67, 78, 81, 56, 55, 40, 50, 70, 90], // Signup data
    },
  ],
};

export default barChartData;
