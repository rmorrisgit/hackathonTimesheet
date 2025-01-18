import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import timesheetService from "../services/apiService";

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

  return (
    <Box sx={{ padding: "20px", marginTop: 150 }}>
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
            <strong>Pay Period:</strong> {timesheet.payPeriodStartDate} - {timesheet.payPeriodEndDate}
          </Typography>
          <Typography variant="h6">
            <strong>Total Hours (Week 1):</strong>{" "}
            {timesheet.week1
              ? Object.values(timesheet.week1).reduce(
                  (sum, day) => sum + (day.hours || 0),
                  0
                )
              : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Total Hours (Week 2):</strong>{" "}
            {timesheet.week2
              ? Object.values(timesheet.week2).reduce(
                  (sum, day) => sum + (day.hours || 0),
                  0
                )
              : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Group:</strong> {timesheet.group || "N/A"}
          </Typography>
          <Typography variant="h6">
            <strong>Contract End Date:</strong> {timesheet.contractEndDate || "N/A"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TimesheetDetails;
