import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const weeks = [
  {
    weekNumber: 1,
    dates: [
      { day: "Sunday", date: "November 17" },
      { day: "Monday", date: "November 18" },
      { day: "Tuesday", date: "November 19" },
      { day: "Wednesday", date: "November 20" },
      { day: "Thursday", date: "November 21" },
      { day: "Friday", date: "November 22" },
      { day: "Saturday", date: "November 23" },
    ],
  },
  {
    weekNumber: 2,
    dates: [
      { day: "Sunday", date: "November 24" },
      { day: "Monday", date: "November 25" },
      { day: "Tuesday", date: "November 26" },
      { day: "Wednesday", date: "November 27" },
      { day: "Thursday", date: "November 28" },
      { day: "Friday", date: "November 29" },
      { day: "Saturday", date: "November 30" },
    ],
  },
];

function EmployeeTimesheet() {
  const [page, setPage] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(
    weeks.flatMap((week) => week.dates).reduce((acc, row) => ({ ...acc, [row.date]: 0 }), {})
  );

  // Handle changes to "Hours Worked" input
  const handleHoursChange = (date, value) => {
    setHoursWorked((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  // Total hours for the current week (page)
  const totalHoursForCurrentPage = weeks[page].dates.reduce(
    (total, row) => total + parseFloat(hoursWorked[row.date] || 0),
    0
  );

  // Grand total hours across all weeks
  const grandTotalHours = Object.values(hoursWorked).reduce(
    (total, value) => total + parseFloat(value || 0),
    0
  );

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ padding: "20px", marginTop: "150px" }}>
      {/* Week Header */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Week {weeks[page].weekNumber}
      </Typography>

      {/* Paginated Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table aria-label={`Week ${weeks[page].weekNumber} Timesheet`} sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Hours Worked</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#d9e1f2" }}>Other Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks[page].dates.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <TextField
                    id={`hours-${row.date}`}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={hoursWorked[row.date]}
                    onChange={(e) => handleHoursChange(row.date, e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            opacity: 1,
                            pointerEvents: "none",
                          }}
                        >
                          hrs
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    id={`info-${row.date}`}
                    variant="outlined"
                    size="small"
                    placeholder="Enter details"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                Week {weeks[page].weekNumber} Total
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={totalHoursForCurrentPage.toFixed(2)}
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          opacity: 1,
                          pointerEvents: "none",
                        }}
                      >
                        hrs
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[7]} // Fixed 7 rows per page
        component="div"
        count={weeks.length * 7}
        rowsPerPage={7}
        page={page}
        onPageChange={handleChangePage}
      />

      {/* Grand Total Section */}
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Grand Total: {grandTotalHours.toFixed(2)} hrs
        </Typography>
      </Box>
    </Box>
  );
}

export default EmployeeTimesheet;
