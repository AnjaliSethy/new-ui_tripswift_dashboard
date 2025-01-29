import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";
import { useParams, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

function UserBookingDetails() {
  const { userId } = useParams(); // Get user ID from route
  const location = useLocation(); // Access location
  const { userName } = location.state || {}; // Retrieve userName from state
  console.log("User Name Received:", userName); // Debugging check
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
    totalRecords: 0,
    totalPages: 1,
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  }); // Date range state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("access_token");
    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const { currentPage, rowsPerPage } = pagination;
      const { startDate, endDate } = dateRange;

      const url = new URL(`http://localhost:8080/api/v1/amadeus/bookings/user-dashboard`);
      url.searchParams.append("id", userId); // Use dynamic userId
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", rowsPerPage);
      if (startDate) url.searchParams.append("startDate", startDate);
      if (endDate) url.searchParams.append("endDate", endDate);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to fetch bookings.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const bookings = data.bookings || [];

      // Define columns dynamically
      setColumns([
        { Header: "Booking ID", accessor: "bookingId" },
        { Header: "Hotel Name", accessor: "hotelName" },
        { Header: "Guests", accessor: "guests" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Total", accessor: "total", align: "center" },
      ]);

      // Map bookings to table rows
      const bookingRows = bookings.map((booking) => ({
        bookingId: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Typography variant="button" fontWeight="medium">
              {booking.bookingId.endsWith("=") ? booking.bookingId.slice(0, -1) : booking.bookingId}
            </Typography>
          </MDBox>
        ),
        hotelName: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Typography variant="button" fontWeight="medium">
              {`${booking.hotel.name} (${booking.hotel.chainCode})`}
            </Typography>
          </MDBox>
        ),
        guests: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography variant="button" fontWeight="medium">
              {" "}
              {booking.guests
                .map((guest) => `${guest.title} ${guest.firstName} ${guest.lastName}`)
                .join(", ")}
            </MDTypography>
          </MDBox>
        ),
        status: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
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
          </MDBox>
        ),
        total: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Typography variant="caption" color="text" fontWeight="medium">
              {`${booking.currency} ${booking.total}`}
            </Typography>
          </MDBox>
        ),
      }));

      setRows(bookingRows);

      // Update pagination state
      setPagination((prev) => ({
        ...prev,
        totalRecords: data.total || 0,
        totalPages: data.totalPages || 1,
      }));
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  }, [userId, pagination.currentPage, pagination.rowsPerPage, dateRange]);

  // Set default date values for startDate and endDate
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    setDateRange({
      startDate: sevenDaysAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 1, // Reset to the first page
    }));
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to the first page
  };

  const startRecord = (pagination.currentPage - 1) * pagination.rowsPerPage + 1;
  const endRecord = Math.min(
    pagination.currentPage * pagination.rowsPerPage,
    pagination.totalRecords
  );

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={2} py={3}>
        <Grid container spacing={6}>
          {/* Date Range Filters */}
          <Grid item xs={12}>
            <Card>
              {/* <MDBox py={3} px={3}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateChange}
                    />
                  </Grid>
                </Grid>
              </MDBox> */}
            </Card>
          </Grid>

          {/* Data Table */}
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
                  Bookings for User: {userName || "Unknown"}
                </MDTypography>
              </MDBox>
              <MDBox py={2} px={3} pt={4}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateChange}
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={1} pb={3}>
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
                    {`${startRecord}-${endRecord} of ${pagination.totalRecords}`}
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
      <Footer />
    </DashboardLayout>
  );
}

export default UserBookingDetails;
