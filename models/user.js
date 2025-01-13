import mongoose from 'mongoose'
import { passwordStrength } from "check-password-strength";

const { Schema, model } = mongoose

const userSchema = new Schema({
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
    },
    { collection: 'users' }
  );






export default model('User', userSchema)