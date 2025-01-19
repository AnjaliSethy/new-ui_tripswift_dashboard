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
import MDButton from "components/MDButton"; // Import MDButton

function Properties() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    rowsPerPage: 5,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data with token-based authentication
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

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

        const result = await response.json();
        console.log("###################", result);

        if (result.success) {
          const formattedRows = result.hotels.map((hotel) => ({
            hotel_id: hotel.hotel_id,
            name: hotel.name,
            location: hotel.location || "Not Available",
            actions: (
              <MDButton
                variant="contained"
                color="info"
                size="small"
                onClick={() =>
                  navigate(`/hotel/${hotel.hotel_id}?name=${encodeURIComponent(hotel.name)}`)
                } // Navigate to hotel details
              >
                View
              </MDButton>
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
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.rowsPerPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 1, // Reset to the first page
    }));
  };

  // Columns for the DataTable
  const columns = [
    {
      Header: "Hotel ID",
      accessor: "hotel_id",
    },
    {
      Header: "Hotel Name",
      accessor: "name",
    },
    {
      Header: "Location",
      accessor: "location",
    },
    {
      Header: "Actions",
      accessor: "actions", // Add actions column
    },
  ];

  // Pagination display logic
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
      <MDBox px={2} py={3}>
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
                  p={4}
                >
                  <MDBox>
                    <MDTypography variant="caption" fontWeight="bold">
                      Rows per page:&nbsp;
                    </MDTypography>
                    <select value={pagination.rowsPerPage} onChange={handleRowsPerPageChange}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                    </select>
                  </MDBox>
                  <MDTypography variant="caption" fontWeight="bold">
                    {`${startRecord}-${endRecord} of ${pagination.totalRecords}`}
                  </MDTypography>
                  <MDBox>
                    <MDButton
                      variant="text"
                      color="primary"
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      Previous
                    </MDButton>
                    <MDButton
                      variant="text"
                      color="primary"
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

// Define PropTypes for the component
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
