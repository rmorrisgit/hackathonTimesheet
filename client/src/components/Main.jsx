import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box"; // Import Box for consistent styling
import CircularProgress from "@mui/material/CircularProgress"; // Optional: Loading indicator
import Typography from "@mui/material/Typography"; // Optional: Error message display
import "../css/directory.css"; // Ensure consistent CSS if needed
import timesheetService from "../services/apiService"; // Ensure this service is correctly set up

const Main = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]); // State for selected rows
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await timesheetService.getTimesheets();
        console.log("Fetched Timesheets:", response);

        const mappedTimesheets = response.map((timesheet, index) => {
          const week1Total = timesheet.week1
            ? Object.values(timesheet.week1).reduce(
                (sum, day) => sum + (day.hours || 0),
                0
              )
            : 0;
          const week2Total = timesheet.week2
            ? Object.values(timesheet.week2).reduce(
                (sum, day) => sum + (day.hours || 0),
                0
              )
            : 0;

          return {
            id: timesheet._id || index, // Ensure each row has a unique id
            employeeName: `${timesheet.firstName} ${timesheet.lastName}`,
            wNum: timesheet.wNum || "N/A",
            group: timesheet.group || "N/A", // Added group field
            contractEndDate: timesheet.contractEndDate || "N/A",
            week1Total,
            week2Total,
            payPeriodStart: timesheet.payPeriodStartDate || "N/A",
            payPeriodEnd: timesheet.payPeriodEndDate || "N/A",
          };
        });

        setTimesheets(mappedTimesheets);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
        setError(
          error.response?.data?.message || "Failed to fetch timesheets."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, []);

  // Define columns with consistent styling
  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "wNum", headerName: "W#", flex: 1 },
    { field: "group", headerName: "Group", flex: 1 }, // New column
    {
      field: "week1Total",
      headerName: "Week 1 Total Hours",
      type: "number",
      flex: 1,
    },
    {
      field: "week2Total",
      headerName: "Week 2 Total Hours",
      type: "number",
      flex: 1,
    },
    { field: "payPeriodStart", headerName: "Pay Period Start", flex: 1 },
    { field: "payPeriodEnd", headerName: "Pay Period End", flex: 1 },
    { field: "contractEndDate", headerName: "Contract End", flex: 1 },
  ];

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
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="employee_grid" style={{ padding: "20px" }}>
      <h1 className="title">Timesheet Overview</h1> {/* Updated title */}
      <Box sx={{ height: 600, width: "100%", mt: 22 }}>
        <DataGrid
          rows={timesheets}
          columns={columns}
          getRowId={(row) => row.id} // Use the 'id' field for unique identification
          pageSize={10} // Fixed page size
          pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            // Ensure only one row is selected at a time
            if (newRowSelectionModel.length > 1) {
              setRowSelectionModel([
                newRowSelectionModel[newRowSelectionModel.length - 1],
              ]);
            } else {
              setRowSelectionModel(newRowSelectionModel);
            }
          }}
          disableSelectionOnClick={true} // Prevent row selection via cell clicks
          sx={{
            // Remove default cell focus outline
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            // Highlight the selected row with a custom color
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgba(25, 118, 210, 0.2) !important", // MUI primary color with opacity
            },
            // Adjust the selected row's hover background
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.3) !important",
            },
            // Maintain hover background for non-selected rows
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)", // Subtle hover effect
            },
            // Customize checkbox styles if needed
            "& .MuiCheckbox-root": {
              color: "inherit",
            },
            // Change cursor back to default if not wanting pointer
            "& .MuiDataGrid-row": {
              cursor: "default", // Remove pointer cursor
            },
          }}
          // Disable unnecessary grid features to simplify UI
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          // Remove focus on grid
          tabIndex={-1}
        />
      </Box>
    </div>
  );
};

export default Main;
