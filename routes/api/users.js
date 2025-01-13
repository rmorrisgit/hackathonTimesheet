import express from 'express';
var router = express.Router();
import User from '../../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate fields based on model schema
    await User.validate(req.body);
    // Check if the email is already registered
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
        console.log('Existing user:', existingUser);
        if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with 10 salt rounds
    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      { _id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Set the token in a custom response header
    // res.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
    // res.setHeader('x-auth-token', token); 
    res.cookie('jwt', token, { httpOnly: true, path: '/' });

    res.status(201).json({     // Send success response
      message: 'User registered successfully!',
      user: {
        email: savedUser.email,
        _id: savedUser._id,
      },
    });
  }  catch (err) {
    console.error('Error during registration:', err);

    // Validation error handling
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }

    // Generic error handling
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  // Clear the 'jwt' cookie
  res.clearCookie('jwt', { path: '/' }); // Ensure the same path as when the cookie was set
  res.status(204).send(); // No content response
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // await Login.validate(req.body)

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send();
    }

    // Generate a JSON Web Token (JWT) on successful login
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }
    );

    // res.setHeader('Access-Control-Exporse-Headers', 'x-auth-token');
    // res.setHeader('x-auth-token', token);
    //send the token in a httpOnly cookie for secure storage.
    
    res.cookie('jwt', token, { httpOnly: true, path: '/' });
    res.status(200).json({ message: 'Login successful', user: { email: user.email, _id: user._id } });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.get('/login', (req, res) => res.send('hello login'));


router.post('/logout', (req, res) => {

res.clearCookie('jwt')
res.status(204).send()


})




export default router;
