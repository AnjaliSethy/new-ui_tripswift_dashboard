import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies for handling tokens

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination"; // Import Pagination

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import DataTable from "examples/Tables/DataTable";
import CountUp from "react-countup";

// Data for charts
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

const rowsPerPage = 5; // Define how many rows per page

function Analytics() {
  const { sales } = reportsLineChartData;

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1); // Current page state

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/amadeus/analytic/details?page=${page}&limit=${rowsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response is successful and contains the expected data
        if (response.data.success) {
          setAnalyticsData(response.data);
          setLoading(false);
        } else {
          throw new Error("API response was not successful");
        }
      } catch (err) {
        console.error(
          "Error fetching analytics data:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to fetch analytics data");
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [page]); // Fetch data when the page changes

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

  const { totalRevenue, totalBookings, validUsers, totalUsers } = analyticsData;

  // Process rows for DataTable
  const rows = validUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((user) => ({
    userId: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {user.userId}
        </MDTypography>
      </MDBox>
    ),
    name: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {`${user.firstName} ${user.lastName}`}
        </MDTypography>
      </MDBox>
    ),
    email: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {user.email}
        </MDTypography>
      </MDBox>
    ),
    bookingCount: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {user.bookingCount}
        </MDTypography>
      </MDBox>
    ),
  }));

  // Calculate total pages based on validUsers length
  const totalPages = Math.ceil(validUsers.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value); // Update the current page
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4}>
        {/* Top KPIs Section */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="show_chart"
                title="Total Revenue"
                description="This Month's Total Revenue"
                value={
                  <CountUp
                    start={0}
                    end={totalRevenue}
                    prefix="$"
                    separator=","
                    duration={2} // Duration of the animation (seconds)
                  />
                }
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="trending_up"
                title="Total Users"
                description="All Registered Users"
                value={<CountUp start={0} end={totalUsers} duration={2} separator="," />}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="bar_chart"
                title="Total Bookings"
                description="Bookings Completed This Month"
                value={<CountUp start={0} end={totalBookings} duration={2} separator="," />}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultInfoCard
                icon="people"
                title="Active Users"
                description="Users Active Today"
                value={<CountUp start={0} end={validUsers.length} duration={2} separator="," />}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Charts Section */}
        <MDBox mb={3} mt={6}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <ReportsLineChart
                color="success"
                title="Monthly Revenue Trend"
                description="Performance over the last 6 months"
                date="updated 4 min ago"
                chart={sales}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ReportsBarChart
                color="info"
                title="Signup Breakdown"
                description="Daily signup data for this month"
                date="updated just now"
                chart={reportsBarChartData}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Active Users Table */}
        <MDBox pt={4} pb={3}>
          <Grid container spacing={6}>
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
                    Active Users
                  </MDTypography>
                </MDBox>
                <MDBox pt={3} pb={3}>
                  <DataTable
                    table={{
                      columns: [
                        { Header: "User ID", accessor: "userId" },
                        { Header: "User Name", accessor: "name" },
                        { Header: "User Email", accessor: "email" },
                        { Header: "Bookings", accessor: "bookingCount", align: "center" },
                      ],
                      rows,
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                  {/* Pagination UI */}
                  <MDBox display="flex" justifyContent="center" my={3}>
                    <Pagination
                      count={totalPages}
                      color="info"
                      page={page}
                      onChange={handlePageChange}
                    />
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Insights Section */}
          <MDBox>
            <Grid container spacing={3} mb={4} mt={1}>
              <Grid item xs={12} lg={6}>
                <DefaultInfoCard
                  icon="pie_chart"
                  title="Traffic Sources"
                  description="Breakdown of website traffic sources"
                  value="60% Organic, 25% Paid, 15% Referral"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DefaultInfoCard
                  icon="trending_down"
                  title="Churn Rate"
                  description="Percentage of users lost this month"
                  value="1.5%"
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
