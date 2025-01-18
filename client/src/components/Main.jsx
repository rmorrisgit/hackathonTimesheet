import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "../css/directory.css";
import timesheetService from "../services/apiService";
import { format, add, set } from "date-fns";

const Main = ({isAuthenticated}) => {
  const [timesheets, setTimesheets] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await timesheetService.getTimesheets();
        const mappedTimesheets = response.map((timesheet, index) => ({
          id: timesheet._id || index,
          employeeName: `${timesheet.firstName} ${timesheet.lastName}`,
          wNum: timesheet.wNum || "N/A",
          group: timesheet.group || "N/A",
          contractEndDate: timesheet.contractEndDate || "N/A",
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
          payPeriodStart: timesheet.payPeriodStartDate || "N/A",
          payPeriodEnd: timesheet.payPeriodEndDate || "N/A",
        }));
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
  }, [])

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
    { field: "payPeriodStart",
       headerName: "Pay Period Start",
        flex: 1,
        valueFormatter: () => {
          const specificDate = set(new Date(), { year: 2025, month: 0, date: 12 });
          const formattedDate = format(specificDate, "MM/dd/yyyy");
          return formattedDate;
    }
  },
    { field: "payPeriodEnd",
       headerName: "Pay Period End",
        flex: 1,
          valueFormatter: () => {
            const specificDate = set(new Date(), { year: 2025, month: 0, date: 25 });
            const formattedDate = format(specificDate, "MM/dd/yyyy");
            return formattedDate;
          }
      },
    { field: "contractEndDate",
       headerName: "Contract End",
        flex: 1,
      valueFormatter: () => {
        const futureDate = add(new Date, { months: 12 });
        const formattedDate = format(futureDate, "MM/dd/yyyy");
        return formattedDate;
      },
    }
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
    <div className="employee_grid" style={{ padding: "20px", marginTop: 133 }}>
      {rowSelectionModel.length > 0 && (
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigateToTimesheet}
          >
            View Selected Timesheet
          </Button>
        </Box>
      )}
      <Box sx={{ width: "100%" }}>
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
