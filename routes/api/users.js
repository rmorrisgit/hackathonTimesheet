import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../../models/user.js';
import checkthetoken from '../../middleware/checkToken.js'

const router = express.Router();

// GET endpoint to fetch user data
router.get('/me',checkthetoken, async (req, res) => {
  try {
    const userId = req.user._id; // User ID from the JWT payload
    const user = await User.findById(userId).select('-password'); // Fetch user and exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});
//cool 
// Add a new route to fetch all employees
// Add a new route to fetch all employees
router.get('/employees', checkthetoken, async (req, res) => {
  try {
    const { _id, role, group } = req.user; // Extract user ID, role, and group from JWT payload
    let filter = {};

    if (role === 'admin') {
      filter = {};
    } else 
    if (role === 'supervisor') {
      // Supervisors see all users in their group
      if (!group) {
        return res.status(400).json({ error: 'No group assigned to supervisor.' });
      }
      filter.group = group.trim(); // Ensure no trailing spaces
    } else {
      // Employees only see their own record
      filter._id = _id;
    }

    const employees = await User.find(filter)
      .select('-password')  // Exclude password field
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

// Register endpoint
// Register endpoint
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
      role, // New field from request body
    } = req.body;

    // Validate the request body using Mongoose schema validation
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
      role: role || 'employee', // If none specified, default to 'employee'
    });

    console.log('New User:', newUser); // Debug log

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
        role: savedUser.role, // Include role in response
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

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

   // Generate a JSON Web Token (JWT) on successful login
   const token = jwt.sign(
    { _id: user._id,
      email: user.email,
      group: user.group,
      role: user.role, // Include role in the token
    },    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  

    // Send the token in a httpOnly cookie for secure storage
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

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', { path: '/' });
  res.status(204).send();
});

export default router;
