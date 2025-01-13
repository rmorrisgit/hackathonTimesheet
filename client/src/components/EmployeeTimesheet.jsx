import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'Date',
    headerName: 'Date',
    width: 150,
    editable: true,
  },
  {
    field: 'HoursWorked',
    headerName: 'Hours Worked',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Other Information',
    type: 'number',
    width: 410,
    editable: true,
  },

];

const rows = [
  { id: 1, HoursWorked: 'Snow', Date: 'Jon', age: 14 },
  { id: 2, HoursWorked: 'Lannister', Date: 'Cersei', age: 31 },
  { id: 3, HoursWorked: 'Lannister', Date: 'Jaime', age: 31 },
  { id: 4, HoursWorked: 'Stark', Date: 'Arya', age: 11 },
  { id: 5, HoursWorked: 'Targaryen', Date: 'Daenerys', age: null },
  { id: 6, HoursWorked: 'Melisandre', Date: null, age: 150 },
  { id: 7, HoursWorked: 'Clifford', Date: 'Ferrara', age: 44 },
  { id: 8, HoursWorked: 'Frances', Date: 'Rossini', age: 36 },
  { id: 9, HoursWorked: 'Roxie', Date: 'Harvey', age: 65 },
];
function createData(
    name,
    calories,
    fat,
    carbs,
    protein,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows2 = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  
function EmployeeTimesheet() {
  return (
    <>
    <Box sx={{ height: 400, width: '100%', marginTop: '320px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows2.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />

                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  </>
  );
}

export default EmployeeTimesheet;
