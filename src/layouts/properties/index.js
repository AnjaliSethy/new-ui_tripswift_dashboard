import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Cookies from "js-cookie";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
// import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

function Properties() {
  // Define your variables here
  // const totalHotels = 10000; // Example static value
  // const totalHotelBookings = 150; // Example static value
  const [rows, setRows] = useState([]);
  const [locationText, setLocationText] = useState(""); // Separate state for location filter
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    rowsPerPage: 5,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("choose");
  const [hotelNames, setHotelNames] = useState([]);
  const [autocompleteInput, setAutocompleteInput] = useState(""); // New state for autocomplete input
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch hotel names for autocomplete suggestions
    const fetchHotelNames = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/api/v1/amadeus/get/all/hotels/names", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHotelNames(data.hotelNames); // Assuming data.hotelNames is an array of hotel names
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHotelNames();
  }, []);

  useEffect(() => {
    // Fetch all hotel data on initial load
    fetchData();
  }, [pagination.currentPage]); // Add pagination.currentPage to the dependency array

  const fetchData = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/amadeus/proporties/details?page=${pagination.currentPage}&limit=${pagination.rowsPerPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.hotels)) {
        const formattedRows = result.hotels.map((hotel) => ({
          hotel_id: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDTypography variant="button" fontWeight="medium">
                {hotel.hotel_id}
              </MDTypography>
            </MDBox>
          ),
          name: hotel.name,
          location: hotel.location || "Not Available",
          actions: (
            <MDBox display="flex" justifyContent="center">
              <MDButton
                variant="contained"
                color="info"
                size="small"
                onClick={() =>
                  navigate(`/hotel/${hotel.hotel_id}?name=${encodeURIComponent(hotel.name)}`)
                }
              >
                View
              </MDButton>
            </MDBox>
          ),
        }));

        setRows(formattedRows);
        setPagination((prev) => ({
          ...prev,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalRecords: result.pagination.totalHotels,
        }));
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    setFilterText(""); // Reset filter text when changing filter type

    if (value === "choose") {
      fetchData(); // Fetch all data when "All" is selected
    }
  };

  const handleLocationChange = (e) => {
    setLocationText(e.target.value);
  };

  const handleHotelNameSelect = (event, selectedName) => {
    if (!selectedName) return;
    setFilterText(selectedName); // Set filter text only when a name is selected
    setAutocompleteInput(selectedName); // Update autocomplete input
    fetchHotelDetails(selectedName); // Fetch data filtered by hotel name
  };

  const fetchHotelDetails = async (hotelName) => {
    const token = Cookies.get("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/amadeus/proporties/details?name=${encodeURIComponent(
          hotelName
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.hotels)) {
        const formattedRows = result.hotels.map((hotel) => ({
          hotel_id: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDTypography variant="button" fontWeight="medium">
                {hotel.hotel_id}
              </MDTypography>
            </MDBox>
          ),
          name: hotel.name,
          location: hotel.location || "Not Available",
          actions: (
            <MDBox display="flex" justifyContent="center">
              <MDButton
                variant="contained"
                color="info"
                size="small"
                onClick={() =>
                  navigate(`/hotel/${hotel.hotel_id}?name=${encodeURIComponent(hotel.name)}`)
                }
              >
                View
              </MDButton>
            </MDBox>
          ),
        }));

        setRows(formattedRows);
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalRecords: result.pagination.totalHotels,
        }));
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHotelNames = hotelNames.filter(
    (name) => name.toLowerCase().includes(autocompleteInput.toLowerCase()) // Use autocompleteInput for filtering
  );

  const filteredRows = rows.filter((row) => {
    if (selectedFilter === "Hotel Name") {
      return row.name.toLowerCase().includes(filterText.toLowerCase());
    } else if (selectedFilter === "Location") {
      return row.location?.toLowerCase().includes(locationText.toLowerCase());
    }
    return true; // Show all rows if no filter is selected
  });

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 1, // Reset to first page when changing rows per page
    }));
  };

  const columns = [
    { Header: "Hotel ID", accessor: "hotel_id" },
    { Header: "Hotel Name", accessor: "name" },
    { Header: "Location", accessor: "location" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const startRecord = (pagination.currentPage - 1) * pagination.rowsPerPage + 1;
  const endRecord = Math.min(
    pagination.currentPage * pagination.rowsPerPage,
    pagination.totalRecords
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={2} py={6}>
        {/* Stats Cards Section */}
        {/* <Grid container spacing={10} mb={6}>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <MDBox py={3} px={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="bold" color="info">
                  50
                </MDTypography>
                <MDTypography variant="subtitle1" color="text">
                  Total Active Hotels
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <MDBox py={3} px={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="bold" color="info">
                  200
                </MDTypography>
                <MDTypography variant="subtitle1" color="text">
                  Total Hotels Booked
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid> */}
        {/* <MDBox mb={6}>
          <Grid container justifyContent="center" spacing={15}>
            <Grid item xs={12} sm={8} md={6} xl={4}>
              <DefaultInfoCard
                icon="show_chart"
                title="Active Hotels"
                description="Total Active Hotels"
                value={`$${totalHotels.toLocaleString()}`} // Static value with formatting
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6} xl={4}>
              <DefaultInfoCard
                icon="bar_chart"
                title="Hotel Bookings"
                description="Total Hotel Booked"
                value={totalHotelBookings.toLocaleString()} // Static value with formatting
              />
            </Grid>
          </Grid>
        </MDBox> */}
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
                  All Hotel Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox display="flex" px={3} pb={2} alignItems="center" gap={2}>
                  <TextField
                    select
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    label="Filter By"
                    size="small"
                    sx={{
                      width: "100px", // Adjust width
                    }}
                    InputProps={{
                      sx: {
                        height: "35px", // Match height to text field
                      },
                    }}
                  >
                    <MenuItem value="choose">All</MenuItem>
                    <MenuItem value="Hotel Name">Hotel Name</MenuItem>
                    <MenuItem value="Location">Location</MenuItem>
                  </TextField>
                  {selectedFilter === "Hotel Name" && (
                    <Autocomplete
                      freeSolo
                      options={hotelNames.map((name, index) => ({ id: index, label: name }))} // Add unique id
                      getOptionLabel={(option) => option.label} // Ensure correct display
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.label}
                        </li> // Use unique key
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Hotel Name"
                          size="small"
                          onChange={(e) => setAutocompleteInput(e.target.value)}
                          value={autocompleteInput}
                          sx={{
                            width: "200px", // Adjust width
                          }}
                        />
                      )}
                      onChange={(event, selectedOption) => {
                        if (!selectedOption) return;
                        setFilterText(selectedOption.label); // Update filter text
                        setAutocompleteInput(selectedOption.label);
                        fetchHotelDetails(selectedOption.label); // Fetch filtered data
                      }}
                      inputValue={autocompleteInput}
                      onInputChange={(event, newInputValue) => {
                        setAutocompleteInput(newInputValue);
                      }}
                    />
                  )}
                  {selectedFilter === "Location" && (
                    <TextField
                      size="small"
                      placeholder="Filter by Location"
                      value={locationText}
                      onChange={handleLocationChange} // Use the new function here
                      sx={{
                        width: "200px", // Adjust width
                        height: "35px", // Ensure height consistency
                      }}
                      InputProps={{
                        sx: {
                          height: "35px", // Match height explicitly
                        },
                      }}
                    />
                  )}
                </MDBox>

                {loading ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
                    <MDTypography variant="h6" color="info">
                      Loading data, please wait...
                    </MDTypography>
                  </MDBox>
                ) : (
                  <>
                    <DataTable
                      table={{ columns, rows: filteredRows }}
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
                          sx={{ fontSize: "13px" }} // Increase font size for the button
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

Properties.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      hotel_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string,
    }),
  }),
};

export default Properties;
