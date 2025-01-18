import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import userService from "../services/userService";
import { getPayPeriodDates } from "../utils/dateUtils"; // Import your utility function
import timesheetService from "../services/apiService"; // Import the service
import InputAdornment from "@mui/material/InputAdornment";

function EmployeeTimesheet() {
  const [page, setPage] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [userData, setUserData] = useState(null);
  const [infoDetails, setInfoDetails] = useState({});

  
  // Calculate the most recent Sunday as the pay period start
  const getMostRecentSunday = () => {
    const today = new Date(); // Current date
    const offset = today.getDay(); // Offset: Sunday = 0
    const mostRecentSunday = new Date(today);
    mostRecentSunday.setDate(today.getDate() - offset); // Move back to Sunday
    return mostRecentSunday;
  };

  const handleInfoChange = (date, value) => {
    setInfoDetails((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userService.getUserData();
        setUserData(user);
  
        // Calculate start date as the most recent Sunday
        const startDate = getMostRecentSunday().toISOString().split("T")[0]; // YYYY-MM-DD format
        const generatedWeeks = getPayPeriodDates(startDate); // Use your utility
        setWeeks(generatedWeeks);
  
        // Initialize hoursWorked state
        const initialHoursWorked = generatedWeeks
          .flatMap((week) => week.dates)
          .reduce((acc, row) => ({ ...acc, [row.date]: 0 }), {});
        setHoursWorked(initialHoursWorked);
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

  const payPeriodStartDate = weeks[0]?.dates[0]?.date;
  const payPeriodEndDate = weeks[1]?.dates[6]?.date;

  if (!userData || weeks.length === 0) {
    return <Typography>Loading...</Typography>; // Show loading state
  }
  const handleSubmit = async () => {
    const payload = {
      userId: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      wNum: userData.wNum,
      group: userData.group,
      role: userData.role,
      fund: userData.fund,
      dept: userData.dept,
      program: userData.program,
      acct: userData.acct,
      project: userData.project,
      payPeriodStartDate,
      payPeriodEndDate,
      hourlyRate: userData.hourlyRate,
      isCasual: userData.assignmentType === "Casual",
      contractEndDate: userData.contractEndDate,
      week1: weeks[0].dates.map((row) => ({
        day: row.day.toLowerCase(),
        hours: parseFloat(hoursWorked[row.date] || 0),
        info: infoDetails[row.date] || "", // Include the info field
      })),
      week2: weeks[1].dates.map((row) => ({
        day: row.day.toLowerCase(),
        hours: parseFloat(hoursWorked[row.date] || 0),
        info: infoDetails[row.date] || "", // Include the info field
      })),
    };
  
    try {
      console.log("Submitting payload:", payload);
  
      // Send the payload to the first endpoint
      const response0 = await fetch(`${import.meta.env.VITE_API_URL}/timesheets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response0.ok) {
        const errorData = await response0.json();
        console.error("Error submitting timesheet:", errorData.error);
        return; // Exit if the first request fails
      }
      console.log("Timesheet submitted successfully");
  
      // Send the payload to the second endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/timesheets/generate-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        console.log("PDF generated successfully:", data.pdfUrl);
        window.open(data.pdfUrl, "_blank");
      } else {
        console.error("Error generating PDF:", data.error);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  
  
  
  
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
          <Typography>{payPeriodStartDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: "span 4" }}>
          <Typography variant="h6">Pay Period End Date:</Typography>
          <Typography>{payPeriodEndDate}</Typography>
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
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Enforce min and max constraints
                    if (value < 0) value = 0;
                    if (value > 24) value = 24;
                    if(value!=value) value=0;

                    handleHoursChange(row.date, value);
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                    inputProps: {
                      min: 0,
                      max: 24,
                      step: 0.1, // Optional: Define the step for finer control
                    },
                  }}
                />
                </TableCell>
                <TableCell>
                  <TextField
                    id={`info-${row.date}`}
                    variant="outlined"
                    size="small"
                    placeholder="Enter details"
                    value={infoDetails[row.date] || ""}
                    onChange={(e) => handleInfoChange(row.date, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                Week {weeks[page]?.weekNumber} Total
              </TableCell>
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
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Submit Timesheet
        </button>
      </Box>

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
