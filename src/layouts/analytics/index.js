// /**
// =========================================================
// * Material Dashboard 2 React - Analytics Layout
// =========================================================
// */

// // @mui material components
// import Grid from "@mui/material/Grid";
// import Table from "@mui/material/Table";
// import TableHead from "@mui/material/TableHead";
// import TableBody from "@mui/material/TableBody";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import Paper from "@mui/material/Paper";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// // Material Dashboard 2 React examples
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
// import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
// import DataTable from "examples/Tables/DataTable";
// import Card from "@mui/material/Card";

// // Data for charts
// import barChartData from "layouts/analytics/data/barChartData";
// import lineChartData from "layouts/analytics/data/lineChartData";

// // Mock Active User Data
// const activeUsers = [
//   { id: "001", name: "John Doe", email: "john.doe@example.com", lastActive: "2023-12-01" },
//   { id: "002", name: "Jane Smith", email: "jane.smith@example.com", lastActive: "2023-12-02" },
//   { id: "003", name: "Robert Brown", email: "robert.brown@example.com", lastActive: "2023-12-03" },
//   { id: "004", name: "Emily White", email: "emily.white@example.com", lastActive: "2023-12-04" },
// ];

// // Define table columns
// const columns = [
//   { Header: "ID", accessor: "id" },
//   { Header: "Name", accessor: "name" },
//   { Header: "Email", accessor: "email" },
//   { Header: "Last Active", accessor: "lastActive" },
// ];

// // Map activeUsers to rows format
// const rows = activeUsers.map((user) => ({
//   id: user.id,
//   name: user.name,
//   email: user.email,
//   lastActive: user.lastActive,
// }));

// function Analytics() {
//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox mt={4}>
//         {/* Top KPIs Section */}
//         <MDBox mb={3}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6} xl={3}>
//               <DefaultInfoCard
//                 icon="show_chart"
//                 title="Total Revenue"
//                 description="This Month's Total Revenue"
//                 value="$24,000"
//               />
//             </Grid>
//             <Grid item xs={12} md={6} xl={3}>
//               <DefaultInfoCard
//                 icon="trending_up"
//                 title="Active Users"
//                 description="Users Active This Week"
//                 value="8,450"
//               />
//             </Grid>
//             <Grid item xs={12} md={6} xl={3}>
//               <DefaultInfoCard
//                 icon="bar_chart"
//                 title="New Signups"
//                 description="This Month's New Signups"
//                 value="1,230"
//               />
//             </Grid>
//             <Grid item xs={12} md={6} xl={3}>
//               <DefaultInfoCard
//                 icon="insights"
//                 title="Conversion Rate"
//                 description="User Conversion Rate"
//                 value="3.25%"
//               />
//             </Grid>
//           </Grid>
//         </MDBox>

//         {/* Charts Section */}
//         <MDBox mb={3} mt={6}>
//           <Grid container spacing={4}>
//             <Grid item xs={12} lg={8}>
//               <ReportsLineChart
//                 color="success"
//                 title="Monthly Revenue Trend"
//                 description="Performance over the last 6 months"
//                 date="updated 4 mins ago"
//                 chart={lineChartData}
//               />
//             </Grid>
//             <Grid item xs={12} lg={4}>
//               <ReportsBarChart
//                 color="info"
//                 title="Signup Breakdown"
//                 description="Daily signup data for this month"
//                 date="updated just now"
//                 chart={barChartData}
//               />
//             </Grid>
//           </Grid>
//         </MDBox>

//         {/* Active Users Table */}
//         <MDBox pt={4} pb={3}>
//           <Grid container spacing={6}>
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox
//                   mx={2}
//                   mt={-3}
//                   py={3}
//                   px={2}
//                   variant="gradient"
//                   bgColor="info"
//                   borderRadius="lg"
//                   coloredShadow="info"
//                 >
//                   <MDTypography variant="h6" color="white">
//                     Active Users
//                   </MDTypography>
//                 </MDBox>
//                 <MDBox pt={3} pb={3}>
//                   <DataTable
//                     table={{ columns, rows }}
//                     isSorted={false}
//                     entriesPerPage={false}
//                     showTotalEntries={false}
//                     noEndBorder
//                   />
//                 </MDBox>
//               </Card>
//             </Grid>
//           </Grid>
//         </MDBox>
//         {/* Additional Insights Section */}
//         <MDBox>
//           <Grid container spacing={3} mb={4}>
//             <Grid item xs={12} lg={6}>
//               <DefaultInfoCard
//                 icon="pie_chart"
//                 title="Traffic Sources"
//                 description="Breakdown of website traffic sources"
//                 value="60% Organic, 25% Paid, 15% Referral"
//               />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//               <DefaultInfoCard
//                 icon="trending_down"
//                 title="Churn Rate"
//                 description="Percentage of users lost this month"
//                 value="1.5%"
//               />
//             </Grid>
//           </Grid>
//         </MDBox>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default Analytics;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies for handling tokens

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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

// import barChartData from "layouts/analytics/data/barChartData";
// import lineChartData from "layouts/analytics/data/lineChartData";

function Analytics() {
  const { sales, tasks } = reportsLineChartData;

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/v1/amadeus/analytic/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch analytics data");
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

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

  const columns = [
    { Header: "User ID", accessor: "userId" },
    { Header: "User Name", accessor: "name" },
  ];
  const rows = validUsers.map((user) => ({
    userId: user.userId,
    name: `${user.firstName} ${user.lastName}`,
  }));

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
              {/* <ReportsLineChart
                color="success"
                title="Monthly Revenue Trend"
                description="Performance over the last 6 months"
                date="updated 4 mins ago"
                chart={lineChartData}
              /> */}
              <ReportsLineChart
                color="success"
                title="Monthly Revenue Trend"
                description="Performance over the last 6 months"
                // {
                //   <>
                //     (<strong>+15%</strong>) increase in today sales.
                //   </>
                // }
                date="updated 4 min ago"
                chart={sales}
              />
            </Grid>
            {/* <Grid item xs={12} lg={4}>
              <ReportsBarChart
                color="info"
                title="Signup Breakdown"
                description="Daily signup data for this month"
                date="updated just now"
                chart={barChartData}
              />
            </Grid> */}
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
