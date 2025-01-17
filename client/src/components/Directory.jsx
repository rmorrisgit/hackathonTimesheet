import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import userService from '../services/userService';
import '../css/directory.css';

const columns = [
  { field: 'wNum', headerName: 'W#', width: 140 },
  { field: 'employeeName', headerName: 'Employee Name', width: 350 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'group', headerName: 'Group', width: 150 },
  { field: 'role', headerName: 'Role', width: 150 },
  {
    field: 'view',
    headerName: 'View',
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton href={`/employee/${params.row.wNum}`} title="View Details">
        <VisibilityIcon sx={{ color: 'black', fontSize: 24 }} />
      </IconButton>
    ),
  },
];

export default function EmployeeList() {
  const [rows, setRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]); // State for selected rows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await userService.getEmployees();

        const mappedRows = employees.map((employee, index) => ({
          id: employee.wNum || index, // Ensure each row has a unique id
          wNum: employee.wNum || 'N/A',
          employeeName: `${employee.firstName} ${employee.lastName}`,
          email: employee.email || 'N/A',
          role: employee.role || 'N/A',
          group: employee.group?.name || 'N/A', // Assuming group has a 'name' property
        }));

        setRows(mappedRows);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.message || 'Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="employee_grid" style={{ padding: '20px' }}>
      <h1 className="title">Employee Directory</h1>
      <Box sx={{ width: '100%', mt: 22 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id} // Use the 'id' field for unique identification
          pageSize={10} // Fixed page size
          pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            // Ensure only one row is selected at a time
            if (newRowSelectionModel.length > 1) {
              setRowSelectionModel([newRowSelectionModel[newRowSelectionModel.length - 1]]);
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
}
