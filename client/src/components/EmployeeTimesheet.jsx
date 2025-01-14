import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import apiService from "../services/userService"; // Adjust the path to your apiService

const weeks = [
  {
    weekNumber: 1,
    dates: [
      { day: "Sunday", date: "November 17" },
      { day: "Monday", date: "November 18" },
      { day: "Tuesday", date: "November 19" },
      { day: "Wednesday", date: "November 20" },
      { day: "Thursday", date: "November 21" },
      { day: "Friday", date: "November 22" },
      { day: "Saturday", date: "November 23" },
    ],
  },
  {
    weekNumber: 2,
    dates: [
      { day: "Sunday", date: "November 24" },
      { day: "Monday", date: "November 25" },
      { day: "Tuesday", date: "November 26" },
      { day: "Wednesday", date: "November 27" },
      { day: "Thursday", date: "November 28" },
      { day: "Friday", date: "November 29" },
      { day: "Saturday", date: "November 30" },
    ],
  },
];

function EmployeeTimesheet() {
  const [page, setPage] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(
    weeks.flatMap((week) => week.dates).reduce((acc, row) => ({ ...acc, [row.date]: 0 }), {})
  );
  const [userData, setUserData] = useState(null); // Initialize as null to handle loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiService.getUserData(); // Fetch user data dynamically
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
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

  const totalHoursForCurrentPage = weeks[page].dates.reduce(
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

  if (!userData) {
    return <Typography>Loading...</Typography>; // Show loading state
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
        <Box sx={{ gridColumn: "span 1" }}>
          <Typography variant="h6">Fund:</Typography>
          <Typography>{userData.fund}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 1" }}>
          <Typography variant="h6">Dept:</Typography>
          <Typography>{userData.dept}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 1" }}>
          <Typography variant="h6">Program:</Typography>
          <Typography>{userData.program}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 1" }}>
          <Typography variant="h6">Acct:</Typography>
          <Typography>{userData.acct}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 2" }}>
          <Typography variant="h6">Project:</Typography>
          <Typography>{userData.project}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 2" }}>
          <Typography variant="h6">Pay Period Start Date:</Typography>
          <Typography>{userData.payPeriodStartDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 4" }}>
          <Typography variant="h6">Pay Period End Date:</Typography>
          <Typography>{userData.payPeriodEndDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 6" }}>
          <Typography variant="h6">Hourly Rate:</Typography>
          <Typography>${userData.hourlyRate}/hr</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 6" }}>
          <Typography variant="h6">Assignment Type:</Typography>
          <Typography>{userData.assignmentType}</Typography>
        </Box>
      </Box>

      {/* Week Header */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Week {weeks[page].weekNumber}
      </Typography>

      {/* Paginated Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table aria-label={`Week ${weeks[page].weekNumber} Timesheet`} sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Hours Worked</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Other Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks[page].dates.map((row) => (
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
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                Week {weeks[page].weekNumber} Total
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={totalHoursForCurrentPage.toFixed(2)}
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
