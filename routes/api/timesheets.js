// Routes: routes/timesheets.js
import express from 'express';
import Timesheet from '../../models/timesheet.js'
const router = express.Router();

// GET all timesheets (Supervisors/Admins)
router.get('/', async (req, res) => {
  const timesheets = await Timesheet.find({});
  res.json(timesheets);
});

// GET a single employee's timesheets
router.get('/:wNum', async (req, res) => {
  const { wNum } = req.params;
  const timesheets = await Timesheet.find({ 'employeeInfo.wNum': wNum });
  res.json(timesheets);
});

// POST a new timesheet
router.post('/', async (req, res) => {
  const timesheet = new Timesheet(req.body);
  await timesheet.save();
  res.status(201).json(timesheet);
});

// PUT to update a timesheet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTimesheet = await Timesheet.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedTimesheet);
});

// DELETE a timesheet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Timesheet.findByIdAndDelete(id);
  res.status(204).end();
});

export default router;
