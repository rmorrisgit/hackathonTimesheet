import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import timesheetService from "../services/apiService";
import { getPayPeriodDates } from "../utils/dateUtils";

const TimesheetDetails = () => {
  const { id } = useParams();
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payPeriodDates, setPayPeriodDates] = useState({
    start: "N/A",
    end: "N/A",
  });

  // Current timestamp
  const currentTimestamp = new Date();

  // Format the timestamp for display
  const formattedTimestamp = currentTimestamp.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        const data = await timesheetService.getTimesheetById(id);
        setTimesheet(data);

        // Fetch and format pay period dates
        const { week1, week2 } = getPayPeriodDates();
        setPayPeriodDates({
          start: week1[0],
          end: week2[6],
        });
      } catch (err) {
        setError(err.message || "Failed to fetch timesheet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheet();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const calculateWeeklyTotal = (week) =>
    week?.reduce((total, day) => total + (parseFloat(day.hours) || 0), 0) || 0;

  const week1Total = calculateWeeklyTotal(timesheet?.week1);
  const week2Total = calculateWeeklyTotal(timesheet?.week2);

  const { week1: week1Dates, week2: week2Dates } = getPayPeriodDates();

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Employee Timesheet Details
      </Typography>
      {timesheet && (
        <>
          <Paper elevation={3} sx={{ padding: "16px", marginBottom: "24px" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: "16px",
              }}
            >
              {/* Left Column */}
              <Box>
                <Typography sx={{ fontWeight: "700" }}>Employee Name:</Typography>
                <Typography>
                  {timesheet.firstName} {timesheet.lastName}
                </Typography>
                <Typography sx={{ fontWeight: "700", marginTop: "8px" }}>W#:</Typography>
                <Typography>{timesheet.wNum || "N/A"}</Typography>
                <Typography sx={{ fontWeight: "700", marginTop: "8px" }}>
                  Pay Period Start Date:
                </Typography>
                <Typography>{payPeriodDates.start}</Typography>
                <Typography sx={{ fontWeight: "700", marginTop: "8px" }}>
                  Pay Period End Date:
                </Typography>
                <Typography>{payPeriodDates.end}</Typography>
                <Typography sx={{ fontWeight: "700", marginTop: "8px" }}>Hourly Rate:</Typography>
                <Typography>{timesheet.hourlyRate || "N/A"}/hr</Typography>
                <Typography sx={{ fontWeight: "700", marginTop: "8px" }}>
                  Assignment Type:
                </Typography>
                <Typography>{timesheet.assignmentType || "N/A"}</Typography>
              </Box>

              {/* Right Column - Additional Details */}
              <Box>
                <Typography sx={{ fontWeight: "700", marginBottom: "8px" }}>
                  Additional Details:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "1fr" },
                    gap: "16px",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "700" }}>Fund:</Typography>
                    <Typography>{timesheet.fund || "N/A"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: "700" }}>Dept:</Typography>
                    <Typography>{timesheet.dept || "N/A"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: "700" }}>Program:</Typography>
                    <Typography>{timesheet.program || "N/A"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: "700" }}>Acct:</Typography>
                    <Typography>{timesheet.acct || "N/A"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: "700" }}>Project:</Typography>
                    <Typography>{timesheet.project || "N/A"}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ fontWeight: "700", marginTop: "32px" }}>Submission Date:</Typography>
            <Typography>{formattedTimestamp}</Typography>
          </Paper>

          {/* Week 1 Table */}
          <Typography variant="h5" gutterBottom>
            Week 1
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Day</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Hours Worked</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Additional Info</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(timesheet.week1 || []).map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.day || "N/A"}</TableCell>
                    <TableCell>{week1Dates[index] || "N/A"}</TableCell>
                    <TableCell>{day.hours || 0}</TableCell>
                    <TableCell>{day.info || "N/A"}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <strong>{week1Total.toFixed(2)} hrs</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Week 2 Table */}
          <Typography variant="h5" gutterBottom sx={{ marginTop: 5 }}>
            Week 2
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Day</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Hours Worked</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Additional Info</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(timesheet.week2 || []).map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.day || "N/A"}</TableCell>
                    <TableCell>{week2Dates[index] || "N/A"}</TableCell>
                    <TableCell>{day.hours || 0}</TableCell>
                    <TableCell>{day.info || "N/A"}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <strong>{week2Total.toFixed(2)} hrs</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default TimesheetDetails;
