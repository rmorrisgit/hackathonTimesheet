import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import timesheetService from "../services/apiService";
import { getPayPeriodDates } from "../utils/dateUtils";

const Main = ({ isAuthenticated }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [payPeriodDates, setPayPeriodDates] = useState({ start: "N/A", end: "N/A" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPayPeriodDates = () => {
      const { week1, week2 } = getPayPeriodDates();
      setPayPeriodDates({
        start: week1[0] || "N/A",
        end: week2[6] || "N/A",
      });
    };

  
    const fetchTimesheets = async () => {
      try {
        const response = await timesheetService.getTimesheets();
        const mappedTimesheets = response.map((timesheet, index) => ({
          id: timesheet._id || index,
          employeeName: `${timesheet.firstName || "N/A"} ${timesheet.lastName || "N/A"}`,
          wNum: timesheet.wNum || "N/A",
          group: timesheet.group || "N/A",
          // Format contractEndDate here
          contractEndDate: timesheet.contractEndDate
            ? new Date(timesheet.contractEndDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A",
          week1Total: timesheet.week1
            ? Object.values(timesheet.week1).reduce(
                (sum, day) => sum + (day.hours || 0),
                0
              )
            : 0,
          week2Total: timesheet.week2
            ? Object.values(timesheet.week2).reduce(
                (sum, day) => sum + (day.hours || 0),
                0
              )
            : 0,
        }));
        setTimesheets(mappedTimesheets);
        fetchPayPeriodDates();
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

  const handleNavigateToTimesheet = () => {
    const selectedRow = timesheets.find(
      (row) => row.id === rowSelectionModel[0]
    );
    if (selectedRow) {
      navigate(`/timesheet/${selectedRow.id}`);
    }
  };

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
    {
      field: "payPeriodStart",
      headerName: "Pay Period Start",
      flex: 1,
      valueGetter: () => payPeriodDates.start,
    },
    {
      field: "payPeriodEnd",
      headerName: "Pay Period End",
      flex: 1,
      valueGetter: () => payPeriodDates.end,
    },
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
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="employee_grid" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Timesheets
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "10px",
            mb: 2,
          }}
        >
          {rowSelectionModel.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigateToTimesheet}
            >
              View Selected Timesheet
            </Button>
          )}
        </Box>
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
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgba(25, 118, 210, 0.2) !important",
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.3) !important",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              cursor: "pointer",
            },
          }}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          tabIndex={-1}
        />
      </Box>
    </div>
  );
};

export default Main;
