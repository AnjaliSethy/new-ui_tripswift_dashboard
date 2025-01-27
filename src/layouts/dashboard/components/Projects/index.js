import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress"; // For loading spinner

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Images
import Cookies from "js-cookie";

const rowsPerPage = 6;

function Projects() {
  const [menu, setMenu] = useState(null);
  const [page, setPage] = useState(1); // Manage the page state
  const [hotels, setHotels] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch hotel data from API
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_DASHBOARD_USER_API;
      const access_token = Cookies.get("access_token");
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/amadeus/all/hotels?page=${page}&limit=${rowsPerPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setHotels(data.data);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.log(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Failed to fetch data: ${error}`);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, [page]);

  // Process rows
  const currentRows = hotels.map((hotel) => ({
    hotelId: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {hotel.hotelId || "Unknown"}
        </MDTypography>
      </MDBox>
    ),
    name: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {hotel.name || "Unknown"}
        </MDTypography>
      </MDBox>
    ),
    location: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {hotel.location || "Unknown"}
      </MDTypography>
    ),
    completion: (
      <MDBox width="8rem" textAlign="center">
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <CheckCircleIcon style={{ color: "green", fontSize: "20px" }} />
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{ marginLeft: "5px" }}
          >
            Open/Bookable
          </MDTypography>
        </MDBox>
      </MDBox>
    ),
  }));

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={() => setMenu(null)}
    >
      <MenuItem onClick={() => setMenu(null)}>Action</MenuItem>
      <MenuItem onClick={() => setMenu(null)}>Another action</MenuItem>
      <MenuItem onClick={() => setMenu(null)}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Projects
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Active hotels</strong> of this month
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            fontSize="small"
            onClick={() => setMenu(null)}
          >
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        {/* Display loading spinner until data is fetched */}
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <MDTypography variant="h6" color="info">
              Loading data, please wait...
            </MDTypography>
          </MDBox>
        ) : (
          <DataTable
            table={{
              columns: [
                { Header: "Hotel ID", accessor: "hotelId", width: "10%", align: "left" },
                { Header: "Hotel Name", accessor: "name", width: "45%", align: "left" },
                { Header: "Location", accessor: "location", width: "10%", align: "left" },
                { Header: "Status", accessor: "completion", align: "center" },
              ],
              rows: currentRows,
            }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
            page={page} // Pass the current page to DataTable
          />
        )}
      </MDBox>
      {/* Pagination UI */}
      <MDBox display="flex" justifyContent="center" my={3}>
        <Pagination count={totalPages} color="info" page={page} onChange={handlePageChange} />
      </MDBox>
    </Card>
  );
}

export default Projects;
