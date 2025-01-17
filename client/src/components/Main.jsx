import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import timesheetService from "../services/apiService"; // Make sure apiService calls GET /timesheets

const Main = () => {
  const [timesheets, setTimesheets] = useState([]);

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
            group: timesheet.group || "N/A",            // <--- Add group field
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
      }
    };

    fetchTimesheets();
  }, []);

  // Add 'group' to the columns
  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "wNum", headerName: "W#", flex: 1 },
    { field: "group", headerName: "Group", flex: 1 }, // <--- New column
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

  return (
    <div style={{ height: 500, width: "100%", marginTop: "180px" }}>
      <DataGrid
        rows={timesheets}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default Main;
