import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../css/directory.css';
import userService from '../services/userService';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  { field: 'employeeName', headerName: 'Employee Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'group', headerName: 'Group', width: 150 },
  {
    field: 'view',
    headerName: 'View',
    width: 100,
    renderCell: (params) => (
      <IconButton href={`/employee/${params.row.id}`}>
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
        // Fetch employees filtered by group
        const employees = await userService.getEmployees();

        console.log('Fetched Employees:', employees);

        // Map the API data to match DataGrid's structure
        const mappedRows = employees.map((employee, index) => ({
          id: employee._id || `row-${index}`,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          email: employee.email || 'N/A',
          role: employee.role || 'N/A',
          group: employee.group?.name || 'N/A', // Assuming group has a `name` field
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
