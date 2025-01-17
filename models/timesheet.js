import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const timesheetSchema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 100 }, // Store employee first name
    lastName: { type: String, required: true, maxlength: 100 },  // Store employee last name
    wNum: { type: String, required: false },
    group: { type: String, required: false  }, // Optional reference to a group
    fund: { type: String, required: false },
    dept: { type: String, required: false },
    program: { type: String, required: false },
    acct: { type: String, required: false },
    project: { type: String, required: false },
    payPeriodStartDate: { type: Date, required: true },
    payPeriodEndDate: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    isCasual: { type: Boolean, required: true },
    contractEndDate: { type: Date, required: false }, // <--- Added contractEndDate
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
    submissionDate: { type: Date, required: false }, // Added submissionDate field
  },
  { collection: 'timesheets', timestamps: true }
);

export default model('Timesheet', timesheetSchema);
