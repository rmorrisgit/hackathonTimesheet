import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import User from '../../models/user.js';
import Timesheet from '../../models/timesheet.js';
import checkthetoken from '../../middleware/checkToken.js';

const router = express.Router();

/**
 * GET /timesheets
 * Return timesheets filtered by role/group/wNum
 */
router.get('/timesheets', checkthetoken, async (req, res) => {
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
      filter.group = group.trim(); // must match the Timesheet schema's group field
    } else {
      // Regular employees only see their own timesheets (by wNum, e.g.)
      filter.wNum = wNum;
    }

    const timesheets = await Timesheet.find(filter);
    res.status(200).json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
});

/**
 * GET /me
 * Fetch the currently logged-in user's data (excluding password)
 */
router.get('/me', checkthetoken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

/**
 * GET /employees
 * Fetch employees filtered by role/group
 */
router.get('/employees', checkthetoken, async (req, res) => {
  try {
    const { _id, role, group } = req.user;
    let filter = {};

    if (role === 'admin') {
      filter = {};
    } else if (role === 'supervisor') {
      // Supervisors see all users in their group
      if (!group) {
        return res.status(400).json({ error: 'No group assigned to supervisor.' });
      }
      filter.group = group.trim();
    } else {
      // Employees only see their own record
      filter._id = _id;
    }

    const employees = await User.find(filter)
      .select('-password')  // Exclude password
      .populate('group');   // If group is a reference, populate details

    if (!employees.length) {
      return res.status(404).json({ error: 'No employees found for this user/role.' });
    }

    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

/**
 * POST /register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      wNum,
      fund,
      dept,
      program,
      acct,
      project,
      hourlyRate,
      contractStartDate,
      contractEndDate,
      assignmentType,
      group,
      role
    } = req.body;

    // Validate request body via Mongoose schema
    await User.validate(req.body);

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      wNum,
      fund,
      dept,
      program,
      acct,
      project,
      hourlyRate,
      contractStartDate: contractStartDate ? new Date(contractStartDate) : null,
      contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
      assignmentType,
      group,
      role: role || 'employee',
    });

    console.log('New User:', newUser);

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        wNum: savedUser.wNum,
        fund: savedUser.fund,
        dept: savedUser.dept,
        program: savedUser.program,
        acct: savedUser.acct,
        project: savedUser.project,
        hourlyRate: savedUser.hourlyRate,
        contractStartDate: savedUser.contractStartDate,
        contractEndDate: savedUser.contractEndDate,
        assignmentType: savedUser.assignmentType,
        group: savedUser.group,
        role: savedUser.role
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }

    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

/**
 * POST /login
 * Log in the user, issue JWT as httpOnly cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Include wNum in the JWT if you want to filter timesheets by wNum
    const token = jwt.sign(
      {
        _id: user._id,
        wNum: user.wNum,
        email: user.email,
        group: user.group,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token in httpOnly cookie
    res.cookie('jwt', token, { httpOnly: true, path: '/' });
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        _id: user._id,
        wNum: user.wNum,
        fund: user.fund,
        dept: user.dept,
        program: user.program,
        acct: user.acct,
        role: user.role,
        group: user.group,
        project: user.project,
        hourlyRate: user.hourlyRate,
        contractStartDate: user.contractStartDate,
        contractEndDate: user.contractEndDate,
        assignmentType: user.assignmentType,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * POST /logout
 * Clears the JWT cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', { path: '/' });
  res.status(204).send();
});

export default router;
