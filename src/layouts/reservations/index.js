// import React, { useEffect, useState, useCallback } from "react";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import TextField from "@mui/material/TextField";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import axios from "axios";
// import Cookies from "js-cookie";
// import debounce from "lodash/debounce";
// import MDButton from "components/MDButton";
// import Chip from "@mui/material/Chip";
// import Typography from "@mui/material/Typography";

// function Reservations() {
//   const [columns, setColumns] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [filters, setFilters] = useState({
//     name: "",
//     location: "",
//     bookedOn: "",
//     checkIn: "",
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const fetchReservationData = async () => {
//     setLoading(true); // Show loading state while fetching
//     const token = Cookies.get("access_token");
//     if (!token) {
//       setError("No token found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const params = {
//         page: currentPage,
//         limit: rowsPerPage,
//         guestName: filters.name || undefined,
//         location: filters.location || undefined,
//         bookedOn: filters.bookedOn || undefined,
//         checkIn: filters.checkIn || undefined,
//       };

//       const response = await axios.get(
//         "http://localhost:8080/api/v1/amadeus/bookings/hotels/details",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params,
//         }
//       );

//       const { bookings, totalBookings } = response.data;

//       const tableColumns = [
//         { Header: "Property ID", accessor: "propertyId" },
//         { Header: "Property Name", accessor: "propertyName" },
//         { Header: "Location", accessor: "location" },
//         { Header: "Guest Name", accessor: "guestName" },
//         { Header: "Check-In", accessor: "checkIn", align: "center" },
//         { Header: "Check-Out", accessor: "checkOut", align: "center" },
//         { Header: "Status", accessor: "status", align: "center" },
//         { Header: "Reservation No.", accessor: "reservationNo", align: "center" },
//         { Header: "Booked On", accessor: "bookedOn", align: "center" },
//       ];

//       const truncatePropertyName = (name) => {
//         const words = name.split(" ");
//         if (words.length > 2) {
//           return `${words[0]} ${words[1]} ...`;
//         }
//         return name;
//       };
//       const tableRows = bookings.map((booking) => ({
//         propertyId: (
//           <MDBox display="flex" alignItems="center" lineHeight={1}>
//             <Typography variant="button" fontWeight="medium">
//               {booking.hotel.id}
//             </Typography>
//           </MDBox>
//         ),
//         propertyName: (
//           <MDBox display="flex" alignItems="center" lineHeight={1}>
//             <Typography variant="button" fontWeight="medium">
//               {truncatePropertyName(booking.hotel.name)}
//             </Typography>
//           </MDBox>
//         ),
//         location: (
//           <Typography variant="caption" color="text" fontWeight="medium">
//             {booking.city || "Not Available"}
//           </Typography>
//         ),
//         guestName: (
//           <MDBox display="flex" alignItems="center" lineHeight={1}>
//             <MDTypography variant="button" fontWeight="medium">
//               {booking.guests?.[0]
//                 ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
//                 : "Not Available"}
//             </MDTypography>
//           </MDBox>
//         ),
//         checkIn: (
//           <Typography variant="caption" color="text" fontWeight="medium">
//             {new Date(booking.checkInDate).toLocaleDateString()}
//           </Typography>
//         ),
//         checkOut: (
//           <Typography variant="caption" color="text" fontWeight="medium">
//             {new Date(booking.checkOutDate).toLocaleDateString()}
//           </Typography>
//         ),
//         status: (
//           <Chip
//             label={booking.bookingStatus}
//             style={{
//               backgroundColor: booking.bookingStatus === "CONFIRMED" ? "#4caf50" : "#ff9800",
//               color: "white",
//               fontWeight: "bold",
//               borderRadius: "10px",
//               minWidth: "80px",
//               textAlign: "center",
//             }}
//           />
//         ),
//         reservationNo: (
//           <MDBox display="flex" alignItems="center" lineHeight={1}>
//             <Typography variant="caption" color="text" fontWeight="medium">
//               {booking.confirmationNumber}
//             </Typography>
//           </MDBox>
//         ),
//         bookedOn: (
//           <Typography variant="caption" color="text" fontWeight="medium">
//             {new Date(booking.createdAt).toLocaleDateString()}
//           </Typography>
//         ),
//       }));

//       setColumns(tableColumns);
//       setRows(tableRows);
//       setTotalRecords(totalBookings);
//     } catch (err) {
//       console.error("Error fetching reservation data:", err);
//       setError("Failed to fetch data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReservationData();
//   }, [currentPage, rowsPerPage]);

//   const debouncedFilterFetch = useCallback(
//     debounce(() => fetchReservationData(), 500),
//     [filters, currentPage, rowsPerPage]
//   );

//   const handleFilterChange = (event) => {
//     const { name, value } = event.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));

//     // Debounce all filters to avoid excessive calls
//     debouncedFilterFetch();
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(1);
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < Math.ceil(totalRecords / rowsPerPage)) setCurrentPage((prev) => prev + 1);
//   };

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3} px={2} py={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox p={3}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={3}>
//                     <TextField
//                       label="Guest Name"
//                       name="name"
//                       value={filters.name}
//                       onChange={handleFilterChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <TextField
//                       label="Location"
//                       name="location"
//                       value={filters.location}
//                       onChange={handleFilterChange}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <TextField
//                       label="Booked On"
//                       name="bookedOn"
//                       type="date"
//                       value={filters.bookedOn}
//                       onChange={handleFilterChange}
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={3}>
//                     <TextField
//                       label="Check-In Date"
//                       name="checkIn"
//                       type="date"
//                       value={filters.checkIn}
//                       onChange={handleFilterChange}
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                     />
//                   </Grid>
//                 </Grid>
//               </MDBox>
//             </Card>
//           </Grid>

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
//                   Reservations
//                 </MDTypography>
//               </MDBox>
//               {loading ? (
//                 <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
//                   <MDTypography variant="h6" color="info">
//                     Loading data, please wait...
//                   </MDTypography>
//                 </MDBox>
//               ) : (
//                 <>
//                   <MDBox pt={3} pb={3}>
//                     <DataTable
//                       table={{ columns, rows }}
//                       isSorted={false}
//                       entriesPerPage={false}
//                       showTotalEntries={false}
//                       noEndBorder
//                     />
//                   </MDBox>
//                   <MDBox
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     px={3}
//                     py={2}
//                   >
//                     <MDBox>
//                       <MDTypography variant="caption" fontWeight="bold">
//                         Rows per page:&nbsp;
//                       </MDTypography>
//                       <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                       </select>
//                     </MDBox>
//                     <MDTypography variant="caption" fontWeight="bold">
//                       {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
//                         currentPage * rowsPerPage,
//                         totalRecords
//                       )} of ${totalRecords}`}
//                     </MDTypography>
//                     <MDBox>
//                       <MDButton
//                         variant="text"
//                         color="primary"
//                         disabled={currentPage === 1}
//                         onClick={handlePrevious}
//                       >
//                         Previous
//                       </MDButton>
//                       <MDButton
//                         variant="text"
//                         color="primary"
//                         disabled={currentPage === Math.ceil(totalRecords / rowsPerPage)}
//                         onClick={handleNext}
//                       >
//                         Next
//                       </MDButton>
//                     </MDBox>
//                   </MDBox>{" "}
//                 </>
//               )}
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default Reservations;
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import Cookies from "js-cookie";
import MDButton from "components/MDButton";

function Reservations() {
  const [columns, setColumns] = useState([]);
  const [allData, setAllData] = useState([]); // Full dataset
  const [filteredData, setFilteredData] = useState([]); // Filtered data for display
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    bookedOnStart: "", // Start date for "Booked On"
    bookedOnEnd: "", // End date for "Booked On"
    checkIn: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/amadeus/bookings/hotels/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { bookings } = response.data;

        // Set the full dataset and filtered data initially
        setAllData(bookings);
        setFilteredData(bookings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Apply filters whenever filters or allData changes
  useEffect(() => {
    const applyFilters = () => {
      let data = [...allData];

      if (filters.name) {
        data = data.filter((booking) =>
          `${booking.guests?.[0]?.firstName} ${booking.guests?.[0]?.lastName}`
            .toLowerCase()
            .includes(filters.name.toLowerCase())
        );
      }

      if (filters.location) {
        data = data.filter((booking) =>
          booking.city.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.bookedOnStart || filters.bookedOnEnd) {
        const start = filters.bookedOnStart ? new Date(filters.bookedOnStart) : null;
        const end = filters.bookedOnEnd ? new Date(filters.bookedOnEnd) : null;

        data = data.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return (!start || bookingDate >= start) && (!end || bookingDate <= end);
        });
      }

      if (filters.checkIn) {
        data = data.filter(
          (booking) =>
            new Date(booking.checkInDate).toLocaleDateString() ===
            new Date(filters.checkIn).toLocaleDateString()
        );
      }
      setFilteredData(data);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [filters, allData]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      name: "",
      location: "",
      bookedOnStart: "",
      bookedOnEnd: "",
      checkIn: "",
    });
  };

  // Handle rows per page changes
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Pagination controls
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage))
      setCurrentPage((prev) => prev + 1);
  };

  // Calculate current rows for pagination
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Table column definition
  const tableColumns = [
    { Header: "Property ID", accessor: "propertyId" },
    { Header: "Property Name", accessor: "propertyName" },
    { Header: "Location", accessor: "location" },
    { Header: "Guest Name", accessor: "guestName" },
    { Header: "Check-In", accessor: "checkIn", align: "center" },
    { Header: "Check-Out", accessor: "checkOut", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Reservation No.", accessor: "reservationNo", align: "center" },
    { Header: "Booked On", accessor: "bookedOn", align: "center" },
  ];

  // Transform data to rows for the table
  const tableRows = currentRows.map((booking) => ({
    propertyId: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.hotel.id}
        </MDTypography>
      </MDBox>
    ),
    propertyName: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.hotel.name.length > 8
            ? booking.hotel.name.slice(0, 8) + "..."
            : booking.hotel.name}
        </MDTypography>
      </MDBox>
    ),
    location: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {booking.city || "Not Available"}
        </MDTypography>
      </MDBox>
    ),
    guestName: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {booking.guests?.[0]
            ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`.length > 10
              ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`.slice(0, 10) + "..."
              : `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
            : "Not Available"}
        </MDTypography>
      </MDBox>
    ),
    checkIn: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(booking.checkInDate).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
    checkOut: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(booking.checkOutDate).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
    status: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {booking.bookingStatus}
        </MDTypography>
      </MDBox>
    ),
    reservationNo: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {booking.confirmationNumber?.length > 8
            ? booking.confirmationNumber.slice(0, 8) + "..."
            : booking.confirmationNumber}
        </MDTypography>
      </MDBox>
    ),
    bookedOn: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(booking.createdAt).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={2}>
        <Grid container spacing={6}>
          {/* Filters Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                p={3}
                style={{
                  position: "relative", // Ensure relative positioning for the container
                }}
              >
                <Grid
                  container
                  spacing={3}
                  alignItems="center"
                  style={{
                    marginBottom: "20px", // Add gap between filter section and table
                  }}
                >
                  <Grid item xs={3}>
                    <Tooltip title="Enter guest name">
                      <TextField
                        label="Guest Name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="Enter location">
                      <TextField
                        label="Location"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="Select start date for booked on">
                      <TextField
                        label="Booked On (Start)"
                        name="bookedOnStart"
                        type="date"
                        value={filters.bookedOnStart}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="Select end date for booked on">
                      <TextField
                        label="Booked On (End)"
                        name="bookedOnEnd"
                        type="date"
                        value={filters.bookedOnEnd}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="Select check-in date">
                      <TextField
                        label="Check-In Date"
                        name="checkIn"
                        type="date"
                        value={filters.checkIn}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3} style={{ position: "relative" }}>
                    <MDButton
                      style={{
                        position: "absolute",
                        left: "10", // Align to the right of the grid cell
                        top: "100%", // Center align vertically
                        transform: "translateY(-50%)", // Ensure proper vertical centering
                      }}
                      color="info"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* DataTable Section */}
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
                  Reservations
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                {loading ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
                    <MDTypography variant="h6" color="info">
                      Loading data, please wait...
                    </MDTypography>
                  </MDBox>
                ) : (
                  <>
                    <DataTable
                      table={{ columns: tableColumns, rows: tableRows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      px={3}
                      py={2}
                    >
                      <MDBox>
                        <MDTypography variant="caption" fontWeight="bold">
                          Rows per page:&nbsp;
                        </MDTypography>
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                        </select>
                      </MDBox>
                      <MDTypography variant="caption" fontWeight="bold">
                        {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                          currentPage * rowsPerPage,
                          filteredData.length
                        )} of ${filteredData.length}`}
                      </MDTypography>
                      <MDBox>
                        <MDButton
                          variant="text"
                          color="info"
                          disabled={currentPage === 1}
                          onClick={handlePrevious}
                        >
                          Previous
                        </MDButton>
                        <MDButton
                          variant="text"
                          color="info"
                          disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                          onClick={handleNext}
                        >
                          Next
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reservations;
