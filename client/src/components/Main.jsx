import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import "../css/directory.css";
import timesheetService from "../services/apiService";

const Main = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            id: timesheet._id || index,
            employeeName: `${timesheet.firstName} ${timesheet.lastName}`,
            wNum: timesheet.wNum || "N/A",
            group: timesheet.group || "N/A",
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

  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "wNum", headerName: "W#", flex: 1 },
    { field: "group", headerName: "Group", flex: 1 },
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
      {/* <h1 className="title">Timesheet Overview</h1> */}
      <Box sx={{ width: "100%", mt: 20 }}>
        <DataGrid
          rows={timesheets}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
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
          disableSelectionOnClick={true}
          sx={{
            // Remove default cell focus outline
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            // Highlight the selected row with a custom color
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgba(25, 118, 210, 0.2) !important",
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.3) !important",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)", // Subtle hover effect
              cursor: "pointer", // Change cursor to pointer on hover
            },
            // Customize checkbox styles if needed
            "& .MuiCheckbox-root": {
              color: "inherit",
            },
            // Remove default cursor style
            "& .MuiDataGrid-row": {
              cursor: "default",
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
