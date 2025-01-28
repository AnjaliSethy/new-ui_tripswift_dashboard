// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // @mui material components
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton"; // Import MDButton

// // Material Dashboard 2 React example components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard"; // Import ComplexStatisticsCard
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";

// function Revenue() {
//   const [columns, setColumns] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [totalBookings, setTotalBookings] = useState(0); // Total bookings state
//   const [totalRevenue, setTotalRevenue] = useState(0); // Total revenue state
//   const [averageBooking, setAverageBooking] = useState(0); // Average booking state
//   const [animatedBookings, setAnimatedBookings] = useState(0); // Animated bookings state
//   const [animatedRevenue, setAnimatedRevenue] = useState(0); // Animated revenue state
//   const [animatedAverage, setAnimatedAverage] = useState(0); // Animated average booking state
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     rowsPerPage: 5,
//     totalRecords: 0,
//     totalPages: 1,
//   });

//   // Define selectedFilter state
//   const [selectedFilter, setSelectedFilter] = useState("choose"); // Initialize with a default value
//   useEffect(() => {
//     // Fetch data from the API
//     const fetchRevenueData = async () => {
//       try {
//         setLoading(true);
//         const { currentPage, rowsPerPage } = pagination;

//         // Add sorting parameters dynamically
//         const sortBy =
//           selectedFilter === "High to Low" ? "desc" : selectedFilter === "Low to High" ? "asc" : "";
//         const response = await axios.get(
//           `http://localhost:8080/api/v1/amadeus/all/revenue/details/hotel?page=${currentPage}&limit=${rowsPerPage}&sortBy=totalRevenues&order=${sortBy}`
//         );

//         const { data, pagination: apiPagination, totalBooking, totalRevenue } = response.data;

//         setPagination((prev) => ({
//           ...prev,
//           totalRecords: apiPagination.totalCount || 0,
//           totalPages: apiPagination.totalPages || 1,
//         }));

//         setTotalBookings(totalBooking);
//         setTotalRevenue(totalRevenue);
//         const averageBookingAmount = totalBooking > 0 ? totalRevenue / totalBooking : 0;
//         setAverageBooking(averageBookingAmount);

//         const tableRows = data.map((item) => ({
//           hotelId: (
//             <MDBox display="flex" alignItems="center" lineHeight={1}>
//               <MDTypography variant="button" fontWeight="medium">
//                 {item.hotelId}
//               </MDTypography>
//             </MDBox>
//           ),
//           hotelName: (
//             <MDBox display="flex" alignItems="center" lineHeight={1}>
//               <MDTypography variant="button" fontWeight="medium">
//                 {item.hotelName}
//               </MDTypography>
//             </MDBox>
//           ),
//           geoCode: (
//             <MDBox display="flex" alignItems="center" lineHeight={1}>
//               <MDTypography variant="caption" color="text" fontWeight="medium">
//                 {item.location ? item.location : "Not Available"}
//               </MDTypography>
//             </MDBox>
//           ),
//           totalBookings: (
//             <MDBox display="flex" alignItems="center" lineHeight={1}>
//               <MDTypography variant="caption" color="text" fontWeight="medium">
//                 {item.totalBookings}
//               </MDTypography>
//             </MDBox>
//           ),
//           action: (
//             <MDBox display="flex" justifyContent="center">
//               <MDButton
//                 variant="contained"
//                 color="info"
//                 size="small"
//                 onClick={() =>
//                   navigate(`/hotel/${item.hotelId}?name=${encodeURIComponent(item.hotelName)}`)
//                 }
//               >
//                 View
//               </MDButton>
//             </MDBox>
//           ),
//           totalRevenuesValue: item.totalRevenues, // Ensure this is set correctly
//           totalRevenues: (
//             <MDBox display="flex" alignItems="center" lineHeight={1}>
//               <MDTypography variant="caption" color="text" fontWeight="medium">
//                 {item.totalRevenues.toLocaleString("en-IN", {
//                   style: "currency",
//                   currency: "INR",
//                 })}
//               </MDTypography>
//             </MDBox>
//           ),
//         }));

