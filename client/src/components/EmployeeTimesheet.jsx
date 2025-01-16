import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import apiService from "../services/userService";
import { getPayPeriodDates } from "../utils/dateUtils";

function EmployeeTimesheet() {
  const [page, setPage] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Calculate the most recent Sunday
  const getMostRecentSunday = () => {
    const today = new Date();
    const offset = (today.getDay() + 6) % 7;
    const mostRecentSunday = new Date(today);
    mostRecentSunday.setDate(today.getDate() - offset);
    return mostRecentSunday;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiService.getUserData();
        setUserData(user);

        const startDate = getMostRecentSunday().toISOString().split("T")[0];
        const generatedWeeks = getPayPeriodDates(startDate);
        setWeeks(generatedWeeks);

        const initialHoursWorked = generatedWeeks
          .flatMap((week) => week.dates)
          .reduce((acc, row) => ({ ...acc, [row.date]: 0 }), {});
        setHoursWorked(initialHoursWorked);
      } catch (error) {
        setError("Failed to fetch user or timesheet data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleHoursChange = (date, value) => {
    setHoursWorked((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  const totalHoursForCurrentPage = weeks[page]?.dates.reduce(
    (total, row) => total + parseFloat(hoursWorked[row.date] || 0),
    0
  );

  const grandTotalHours = Object.values(hoursWorked).reduce(
    (total, value) => total + parseFloat(value || 0),
    0
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const payPeriodStartDate = weeks[0]?.dates[0]?.date || "N/A";
  const payPeriodEndDate = weeks[1]?.dates[6]?.date || "N/A";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", marginTop: "250px" }}>
      {/* User Data Section */}
      <Box
        sx={{
          marginBottom: 4,
          padding: 2,
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 2,
        }}
      >
        <Box sx={{ gridColumn: "span 6" }}>
          <Typography variant="h6">Employee Name:</Typography>
          <Typography>{userData.firstName} {userData.lastName}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 6" }}>
          <Typography variant="h6">W#:</Typography>
          <Typography>{userData.wNum}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 2" }}>
          <Typography variant="h6">Pay Period Start Date:</Typography>
          <Typography>{payPeriodStartDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 2" }}>
          <Typography variant="h6">Pay Period End Date:</Typography>
          <Typography>{payPeriodEndDate}</Typography>
        </Box>
      </Box>

      {/* Week Header */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Week {weeks[page]?.weekNumber}
      </Typography>

      {/* Paginated Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table aria-label={`Week ${weeks[page]?.weekNumber} Timesheet`} sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Hours Worked</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Other Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks[page]?.dates.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <TextField
                    id={`hours-${row.date}`}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={hoursWorked[row.date]}
                    onChange={(e) => handleHoursChange(row.date, e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField id={`info-${row.date}`} variant="outlined" size="small" placeholder="Enter details" />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>Week {weeks[page]?.weekNumber} Total</TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={totalHoursForCurrentPage?.toFixed(2)}
                  disabled
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                  }}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[7]}
        component="div"
        count={weeks.length * 7}
        rowsPerPage={7}
        page={page}
        onPageChange={handleChangePage}
      />

      {/* Grand Total Section */}
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Grand Total: {grandTotalHours.toFixed(2)} hrs
        </Typography>
      </Box>
    </Box>
  );
}

export default EmployeeTimesheet;
