// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import Cookies from "js-cookie";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import MDButton from "components/MDButton";
// import Chip from "@mui/material/Chip";

// function HotelBookingDetails() {
//   const { hotelId } = useParams();
//   const [rows, setRows] = useState([]);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     rowsPerPage: 5,
//     totalRecords: 0,
//     totalPages: 1,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const hotelNameFromQuery = new URLSearchParams(window.location.search).get("name");

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = Cookies.get("access_token");
//       if (!token) {
//         setError("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const { currentPage, rowsPerPage } = pagination;
//         const response = await fetch(
//           `http://localhost:8080/api/v1/amadeus/user/details/by/hotel/id?hotelid=${hotelId}&page=${currentPage}&rowsPerPage=${rowsPerPage}`,
//           {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const result = await response.json();
//         if (result.success) {
//           setRows(result.bookingDetails || []);
//           if (result.pagination) {
//             setPagination({
//               ...pagination,
//               ...result.pagination,
//             });
//           } else {
//             setPagination({
//               ...pagination,
//               totalRecords: result.bookingDetails.length,
//               totalPages: 1,
//             });
//           }
//         } else {
//           setError("Failed to fetch data.");
//         }
//       } catch {
//         setError("An error occurred while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [hotelId, pagination.currentPage, pagination.rowsPerPage]);

//   const handlePageChange = (newPage) => setPagination({ ...pagination, currentPage: newPage });
//   const handleRowsPerPageChange = (event) =>
//     setPagination({
//       ...pagination,
//       rowsPerPage: parseInt(event.target.value, 10),
//       currentPage: 1,
//     });

//   const tableColumns = [
//     { Header: "Booking ID", accessor: "bookingId" },
//     { Header: "Guest Name", accessor: "guestName" },
//     { Header: "Amount", accessor: "amount", align: "center" },
//     { Header: "Status", accessor: "status", align: "center" },
//     { Header: "Date", accessor: "date", align: "center" },
//   ];

//   // Function to format currency
//   const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

//   const rowData = rows.map((booking) => ({
//     bookingId: (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDTypography variant="button" fontWeight="medium">
//           {booking.bookingId.split("=")[0] || booking.bookingId}
//         </MDTypography>
//       </MDBox>
//     ),
//     guestName: (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDTypography variant="button" fontWeight="medium">
//           {booking.guests[0]
//             ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
//             : "N/A"}
//         </MDTypography>
//       </MDBox>
//     ),
//     amount: (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {formatCurrency(booking.total)}
//         </MDTypography>
//       </MDBox>
//     ),
//     status: (
//       <Chip
//         label={booking.bookingStatus}
//         style={{
//           backgroundColor: booking.bookingStatus === "CONFIRMED" ? "#4caf50" : "#ff9800",
//           color: "white",
//           fontWeight: "bold",
//           borderRadius: "10px",
//           minWidth: "80px",
//           textAlign: "center",
//         }}
//       />
//     ),
//     date: (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {new Date(booking.createdAt).toLocaleDateString()}
//         </MDTypography>
//       </MDBox>
//     ),
//   }));

//   const totalRevenue = rows.reduce((acc, booking) => acc + booking.total, 0);
//   const filteredRows = rowData.filter((booking) => {
//     const bookingDate = new Date(booking.date);
//     return (
//       (!startDate || bookingDate >= new Date(startDate)) &&
//       (!endDate || bookingDate <= new Date(endDate))
//     );
//   });

//   if (loading)
//     return (
//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox pt={6} pb={3}>
//           <Grid container spacing={6}>
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox py={3} textAlign="center">
//                   <MDTypography variant="h6" color="info">
//                     Loading data, please wait...
//                   </MDTypography>
//                 </MDBox>
//               </Card>
//             </Grid>
//           </Grid>
//         </MDBox>
//         <Footer />
//       </DashboardLayout>
//     );

//   if (error)
//     return (
//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox pt={6} pb={3}>
//           <Grid container spacing={6}>
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox py={3} textAlign="center">
//                   <MDTypography variant="h6" color="error">
//                     {error}
//                   </MDTypography>
//                 </MDBox>
//               </Card>
//             </Grid>
//           </Grid>
//         </MDBox>
//         <Footer />
//       </DashboardLayout>
//     );

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <Card>
//         <MDBox py={3} px={3} pb={2}>
//           <MDBox display="flex" justifyContent="space-between" alignItems="center">
//             <MDBox>
//               <MDTypography variant="caption" fontWeight="bold">
//                 Start Date:
//               </MDTypography>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 style={{ margin: "0 1rem" }}
//               />
//               <MDTypography variant="caption" fontWeight="bold">
//                 End Date:
//               </MDTypography>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 style={{ margin: "0 1rem" }}
//               />
//             </MDBox>
//             <MDTypography variant="h6" color="success">
//               Total Revenue: {formatCurrency(totalRevenue)}
//             </MDTypography>
//           </MDBox>
//         </MDBox>
//       </Card>

