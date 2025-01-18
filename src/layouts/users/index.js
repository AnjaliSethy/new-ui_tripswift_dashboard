import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Users() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  }); // Filter state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchUsersData = async () => {
    setLoading(true); // Show loading indicator
    setError(null); // Reset error state

    const token = Cookies.get("access_token"); // Get the token from cookies

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const { currentPage, rowsPerPage } = pagination;
      const response = await axios.get(
        `http://localhost:8080/api/v1/user?page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          params: {
            name: filters.name,
            email: filters.email,
            role: filters.role,
          },
        }
      );

      const { users, pagination: apiPagination } = response.data;

      // Define table columns
      const tableColumns = [
        { Header: "User  ID", accessor: "userId" },
        { Header: "Name", accessor: "name" },
        { Header: "Email", accessor: "email" },
        { Header: "Role", accessor: "role" },
        { Header: "Status", accessor: "status" },
        { Header: "Date Joined", accessor: "dateJoined" },
        { Header: "Actions", accessor: "actions" },
      ];

      // Map API data to table rows
      const tableRows = users.map((user) => ({
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: user.bookingCount > 0 ? "Active" : "Inactive", // Example status logic
        dateJoined: new Date(user.createdAt).toLocaleDateString(),
        actions: (
          <MDButton
            variant="contained"
            color="info"
            size="small"
            onClick={() => alert(`Viewing details for ${user.firstName}`)}
          >
            View
          </MDButton>
        ),
      }));

      setColumns(tableColumns);
      setRows(tableRows);
      setPagination({
        ...pagination,
        totalRecords: apiPagination.total,
        totalPages: apiPagination.totalPages,
      });
    } catch (err) {
      console.error("Error fetching users data:", err); // Log error for debugging
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [pagination.currentPage, pagination.rowsPerPage, filters]); // Add filters to dependencies

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  };

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

  const startRecord = (pagination.currentPage - 1) * pagination.rowsPerPage + 1;
  const endRecord = Math.min(
    pagination.currentPage * pagination.rowsPerPage,
    pagination.totalRecords
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Filter Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox py={3} px={3}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <TextField
                      label="Filter by Name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={filters.name}
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Filter by Email"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={filters.email}
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Filter by Role"
                      variant="outlined"
                      fullWidth
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
          {/* Table */}
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
                  Users
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
                    <select value={pagination.rowsPerPage} onChange={handleRowsPerPageChange}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
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

export default Users;
