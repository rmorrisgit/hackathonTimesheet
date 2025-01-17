import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const dayEnum = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const timesheetSchema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
    wNum: { type: String, required: false },
    group: { type: String, required: false },
    role: { type: String, default: "employee" },
    fund: { type: String, required: false },
    dept: { type: String, required: false },
    program: { type: String, required: false },
    acct: { type: String, required: false },
    project: { type: String, required: false },
    payPeriodStartDate: { type: Date, required: true },
    payPeriodEndDate: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    isCasual: { type: Boolean, required: true },
    contractEndDate: { type: Date, required: false },
    week1: [
      {
        day: { type: String, enum: dayEnum },
        hours: { type: Number, default: 0 },
        info: { type: String, default: "" },
      },
    ],
    week2: [
      {
        day: { type: String, enum: dayEnum },
        hours: { type: Number, default: 0 },
        info: { type: String, default: "" },
      },
    ],
    submissionDate: { type: Date, required: false },
  },
  { collection: 'timesheets', timestamps: true }
);


export default model('Timesheet', timesheetSchema);