//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   Revenue Details of {hotelNameFromQuery || "N/A"}
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3} pb={3}>
//                 <MDBox
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   px={3}
//                   pb={3}
//                 >
//                   {/* <MDBox>
//                     <MDTypography variant="caption" fontWeight="bold">
//                       Start Date:
//                     </MDTypography>
//                     <input
//                       type="date"
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       style={{ margin: "0 1rem" }}
//                     />
//                     <MDTypography variant="caption" fontWeight="bold">
//                       End Date:
//                     </MDTypography>
//                     <input
//                       type="date"
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       style={{ margin: "0 1rem" }}
//                     />
//                   </MDBox>
//                   <MDTypography variant="h6" color="success">
//                     Total Revenue: {formatCurrency(totalRevenue)}
//                   </MDTypography> */}
//                 </MDBox>
//                 <DataTable
//                   table={{ columns: tableColumns, rows: filteredRows }}
//                   isSorted={false}
//                   entriesPerPage={false}
//                   showTotalEntries={false}
//                   noEndBorder
//                 />
//                 <MDBox
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   px={3}
//                   p={4}
//                 >
//                   <MDBox>
//                     <MDTypography variant="caption" fontWeight="bold">
//                       Rows per page:
//                     </MDTypography>
//                     <select value={pagination.rowsPerPage} onChange={handleRowsPerPageChange}>
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                     </select>
//                   </MDBox>
//                   <MDTypography variant="caption" fontWeight="bold">
//                     {`${(pagination.currentPage - 1) * pagination.rowsPerPage + 1} -
//                       ${Math.min(
//                         pagination.currentPage * pagination.rowsPerPage,
//                         pagination.totalRecords
//                       )}
//                       of ${pagination.totalRecords}`}
//                   </MDTypography>
//                   <MDBox>
//                     <MDButton
//                       disabled={pagination.currentPage === 1}
//                       onClick={() => handlePageChange(pagination.currentPage - 1)}
//                     >
//                       Previous
//                     </MDButton>
//                     <MDButton
//                       disabled={pagination.currentPage === pagination.totalPages}
//                       onClick={() => handlePageChange(pagination.currentPage + 1)}
//                     >
//                       Next
//                     </MDButton>
//                   </MDBox>
//                 </MDBox>
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default HotelBookingDetails;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Cookies from "js-cookie";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Chip from "@mui/material/Chip";

function HotelBookingDetails() {
  const { hotelId } = useParams();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const hotelNameFromQuery = new URLSearchParams(window.location.search).get("name");

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [hotelId, pagination.currentPage, pagination.rowsPerPage]); // Add dependencies for pagination

  const fetchData = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { currentPage, rowsPerPage } = pagination;
      const response = await fetch(
        `http://localhost:8080/api/v1/amadeus/user/details/by/hotel/id?hotelid=${hotelId}&page=${currentPage}&rowsPerPage=${rowsPerPage}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (result.success) {
        setRows(result.bookingDetails || []);
        setPagination((prev) => ({
          ...prev,
          totalRecords: result.pagination.totalCount,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setError("Failed to fetch data.");
      }
    } catch {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const handleRowsPerPageChange = (event) => {
    setPagination({
      ...pagination,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 1, // Reset to the first page
    });
  };

  const tableColumns = [
    { Header: "Booking ID", accessor: "bookingId" },
    { Header: "Guest Name", accessor: "guestName" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Date", accessor: "date", align: "center" },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  const rowData = rows.map((booking) => ({
    bookingId: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.bookingId.split("=")[0] || booking.bookingId}
        </MDTypography>
      </MDBox>
    ),
    guestName: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.guests[0]
            ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
            : "N/A"}
        </MDTypography>
      </MDBox>
    ),
    amount: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatCurrency(booking.total)}
        </MDTypography>
      </MDBox>
    ),
    status: (
      <Chip
        label={booking.bookingStatus}
        style={{
          backgroundColor: booking.bookingStatus === "CONFIRMED" ? "#4caf50" : "#ff9800",
          color: "white",
          fontWeight: "bold",
          borderRadius: "10px",
          minWidth: "80px",
          textAlign: "center",
        }}
      />
    ),
    date: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(booking.createdAt).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
  }));

  const totalRevenue = rows.reduce((acc, booking) => acc + booking.total, 0);

  // Calculate the rows to display based on pagination
  const displayedRows = rowData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  if (loading)
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

  if (error)
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox py={3} px={3} pb={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="caption" fontWeight="bold">
                Start Date:
              </MDTypography>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ margin: "0 1rem" }}
              />
              <MDTypography variant="caption" fontWeight="bold">
                End Date:
              </MDTypography>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ margin: "0 1rem" }}
              />
            </MDBox>
            <MDTypography variant="h6" color="success">
              Total Revenue: {formatCurrency(totalRevenue)}
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Revenue Details of {hotelNameFromQuery || "N/A"}
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3}>
                <DataTable
                  table={{ columns: tableColumns, rows: displayedRows }}
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
                  p={4}
                >
                  <MDBox>
                    <MDTypography variant="caption" fontWeight="bold">
                      Rows per page:
                    </MDTypography>
                    <select value={pagination.rowsPerPage} onChange={handleRowsPerPageChange}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </MDBox>
                  <MDTypography variant="caption" fontWeight="bold">
                    {`${(pagination.currentPage - 1) * pagination.rowsPerPage + 1} - 
                      ${Math.min(
                        pagination.currentPage * pagination.rowsPerPage,
                        pagination.totalRecords
                      )} 
                      of ${pagination.totalRecords}`}
                  </MDTypography>
                  <MDBox>
                    <MDButton
                      variant="text"
                      color="info"
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      Previous
                    </MDButton>
                    <MDButton
                      variant="text"
                      color="info"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      Next
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default HotelBookingDetails;
