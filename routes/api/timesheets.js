// Routes: routes/timesheets.js
import express from 'express';
import Timesheet from '../../models/timesheet.js'
import checkthetoken from '../../middleware/checkToken.js'

const router = express.Router();

// GET /timesheets -> Filter by role/group
router.get('/', checkthetoken, async (req, res) => {
  try {
    const { _id, role, group, wNum } = req.user; // from JWT payload
    let filter = {};

    if (role === 'admin') {
      // Admin sees all timesheets
      filter = {};
    } else if (role === 'supervisor') {
      // Supervisor sees timesheets for employees in their group
      if (!group) {
        return res.status(400).json({ error: 'No group assigned to this supervisor.' });
      }
      filter.group = group; // e.g. "HR"
    } else {
      // Regular employees see only their own timesheets
      filter.wNum = wNum; 
    }

    const timesheets = await Timesheet.find(filter);
    return res.status(200).json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
});

// GET a single employee's timesheets
router.get('/:wNum', async (req, res) => {
  const { wNum } = req.params;
  const timesheets = await Timesheet.find({ 'employeeInfo.wNum': wNum });
  res.json(timesheets);
});

router.post('/api/timesheets', async (req, res) => {
  console.log('Received Timesheet Data:', req.body);
  try {
    const newTimesheet = new Timesheet(req.body);
    await newTimesheet.save();
    res.status(201).json(newTimesheet);
  } catch (error) {
    console.error('Error creating timesheet:', error);
    res.status(500).json({ error: 'Failed to create timesheet' });
  }
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