//         setColumns([
//           { Header: "Hotel ID", accessor: "hotelId" },
//           { Header: "Hotel Name", accessor: "hotelName" },
//           { Header: "Location", accessor: "geoCode" },
//           { Header: "Total Bookings", accessor: "totalBookings", align: "center" },
//           { Header: "Action", accessor: "action", align: "center" },
//         ]);
//         setRows(tableRows);
//       } catch (err) {
//         console.error("Error fetching revenue data:", err);
//         setError("Failed to load data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRevenueData();
//   }, [pagination.currentPage, pagination.rowsPerPage, selectedFilter]);

//   // Counting animation effect
//   useEffect(() => {
//     if (!loading) {
//       const duration = 2000; // Duration of the counting animation in milliseconds
//       const stepTime = 50; // Time between each step in milliseconds
//       const totalSteps = duration / stepTime;

//       const bookingsStep = Math.ceil(totalBookings / totalSteps);
//       const revenueStep = Math.ceil(totalRevenue / totalSteps);
//       const averageStep = Math.ceil(averageBooking / totalSteps);

//       let bookingsCount = 0;
//       let revenueCount = 0;
//       let averageCount = 0;

//       const interval = setInterval(() => {
//         if (bookingsCount < totalBookings) {
//           bookingsCount += bookingsStep;
//           setAnimatedBookings(Math.min(bookingsCount, totalBookings));
//         }
//         if (revenueCount < totalRevenue) {
//           revenueCount += revenueStep;
//           setAnimatedRevenue(Math.min(revenueCount, totalRevenue));
//         }
//         if (averageCount < averageBooking) {
//           averageCount += averageStep;
//           setAnimatedAverage(Math.min(averageCount, averageBooking));
//         }
//         if (
//           bookingsCount >= totalBookings &&
//           revenueCount >= totalRevenue &&
//           averageCount >= averageBooking
//         ) {
//           clearInterval(interval);
//         }
//       }, stepTime);
//     }
//   }, [loading, totalBookings, totalRevenue, averageBooking]);

//   // Handle filter change
//   const handleFilterChange = (event) => {
//     const filterValue = event.target.value;
//     setSelectedFilter(filterValue);

//     // Sort rows based on the selected filter
//     let sortedRows = [...rows];
//     if (filterValue === "High to Low") {
//       sortedRows.sort((a, b) => b.totalRevenuesValue - a.totalRevenuesValue); // Descending order
//     } else if (filterValue === "Low to High") {
//       sortedRows.sort((a, b) => a.totalRevenuesValue - b.totalRevenuesValue); // Ascending order
//     }
//     setRows(sortedRows);
//   };

//   // Main table content
//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} pb={4}>
//           {/* Cards Section */}
//           <Grid item xs={12} md={4}>
//             <ComplexStatisticsCard
//               color="dark"
//               icon="weekend"
//               title="Total Bookings"
//               count={animatedBookings}
//               percentage={{
//                 color: "success",
//                 amount: "+0%", // You can calculate the percentage change if needed
//                 label: "compared to last week",
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ComplexStatisticsCard
//               icon="leaderboard"
//               title="Total Revenue"
//               count={animatedRevenue.toLocaleString("en-IN", {
//                 style: "currency",
//                 currency: "INR",
//               })}
//               percentage={{
//                 color: "success",
//                 amount: "+0%", // You can calculate the percentage change if needed
//                 label: "compared to last month",
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ComplexStatisticsCard
//               color="success"
//               icon="store"
//               title="Average Booking"
//               count={animatedAverage.toLocaleString("en-IN", {
//                 style: "currency",
//                 currency: "INR",
//               })}
//               percentage={{
//                 color: "success",
//                 amount: "+0%", // You can calculate the percentage change if needed
//                 label: "compared to last week",
//               }}
//             />
//           </Grid>
//         </Grid>

//         <Grid container spacing={6} pt={3}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   Revenue Table
//                 </MDTypography>
//               </MDBox>
//               <MDBox px={3} pt={3}>
//                 <TextField
//                   select
//                   value={selectedFilter}
//                   onChange={handleFilterChange}
//                   label="Sort By"
//                   size="small"
//                   sx={{
//                     width: "100px", // Adjusted width for better alignment
//                     height: "50px", // Ensure consistent height
//                     "& .MuiOutlinedInput-root": {
//                       // Ensure dropdown button alignment
//                       padding: "8px", // Padding inside the input field
//                       height: "40px", // Height of the input field
//                     },
//                     "& .MuiInputLabel-root": {
//                       // Styling the label
//                       fontSize: "14px", // Font size for label
//                       top: "-5px", // Adjust position
//                     },
//                     "& .MuiSelect-select": {
//                       // Styling the dropdown options
//                       padding: "8px", // Padding inside the dropdown
//                     },
//                   }}
//                 >
//                   <MenuItem value="choose">None</MenuItem>
//                   <MenuItem value="High to Low">High to Low</MenuItem>
//                   <MenuItem value="Low to High">Low to High</MenuItem>
//                 </TextField>
//               </MDBox>

