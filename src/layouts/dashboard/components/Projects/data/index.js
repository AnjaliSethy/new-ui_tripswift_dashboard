// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Images
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const rowsPerPage = 5;

export default function Data() {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  let totalPages = "";

  // Fetch hotel data from API
  useEffect(() => {
    async function fetchData() {
      const apiUrl = process.env.NEXT_PUBLIC_DASHBOARD_USER_API;
      const access_token = Cookies.get("access_token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/amadeus/all/hotels?page=${currentPage}&limit=${rowsPerPage}`,
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
          console.log("Fetched hotel data:", data);
          setHotels(data.data);
          setCurrentPage(data.pagination.currentPage);
          totalPages = data.pagination.totalPages;
        } else {
          console.log(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Failed to fetch data: ${error}`);
      }
    }
    fetchData();
  }, [currentPage]);

  const currentRows = hotels
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((hotel) => ({
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
    setCurrentPage(value);
  };

  const rows = hotels && hotels.length > 0 ? currentRows : [];

  return {
    columns: [
      { Header: "Hotel ID", accessor: "hotelId", width: "10%", align: "left" },
      { Header: "Hotel Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Location", accessor: "location", width: "10%", align: "left" },
      { Header: "Status", accessor: "completion", align: "center" },
    ],
    rows,
    totalPages,
  };
}
