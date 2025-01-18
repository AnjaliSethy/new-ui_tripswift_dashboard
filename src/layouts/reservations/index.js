import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import MDButton from "components/MDButton"; // Import MDButton

function Reservations() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    bookedOn: "",
    checkIn: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchReservationData = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        guestName: filters.name || undefined,
        location: filters.location || undefined,
        bookedOn: filters.bookedOn || undefined,
        checkIn: filters.checkIn || undefined,
      };

      const response = await axios.get(
        "http://localhost:8080/api/v1/amadeus/bookings/hotels/details",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      const { bookings, totalBookings } = response.data;

      const tableColumns = [
        { Header: "Property ID", accessor: "propertyId" },
        { Header: "Property Name", accessor: "propertyName" },
        { Header: "Location", accessor: "location" },
        { Header: "Guest Name", accessor: "guestName" },
        { Header: "Check-In", accessor: "checkIn" },
        { Header: "Check-Out", accessor: "checkOut" },
        { Header: "Status", accessor: "status" },
        { Header: "Reservation No.", accessor: "reservationNo" },
        { Header: "Booked On", accessor: "bookedOn" },
      ];

      const tableRows = bookings.map((booking) => ({
        propertyId: booking.hotel.id,
        propertyName: booking.hotel.name,
        location: booking.city || "Not Available",
        guestName: booking.guests?.[0]
          ? `${booking.guests[0].firstName} ${booking.guests[0].lastName}`
          : "Not Available",
        checkIn: new Date(booking.checkInDate).toLocaleDateString(),
        checkOut: new Date(booking.checkOutDate).toLocaleDateString(),
        status: booking.bookingStatus,
        reservationNo: booking.confirmationNumber,
        bookedOn: new Date(booking.createdAt).toLocaleDateString(),
      }));

      setColumns(tableColumns);
      setRows(tableRows);
      setTotalRecords(totalBookings);
    } catch (err) {
      console.error("Error fetching reservation data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationData();
  }, [currentPage, rowsPerPage]);

  const debouncedFilterFetch = useCallback(
    debounce(() => fetchReservationData(), 500),
    [filters]
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    if (name === "name" || name === "location") {
      if (value.length >= 3 || value === "") {
        debouncedFilterFetch();
      }
    } else {
      fetchReservationData();
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(totalRecords / rowsPerPage)) setCurrentPage((prev) => prev + 1);
  };

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
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Filter Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" gutterBottom>
                  Filters
                </MDTypography>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <TextField
                      label="Guest Name"
                      name="name"
                      value={filters.name}
                      onChange={handleFilterChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Location"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Booked On"
                      name="bookedOn"
                      type="date"
                      value={filters.bookedOn}
                      onChange={handleFilterChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Check-In Date"
                      name="checkIn"
                      type="date"
                      value={filters.checkIn}
                      onChange={handleFilterChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Data Table Section */}
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
              <MDBox pt={3} pb={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              {/* Pagination Controls */}
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
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    // style={{ marginLeft: "8px", padding: "4px" }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </MDBox>
                <MDTypography variant="caption" fontWeight="bold">
                  {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    totalRecords
                  )} of ${totalRecords}`}
                </MDTypography>
                <MDBox>
                  <MDButton
                    variant="text"
                    color="primary"
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                  >
                    Previous
                  </MDButton>
                  <MDButton
                    variant="text"
                    color="primary"
                    disabled={currentPage === Math.ceil(totalRecords / rowsPerPage)}
                    onClick={handleNext}
                  >
                    Next
                  </MDButton>
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

export default Reservations;
