import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../../models/user.js';

const router = express.Router();

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
      payPeriodStartDate, // New field
      payPeriodEndDate,   // New field
      assignmentType,     // New field
    } = req.body;

    console.log('Request Body:', req.body);

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
      email,
      password: hashedPassword,
      wNum,
      fund,
      dept,
      program,
      acct,
      project,
      hourlyRate,
      payPeriodStartDate: payPeriodStartDate ? new Date(payPeriodStartDate) : null,
      payPeriodEndDate: payPeriodEndDate ? new Date(payPeriodEndDate) : null,
      assignmentType,
    });

    console.log('New User:', newUser);

    const savedUser = await newUser.save();

    // Include all fields in the response
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
        payPeriodStartDate: savedUser.payPeriodStartDate,
        payPeriodEndDate: savedUser.payPeriodEndDate,
        assignmentType: savedUser.assignmentType,
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
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
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
        payPeriodStartDate: user.payPeriodStartDate,
        payPeriodEndDate: user.payPeriodEndDate,
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
