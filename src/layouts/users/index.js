import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Cookies from "js-cookie";
import axios from "axios";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      const apiUrl = `${process.env.REACT_APP_DASHBOARD_USER_API}/user`;

      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllUsers(response.data.users);
        setFilteredData(response.data.users);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let data = [...allUsers];

      if (filters.name) {
        data = data.filter((user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.email) {
        data = data.filter((user) =>
          user.email.toLowerCase().includes(filters.email.toLowerCase())
        );
      }

      if (filters.role) {
        data = data.filter((user) => user.role.toLowerCase().includes(filters.role.toLowerCase()));
      }

      setFilteredData(data);
      setCurrentPage(1); // Reset to first page
    };

    applyFilters();
  }, [filters, allUsers]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      role: "",
    });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage))
      setCurrentPage((prev) => prev + 1);
  };

  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const navigate = useNavigate(); // Define navigate inside the component

  const tableColumns = [
    // { Header: "User ID", accessor: "userId" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Date Joined", accessor: "dateJoined", align: "center" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const tableRows = currentRows.map((user) => ({
    userId: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {user._id}
        </MDTypography>
      </MDBox>
    ),
    name: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {`${user.firstName} ${user.lastName}`}
        </MDTypography>
      </MDBox>
    ),
    email: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      </MDBox>
    ),
    role: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.role}
        </MDTypography>
      </MDBox>
    ),
    status: (
      <Chip
        label={user.bookingCount > 0 ? "Active" : "Inactive"}
        style={{
          backgroundColor: user.bookingCount > 0 ? "#4caf50" : "#fc5603", // Green for Active, Red for Inactive
          color: "white",
          fontWeight: "bold",
          borderRadius: "10px",
          minWidth: "80px",
          textAlign: "center",
        }}
      />
    ),
    dateJoined: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(user.createdAt).toLocaleDateString()}
        </MDTypography>
      </MDBox>
    ),
    actions: (
      <MDButton
        variant="contained"
        color="info"
        size="small"
        onClick={() =>
          navigate(`/user-booking/${user._id}`, {
            state: { userName: `${user.firstName} ${user.lastName}` }, // Ensure this is correct
          })
        }
      >
        View
      </MDButton>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={2}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Tooltip title="Filter by name">
                      <TextField
                        label="Name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title="Filter by email">
                      <TextField
                        label="Email"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title="Filter by role">
                      <TextField
                        label="Role"
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <MDButton color="info" onClick={handleClearFilters}>
                      Clear Filters
                    </MDButton>
                  </Grid> */}
                </Grid>
              </MDBox>
            </Card>
          </Grid>

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
                        <MDTypography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
                          Rows per page:&nbsp;
                        </MDTypography>
                        <select
                          value={rowsPerPage}
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
                          sx={{ fontSize: "13px" }} // Increase font size for the button
                        >
                          Previous
                        </MDButton>
                        <MDButton
                          variant="text"
                          color="info"
                          disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                          onClick={handleNext}
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
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Users;
