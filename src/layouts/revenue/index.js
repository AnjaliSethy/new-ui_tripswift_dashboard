import React, { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton"; // Import MDButton

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard"; // Import ComplexStatisticsCard
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Revenue() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [totalBookings, setTotalBookings] = useState(0); // Total bookings state
  const [totalRevenue, setTotalRevenue] = useState(0); // Total revenue state
  const [averageBooking, setAverageBooking] = useState(0); // Average booking state
  const [animatedBookings, setAnimatedBookings] = useState(0); // Animated bookings state
  const [animatedRevenue, setAnimatedRevenue] = useState(0); // Animated revenue state
  const [animatedAverage, setAnimatedAverage] = useState(0); // Animated average booking state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch data from the API
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/amadeus/top/revenue/hotels");
        const { data } = response.data;

        // Calculate total bookings and total revenue
        const totalBookingsCount = data.reduce((acc, item) => acc + item.totalBookings, 0);
        const totalRevenueAmount = data.reduce((acc, item) => acc + item.totalRevenue, 0); // Assuming totalRevenue is part of the response
        const averageBookingAmount =
          totalBookingsCount > 0 ? totalRevenueAmount / totalBookingsCount : 0;

        // Set state for total bookings, total revenue, and average booking
        setTotalBookings(totalBookingsCount);
        setTotalRevenue(totalRevenueAmount);
        setAverageBooking(averageBookingAmount);

        // Define table columns
        const tableColumns = [
          { Header: "Hotel ID", accessor: "hotelId" },
          { Header: "Hotel Name", accessor: "hotelName" },
          { Header: "Location", accessor: "geoCode" },
          { Header: "Total Bookings", accessor: "totalBookings" },
          { Header: "Action", accessor: "action" },
        ];

        // Map API data to table rows
        const tableRows = data.map((item) => ({
          hotelId: item.hotelId,
          hotelName: item.hotelName,
          totalBookings: item.totalBookings,
          geoCode: item.geoCode || "Not Available", // Handle null or empty geoCode
          action: (
            <MDButton
              variant="contained"
              color="info"
              size="small"
              onClick={() =>
                navigate(`/hotel/${item.hotelId}?name=${encodeURIComponent(item.hotelName)}`)
              } // Pass hotel name as query param
            >
              View
            </MDButton>
          ),
        }));

        setColumns(tableColumns);
        setRows(tableRows);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchRevenueData();
  }, []);

  // Counting animation effect
  useEffect(() => {
    if (!loading) {
      const duration = 2000; // Duration of the counting animation in milliseconds
      const stepTime = 50; // Time between each step in milliseconds
      const totalSteps = duration / stepTime;

      const bookingsStep = Math.ceil(totalBookings / totalSteps);
      const revenueStep = Math.ceil(totalRevenue / totalSteps);
      const averageStep = Math.ceil(averageBooking / totalSteps);

      let bookingsCount = 0;
      let revenueCount = 0;
      let averageCount = 0;

      const interval = setInterval(() => {
        if (bookingsCount < totalBookings) {
          bookingsCount += bookingsStep;
          setAnimatedBookings(Math.min(bookingsCount, totalBookings));
        }
        if (revenueCount < totalRevenue) {
          revenueCount += revenueStep;
          setAnimatedRevenue(Math.min(revenueCount, totalRevenue));
        }
        if (averageCount < averageBooking) {
          averageCount += averageStep;
          setAnimatedAverage(Math.min(averageCount, averageBooking));
        }
        if (
          bookingsCount >= totalBookings &&
          revenueCount >= totalRevenue &&
          averageCount >= averageBooking
        ) {
          clearInterval(interval);
        }
      }, stepTime);
    }
  }, [loading, totalBookings, totalRevenue, averageBooking]);

  // Display loading screen
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox py={3} textAlign="center">
                  <MDTypography variant="h6" color="info">
                    Loading data, please wait...
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Display error screen
  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox py={3} textAlign="center">
                  <MDTypography variant="h6" color="error">
                    {error}
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Main table content
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} pb={4}>
          {/* Cards Section */}
          <Grid item xs={12} md={4}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Total Bookings"
              count={animatedBookings}
              percentage={{
                color: "success",
                amount: "+0%", // You can calculate the percentage change if needed
                label: "compared to last week",
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Total Revenue"
              count={animatedRevenue.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
              percentage={{
                color: "success",
                amount: "+0%", // You can calculate the percentage change if needed
                label: "compared to last month",
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Average Booking"
              count={animatedAverage.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
              percentage={{
                color: "success",
                amount: "+0%", // You can calculate the percentage change if needed
                label: "compared to last week",
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={6} pt={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Revenue Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Revenue;
