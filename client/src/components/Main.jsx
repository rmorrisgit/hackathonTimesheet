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
        console.log("Fetched Timesheets:", response); // Debug log

        setTimesheets(
          response.map((timesheet, index) => ({
            id: timesheet._id || index, // Use _id from backend or fallback to index
            employeeName: `${timesheet.firstName} ${timesheet.lastName}`, // Use firstName and lastName
            wNum: timesheet.wNum || "N/A", // Default to N/A if wNum is missing
            contractEndDate: timesheet.contractEndDate,
            week1Total: timesheet.week1
              ? Object.values(timesheet.week1).reduce((sum, day) => sum + (day.hours || 0), 0)
              : 0,
            week2Total: timesheet.week2
              ? Object.values(timesheet.week2).reduce((sum, day) => sum + (day.hours || 0), 0)
              : 0,
            payPeriodStart: timesheet.payPeriodStartDate || "N/A",
            payPeriodEnd: timesheet.payPeriodEndDate || "N/A",
          }))
        );
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
