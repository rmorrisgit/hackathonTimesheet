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
import { format } from "date-fns";


const TimesheetDetails = () => {
  const { id } = useParams();
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        const data = await timesheetService.getTimesheetById(id);
        setTimesheet(data);
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

  //formatted dates
  const formattedPayStartDate = timesheet.payPeriodStartDate
  ? format(new Date(timesheet.payPeriodStartDate), "MM/dd/yyyy")
  : "N/A";

  const formattedPayEndDate = timesheet.payPeriodEndDate
  ? format(new Date(timesheet.payPeriodEndDate), "MM/dd/yyyy")
  : "N/A";

  const formattedContractEndDate = timesheet.contractEndDate
  ? format(new Date(timesheet.contractEndDate), "MM/dd/yyyy")
  : "N/A";

 

  return (
    <Box sx={{ padding: "20px", marginTop: 25 }}>
      <Typography variant="h4" gutterBottom>
        Timesheet Details
      </Typography>
      {timesheet && (
        <Box>
          <Typography variant="h6">
            <strong>Employee Name:</strong> {timesheet.firstName} {timesheet.lastName}
          </Typography>
          <Typography variant="h6">
            <strong>Employee W#:</strong> {timesheet.wNum || "N/A"}
          </Typography>
          <Typography variant="h6">
            <strong>Pay Period:</strong> {formattedPayStartDate} - {formattedPayEndDate}
          </Typography>
          
          {/* Insert Table Here */}
          <Typography variant="h5" gutterBottom>
            Week 1
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Day</strong></TableCell>
                  <TableCell><strong>Hours Worked</strong></TableCell>
                  <TableCell><strong>Additional Info</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheet.week1.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.day[0].toUpperCase() + day.day.slice(1,day.day.length)}</TableCell>
                    <TableCell>{day.hours || 0}</TableCell>
                    <TableCell>{day.info || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" gutterBottom sx={{ marginTop: 5 }}>
            Week 2
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Day</strong></TableCell>
                  <TableCell><strong>Hours Worked</strong></TableCell>
                  <TableCell><strong>Additional Info</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheet.week2.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.day[0].toUpperCase() + day.day.slice(1,day.day.length)}</TableCell>
                    <TableCell>{day.hours || 0}</TableCell>
                    <TableCell>{day.info || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6">
            <strong>Group:</strong> {timesheet.group || "N/A"}
          </Typography>
          <Typography variant="h6">
            <strong>Contract End Date:</strong> {formattedContractEndDate}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TimesheetDetails;
