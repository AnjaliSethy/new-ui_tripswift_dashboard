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
  const [startDate, setStartDate] = useState("2024-12-03"); // Default start date
  const [endDate, setEndDate] = useState("2024-12-29"); // Default end date
  const hotelNameFromQuery = new URLSearchParams(window.location.search).get("name");

  // No need for useEffect to set default dates since they are hardcoded above
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

      // Set default values for startDate and endDate if they are empty
      const formattedStartDate = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "1900-01-01"; // Very early date
      const formattedEndDate = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "2100-12-31"; // Very late date

      const apiUrl = `${process.env.REACT_APP_DASHBOARD_USER_API}/amadeus/user/details/by/hotel/id?hotelid=${hotelId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=${currentPage}&limit=${rowsPerPage}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result); // Log the response

      if (result.success) {
        setRows(result.bookingDetails || []);
        setPagination((prev) => ({
          ...prev,
          totalRecords: result.pagination.totalCount,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setError(result.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts or pagination changes
  }, [hotelId, pagination.currentPage, pagination.rowsPerPage, startDate, endDate]);

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
      <MDBox key={booking.bookingId} display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.bookingId.split("=")[0] || booking.bookingId}
        </MDTypography>
      </MDBox>
    ),
    guestName: (
      <MDBox key={booking.bookingId + "-guest"} display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {booking.guests[0]
            ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
            : "N/A"}
        </MDTypography>
      </MDBox>
    ),
    amount: (
      <MDBox key={booking.bookingId + "-amount"} display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatCurrency(booking.total)}
        </MDTypography>
      </MDBox>
    ),
    status: (
      <Chip
        key={booking.bookingId + "-status"}
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
      <MDBox key={booking.bookingId + "-date"} display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(booking.createdAt).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
  }));

  const totalRevenue = rows.reduce((acc, booking) => acc + booking.total, 0);

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
                  table={{ columns: tableColumns, rows: rowData }}
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
                    <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
                      Rows per page:
                    </MDTypography>
                    <select
                      value={pagination.rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      style={{
                        fontSize: "14px", // Increase font size for the dropdown
                        padding: "4px", // Add padding for better appearance
                        marginLeft: "8px", // Adds space between label and dropdown
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </MDBox>
                  <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
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
                      sx={{ fontSize: "13px" }}
                    >
                      Previous
                    </MDButton>
                    <MDButton
                      variant="text"
                      color="info"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      sx={{ fontSize: "13px" }}
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
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default HotelBookingDetails;
