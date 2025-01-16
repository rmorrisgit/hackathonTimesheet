import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import '../css/directory.css'
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'

const columns = [
    { field: 'id', headerName: 'W Number', width: 90, hide: true },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
      
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'payPeriodStart',
      headerName: 'Pay Period Start',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'payPeriodEnd',
      headerName: 'Pay Period End',
      type: 'date',
      editable: true,
      width: 130,
    },
    {
      field: 'submissionDate',
      headerName: 'Date Submitted',
      width: 130,
      type: 'date',
      editable: true,
    },
    {
      field: 'view',
      headerName: 'View',
      width: 50,
      renderCell: (params) => (
        <IconButton href={`/employee/${params.row.id}`}>
          <VisibilityIcon sx={{color: 'black', fontSize: 24}} />
        </IconButton>
      )
    },
  ];
  
  const rows = [
    { id: "w1234561", lastName: 'Snow', firstName: 'Jon',},
    { id: "w1234562", lastName: 'Lannister', firstName: 'Cersei', },
    { id: "w1234563", lastName: 'Lannister', firstName: 'Jaime',},
    { id: "w1234564", lastName: 'Stark', firstName: 'Arya',  },
    { id: "w1234565", lastName: 'Targaryen', firstName: 'Daenerys',},
    { id: "w1234566", lastName: 'Melisandre', firstName: 'Mike',},
    { id: "w1234567", lastName: 'Clifford', firstName: 'Ferrara', },
    { id: "w1234568", lastName: 'Frances', firstName: 'Rossini', },
    { id: "w1234569", lastName: 'Roxie', firstName: 'Harvey',},
    { id: "w1234560", lastName: 'John', firstName: 'Smith',},
  ];
  
  export default function EmployeeList() {
    return (
        <div className='employee_grid'>
            <h1 className='title'>Employee Timesheets</h1>
      <Box sx={{ height: 650, width: '100%' }}>
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
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        />
              </Box>
        </div>
    );
  }

// pay period start and end date 
// submission date