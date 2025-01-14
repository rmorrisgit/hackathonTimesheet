import mongoose from 'mongoose';
import { passwordStrength } from 'check-password-strength';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v); // Regex for basic email validation
        },
        message: 'Please enter a valid email address.',
      },
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
      validate: {
        validator: (v) => {
          const result = passwordStrength(v);
          return result.value === 'Medium' || result.value === 'Strong';
        },
        message:
          'Password too weak. Must be at least 8 characters and contain uppercase, lowercase, numbers, and symbols.',
      },
    },
    wNum: {
      type: String,
      required: false,
    },
    fund: {
      type: String,
      required: false,
    },
    dept: {
      type: String,
      required: false,
    },
    program: {
      type: String,
      required: false,
    },
    acct: {
      type: String,
      required: false,
    },
    project: {
      type: String,
      required: false,
    },
    hourlyRate: {
      type: Number,
      required: false,
      validate: {
        validator: function (v) {
          return v >= 0; // Validate that hourlyRate is non-negative
        },
        message: 'Hourly rate must be a non-negative number.',
      },
    },
  },
  { collection: 'users' }
);

export default model('User', userSchema);