//               {loading ? (
//                 <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
//                   <MDTypography variant="h6" color="info">
//                     Loading data, please wait...
//                   </MDTypography>
//                 </MDBox>
//               ) : (
//                 <MDBox pt={3} pb={3}>
//                   <DataTable
//                     table={{ columns, rows }}
//                     isSorted={false}
//                     entriesPerPage={false}
//                     showTotalEntries={false}
//                     noEndBorder
//                   />
//                   {/* Pagination Controls */}
//                   <MDBox
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     px={3}
//                     py={2}
//                   >
//                     <MDBox>
//                       <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
//                         Rows per page:&nbsp;
//                       </MDTypography>
//                       <select
//                         value={pagination.rowsPerPage}
//                         onChange={(e) => {
//                           setPagination((prev) => ({
//                             ...prev,
//                             rowsPerPage: parseInt(e.target.value, 10),
//                             currentPage: 1, // Reset to the first page
//                           }));
//                         }}
//                         style={{
//                           fontSize: "14px", // Increase font size for the dropdown
//                           padding: "4px", // Add padding for better appearance
//                         }}
//                       >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                       </select>
//                     </MDBox>
//                     <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
//                       {`${(pagination.currentPage - 1) * pagination.rowsPerPage + 1}-${Math.min(
//                         pagination.currentPage * pagination.rowsPerPage,
//                         pagination.totalRecords
//                       )} of ${pagination.totalRecords}`}
//                     </MDTypography>
//                     <MDBox>
//                       <MDButton
//                         variant="text"
//                         color="primary"
//                         disabled={pagination.currentPage === 1}
//                         onClick={() =>
//                           setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
//                         }
//                         sx={{ fontSize: "14px" }} // Increase font size for the button
//                       >
//                         Previous
//                       </MDButton>
//                       <MDButton
//                         variant="text"
//                         color="primary"
//                         disabled={pagination.currentPage === pagination.totalPages}
//                         onClick={() =>
//                           setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
//                         }
//                         sx={{ fontSize: "14px" }} // Increase font size for the button
//                       >
//                         Next
//                       </MDButton>
//                     </MDBox>
//                   </MDBox>
//                 </MDBox>
//               )}
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default Revenue;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Revenue() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [columns] = useState([
    { Header: "Hotel ID", accessor: "hotelId" },
    { Header: "Hotel Name", accessor: "hotelName" },
    { Header: "Geo Code", accessor: "geoCode" },
    { Header: "Total Bookings", accessor: "totalBookings", align: "center" },
    // { Header: "Total Revenues", accessor: "totalRevenues" },
    { Header: "Action", accessor: "action", align: "center" },
  ]);
  const [rows, setRows] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageBooking, setAverageBooking] = useState(0);
  const [animatedBookings, setAnimatedBookings] = useState(0);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedAverage, setAnimatedAverage] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
    totalRecords: 0,
    totalPages: 1,
  });
  const [selectedFilter, setSelectedFilter] = useState("choose");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/v1/amadeus/all/revenue/details/hotel`
        );
        const { data, totalBooking = 0, totalRevenue = 0 } = response.data;

        setAllData(data || []);
        setTotalBookings(totalBooking);
        setTotalRevenue(totalRevenue);
        setPagination((prev) => ({
          ...prev,
          totalRecords: data.length,
          totalPages: Math.ceil(data.length / prev.rowsPerPage), // Calculate total pages
        }));

        const averageBookingAmount = totalBooking > 0 ? totalRevenue / totalBooking : 0;
        setAverageBooking(averageBookingAmount);

        // Simulate animations
        setAnimatedBookings(totalBooking);
        setAnimatedRevenue(totalRevenue);
        setAnimatedAverage(averageBookingAmount);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Handle sorting and pagination
  useEffect(() => {
    let sortedData = [...allData];

    if (selectedFilter === "High to Low") {
      sortedData.sort((a, b) => b.totalRevenues - a.totalRevenues);
    } else if (selectedFilter === "Low to High") {
      sortedData.sort((a, b) => a.totalRevenues - b.totalRevenues);
    }

    const { currentPage, rowsPerPage } = pagination;
    const paginatedData = sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const tableRows = paginatedData.map((item) => ({
      hotelId: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDTypography variant="button" fontWeight="medium">
            {item.hotelId}
          </MDTypography>
        </MDBox>
      ),
      hotelName: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDTypography variant="button" fontWeight="medium">
            {item.hotelName}
          </MDTypography>
        </MDBox>
      ),
      geoCode: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.location ? item.location : "Not Available"}
          </MDTypography>
        </MDBox>
      ),
      totalBookings: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.totalBookings}
          </MDTypography>
        </MDBox>
      ),
      action: (
        <MDBox display="flex" justifyContent="center">
          <MDButton
            variant="contained"
            color="info"
            size="small"
            onClick={() =>
              navigate(`/hotel/${item.hotelId}?name=${encodeURIComponent(item.hotelName)}`)
            }
          >
            View
          </MDButton>
        </MDBox>
      ),
    }));

    setRows(tableRows);
  }, [allData, selectedFilter, pagination]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Statistics Cards */}
        <Grid container spacing={6} pb={4}>
          <Grid item xs={12} md={4}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Total Bookings"
              count={animatedBookings}
              percentage={{
                color: "success",
                amount: "+0%",
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
                amount: "+0%",
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
                amount: "+0%",
                label: "compared to last week",
              }}
            />
          </Grid>
        </Grid>

        {/* Revenue Table */}
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
              <MDBox px={3} pt={3}>
                <TextField
                  select
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  label="Sort By"
                  size="small"
                  sx={{
                    width: "100px", // Adjusted width for better alignment
                    height: "50px", // Ensure consistent height
                    "& .MuiOutlinedInput-root": {
                      // Ensure dropdown button alignment
                      padding: "3px", // Padding inside the input field
                      height: "35px", // Height of the input field
                    },
                    "& .MuiInputLabel-root": {
                      // Styling the label
                      fontSize: "14px", // Font size for label
                      top: "-5px", // Adjust position
                    },
                    "& .MuiSelect-select": {
                      // Styling the dropdown options
                      padding: "3px", // Padding inside the dropdown
                    },
                  }}
                >
                  <MenuItem value="choose">None</MenuItem>
                  <MenuItem value="High to Low">High to Low</MenuItem>
                  <MenuItem value="Low to High">Low to High</MenuItem>
                </TextField>
              </MDBox>

              {loading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
                  <MDTypography variant="h6" color="info">
                    Loading data, please wait...
                  </MDTypography>
                </MDBox>
              ) : (
                <MDBox pt={3} pb={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                  {/* Pagination Controls */}
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={2}
                  >
                    <MDBox>
                      <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
                        Rows per page:&nbsp;
                      </MDTypography>
                      <select
                        value={pagination.rowsPerPage}
                        onChange={(e) => {
                          setPagination((prev) => ({
                            ...prev,
                            rowsPerPage: parseInt(e.target.value, 10),
                            currentPage: 1, // Reset to the first page
                          }));
                        }}
                        style={{
                          fontSize: "14px", // Increase font size for the dropdown
                          padding: "4px", // Add padding for better appearance
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                      </select>
                    </MDBox>
                    <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
                      {`${(pagination.currentPage - 1) * pagination.rowsPerPage + 1}-${Math.min(
                        pagination.currentPage * pagination.rowsPerPage,
                        pagination.totalRecords
                      )} of ${pagination.totalRecords}`}
                    </MDTypography>
                    <MDBox>
                      <MDButton
                        variant="text"
                        color="info"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        sx={{ fontSize: "13px" }} // Increase font size for the button
                      >
                        Previous
                      </MDButton>
                      <MDButton
                        variant="text"
                        color="info"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        sx={{ fontSize: "13px" }} // Increase font size for the button
                      >
                        Next
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Revenue;
