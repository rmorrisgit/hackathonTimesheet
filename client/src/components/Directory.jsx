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
  { field: 'employeeName', headerName: 'Employee Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 200 },
  { field: 'group', headerName: 'Group', width: 200 },
  {
    field: 'view',
    headerName: 'View',
    width: 100,
    renderCell: (params) => (
      // Use wNum in the route
      <IconButton href={`/employee/${params.row.wNum}`}>
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

        // Map the API data to match DataGrid's structure
        // If wNum might be missing, provide a fallback so it's never undefined
        const mappedRows = employees.map((employee, index) => ({
          wNum: employee.wNum || 'N/A',
          employeeName: `${employee.firstName} ${employee.lastName}`,
          email: employee.email || 'N/A',
          role: employee.role || 'N/A',
          // If employee.group is an object, ensure you display only the name
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
    <div className="employee_grid">
      <h1 className="title">Employee Directory</h1>
      <Box sx={{ height: 650, width: '100%', mt: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          // Tell the grid to use wNum as the unique row ID
          getRowId={(row) => row.wNum}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}
