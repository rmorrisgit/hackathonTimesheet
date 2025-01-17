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
  { field: 'wNum', headerName: 'W#', flex: 0.5 },
  { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'group', headerName: 'Group', flex: 0.7 },
  { field: 'role', headerName: 'Role', flex: 0.7 },
  {
    field: 'view',
    headerName: 'View',
    flex: 0.3,
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
          group: employee.group || 'N/A',
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
    <div className="employee_grid" style={{ padding: "20px" }}>
      {/* <h1 className="title">Employee Directory</h1> */}
      <Box sx={{  width: '100%', mt: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.wNum || row.id} // Ensure unique row IDs
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          // checkboxSelection
          
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
            // Optional: Navigate to employee detail page on row click

          // onRowClick={(params) => {
          //   window.location.href = `/employee/${params.row.wNum}`;
          // }}


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
