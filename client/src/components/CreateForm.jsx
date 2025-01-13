import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Alert,
  Box,
  Tooltip,
  Stack,
} from '@mui/material';
import apiService from '../services/apiService';

const Create = () => {
  const navigate = useNavigate();
  const [nameWarning, setNameWarning] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      coffeeName: '',
      origin: '',
      processingMethod: '',
      roastLevel: '',
      flavorNotes: '',
      brewMethods: '',
      image: '',
      harvestInfo: {
        season: '',
        harvestMethod: '',
        altitude: '',
      },
    },
  });

  const imageOptions = [
    '/images/cofv1.svg',
    '/images/cofv2.svg',
    '/images/cofv3.svg',
    '/images/cofv4.svg',
    '/images/cofv5.svg',
    '/images/cofv6.svg',
    '/images/cofv7.svg',
    '/images/cofv9.svg',
    '/images/cofv11.svg',
    '/images/cofv8.svg',
  ];

  const onSubmit = async (data) => {
    try {
      const existingCoffee = await apiService.getCoffeeByName(data.coffeeName);
      if (existingCoffee) {
        setNameWarning('A coffee with this name already exists. Please choose a different name.');
        return;
      }

      const payload = {
        ...data,
        flavorNotes: data.flavorNotes.split(',').map((note) => note.trim()),
        brewMethods: data.brewMethods.split(',').map((method) => method.trim()),
      };

      await apiService.createCoffee(payload);
      alert('Coffee created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating coffee:', err);
      alert('Failed to create coffee. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        maxWidth: 600, // Restrict the form width
        mx: 'auto', // Center align
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        marginTop: '170px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create a New Coffee
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {nameWarning && <Alert severity="error" sx={{ mb: 2 }}>{nameWarning}</Alert>}

        {/* Form Fields */}
        <Stack spacing={3}>
          <TextField
            label="Coffee Name"
            fullWidth
            variant="outlined"
            error={!!errors.coffeeName || !!nameWarning}
            helperText={errors.coffeeName?.message || nameWarning}
            {...register('coffeeName', { required: 'Coffee Name is required.' })}
          />

          <TextField
            label="Origin"
            fullWidth
            variant="outlined"
            error={!!errors.origin}
            helperText={errors.origin?.message}
            {...register('origin', { required: 'Origin is required.' })}
          />

          <FormControl fullWidth variant="outlined" error={!!errors.roastLevel}>
            <InputLabel>Roast Level</InputLabel>
            <Select
              label="Roast Level"
              {...register('roastLevel', {
                required: 'Roast Level is required.',
                validate: (value) => ['Light', 'Medium', 'Dark'].includes(value) || 'Invalid roast level.',
              })}
            >
              <MenuItem value="">Select roast level</MenuItem>
              <MenuItem value="Light">Light</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Dark">Dark</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Flavor Notes (comma-separated)"
            fullWidth
            variant="outlined"
            {...register('flavorNotes')}
          />

          <TextField
            label="Brew Methods (comma-separated)"
            fullWidth
            variant="outlined"
            {...register('brewMethods')}
          />

          <FormControl fullWidth variant="outlined" error={!!errors.image}>
            <InputLabel>Select Image</InputLabel>
            <Select
              label="Select Image"
              {...register('image', { required: 'Image selection is required.' })}
            >
              <MenuItem value="">Choose an image</MenuItem>
              {imageOptions.map((image, idx) => (
                <MenuItem key={idx} value={image}>
                  {image}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom>
            Harvest Info
          </Typography>

          <TextField
            label="Season"
            fullWidth
            variant="outlined"
            {...register('harvestInfo.season')}
          />
          <TextField
            label="Harvest Method"
            fullWidth
            variant="outlined"
            {...register('harvestInfo.harvestMethod')}
          />
          <TextField
            label="Altitude (e.g., 1200m)"
            fullWidth
            variant="outlined"
            error={!!errors.harvestInfo?.altitude}
            helperText={errors.harvestInfo?.altitude?.message}
            {...register('harvestInfo.altitude', {
              pattern: {
                value: /^[0-9]+m$/,
                message: 'Altitude must be in the format "1200m".',
              },
            })}
          />
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
      
          <Tooltip title="Save the new coffee details">
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Tooltip>
          <Tooltip title="Cancel and return to the main page">
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Tooltip>
        </Stack>
      </form>
    </Box>
  );
};

export default Create;
