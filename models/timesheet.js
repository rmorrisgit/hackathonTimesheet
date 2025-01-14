import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const timesheetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    employeeInfo: {
      employeeName: { type: String, required: true },
      wNum: { type: String, required: true },
      isAdmin: { type: Boolean, required: true },
    },
    block1: {
      fund: { type: String, required: true },
      dept: { type: String, required: true },
      program: { type: String, required: true },
      acct: { type: String, required: true },
      project: { type: String, required: true },
    },
    block2: {
      payPeriodStartDate: { type: String, required: true },
      payPeriodEndDate: { type: String, required: true },
    },
    block3: {
      hourlyRate: { type: Number, required: true },
      isCasual: { type: Boolean, required: true },
    },
    week1: {
      sun: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      mon: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      tue: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      wed: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      thu: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      fri: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      sat: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
    },
    week2: {
      sun: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      mon: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      tue: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      wed: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      thu: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      fri: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
      sat: { hours: { type: Number, default: 0 }, info: { type: String, default: '' } },
    },
    notes: { type: String, default: '' },
  },
  { collection: 'timesheets', timestamps: true }
);

export default model('Timesheet', timesheetSchema);
