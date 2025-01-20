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
  TablePagination,
  Box,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import { getPayPeriodDates } from "../utils/dateUtils";
import "../css/reset.css";

function EmployeeTimesheet() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [userData, setUserData] = useState(null);
  const [infoDetails, setInfoDetails] = useState({});

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

        const { week1, week2 } = getPayPeriodDates();

        const transformedWeeks = [
          {
            weekNumber: 1,
            dates: week1.map((date) => ({
              day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
              date,
            })),
          },
          {
            weekNumber: 2,
            dates: week2.map((date) => ({
              day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
              date,
            })),
          },
        ];

        setWeeks(transformedWeeks);

        const initialHoursWorked = [...week1, ...week2].reduce(
          (acc, date) => ({ ...acc, [date]: 0 }),
          {}
        );
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
        info: infoDetails[row.date] || "",
      })),
      week2: weeks[1].dates.map((row) => ({
        day: row.day.toLowerCase(),
        hours: parseFloat(hoursWorked[row.date] || 0),
        info: infoDetails[row.date] || "",
      })),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/timesheets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting timesheet:", errorData.error);
        return;
      }

      setTimeout(() => {
        navigate("/");
      }, 3000);

      const responsePdf = await fetch(
        `${import.meta.env.VITE_API_URL}/timesheets/generate-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const pdfData = await responsePdf.json();
      if (responsePdf.ok) {
        window.open(pdfData.pdfUrl, "_blank");
      } else {
        console.error("Error generating PDF:", pdfData.error);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  if (!userData || weeks.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      {/* User Data Section */}
      <Typography variant="h4" gutterBottom>
        Employee Timesheet
      </Typography>
      <Box
        sx={{
          marginBottom: 4,
          padding: 2,
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // Stack elements on small screens
            sm: "repeat(2, 1fr)", // Two columns on medium screens
            md: "repeat(12, 1fr)", // Full layout on larger screens
          },
          gap: 2,
        }}
      >
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Employee Name:
          </Typography>
          <Typography>
            {userData.firstName} {userData.lastName}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            W#:
          </Typography>
          <Typography>{userData.wNum}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 1" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Fund:
          </Typography>
          <Typography>{userData.fund}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 1" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Dept:
          </Typography>
          <Typography>{userData.dept}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 1" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Program:
          </Typography>
          <Typography>{userData.program}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 1" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Acct:
          </Typography>
          <Typography>{userData.acct}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 2" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Project:
          </Typography>
          <Typography>{userData.project}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 2" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Pay Period Start Date:
          </Typography>
          <Typography>{payPeriodStartDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 2" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Pay Period End Date:
          </Typography>
          <Typography>{payPeriodEndDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Hourly Rate:
          </Typography>
          <Typography>{userData.hourlyRate}/hr</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            Assignment Type:
          </Typography>
          <Typography>{userData.assignmentType}</Typography>
        </Box>
      </Box>

      {/* Timesheet Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Other Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks[page]?.dates.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={hoursWorked[row.date]}
                    onChange={(e) =>
                      handleHoursChange(
                        row.date,
                        Math.max(0, Math.min(24, parseFloat(e.target.value) || 0))
                      )
                    }
                    InputProps={{
                      endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={infoDetails[row.date] || ""}
                    onChange={(e) => handleInfoChange(row.date, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: "700" }}>
                Week {weeks[page]?.weekNumber} Total
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
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

      <TablePagination
        rowsPerPageOptions={[7]}
        component="div"
        count={weeks.length * 7}
        rowsPerPage={7}
        page={page}
        onPageChange={handleChangePage}
      />

      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Typography variant="h6">Entered: {grandTotalHours.toFixed(2)} hrs</Typography>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ padding: "10px 20px" }}
        >
          Submit Timesheet & Generate PDF
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeTimesheet;
