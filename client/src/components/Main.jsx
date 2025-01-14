import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import timesheetService from "../services/apiService";

const Main = () => {
  const [timesheets, setTimesheets] = useState([]); // State to hold timesheet data

  // Fetch timesheet data whenever the component is mounted
  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await timesheetService.getTimesheets(); 
        setTimesheets(response.map((timesheet, index) => ({
          id: timesheet._id || index, // Use _id from backend or fallback to index
          employeeName: timesheet.employeeInfo.employeeName,
          wNum: timesheet.employeeInfo.wNum,
          week1Total: Object.values(timesheet.week1).reduce((sum, day) => sum + day.hours, 0),
          week2Total: Object.values(timesheet.week2).reduce((sum, day) => sum + day.hours, 0),
          payPeriodStart: timesheet.block2.payPeriodStartDate,
          payPeriodEnd: timesheet.block2.payPeriodEndDate
        })));
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };
  
    fetchTimesheets();
  }, []);
  

  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "wNum", headerName: "W#", flex: 1 },
    { field: "week1Total", headerName: "Week 1 Total Hours", type: "number", flex: 1 },
    { field: "week2Total", headerName: "Week 2 Total Hours", type: "number", flex: 1 },
    { field: "payPeriodStart", headerName: "Pay Period Start", flex: 1 },
    { field: "payPeriodEnd", headerName: "Pay Period End", flex: 1 }
  ];

  return (
    <div style={{ height: 500, width: "100%", marginTop: "50px" }}>
      <DataGrid
        rows={timesheets}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default Main;
