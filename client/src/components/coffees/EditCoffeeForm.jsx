import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
  Stack,
} from '@mui/material';
import apiService from '../../services/apiService';

const EditCoffeeForm = () => {
  const { coffeeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nameWarning, setNameWarning] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const coffee = await apiService.getCoffeeById(coffeeId);
        Object.entries(coffee).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              setValue(`${key}.${subKey}`, subValue || '');
            });
          } else {
            setValue(key, Array.isArray(value) ? value.join(', ') : value || '');
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch coffee:', err);
        alert('Failed to load coffee details.');
        setLoading(false);
      }
    };

    fetchCoffee();
  }, [coffeeId, setValue]);

  const onSubmit = async (data) => {
    setNameWarning('');
    const { __v, _id, ...cleanData } = {
      ...data,
      flavorNotes: typeof data.flavorNotes === 'string'
        ? data.flavorNotes.split(',').map((note) => note.trim())
        : [],
      brewMethods: typeof data.brewMethods === 'string'
        ? data.brewMethods.split(',').map((method) => method.trim())
        : [],
    };

    try {
      const existingCoffee = await apiService.getCoffeeByName(cleanData.coffeeName);
      if (existingCoffee && existingCoffee._id !== coffeeId) {
        setNameWarning('A coffee with this name already exists. Please choose a different name.');
        return;
      }

      await apiService.updateCoffee(coffeeId, cleanData);
      alert('Coffee updated successfully!');
      navigate(`/coffees/details/${coffeeId}`);
    } catch (err) {
      console.error('Failed to update coffee:', err);
      alert(err.message || 'Failed to update coffee.');
    }
  };

  const handleCancel = () => {
    navigate(`/coffees/details/${coffeeId}`);
  };

  if (loading) {
    return <Typography>Loading coffee details...</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        marginTop: '170px'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Coffee
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {nameWarning && <Alert severity="error" sx={{ mb: 2 }}>{nameWarning}</Alert>}

        <Stack spacing={3}>
          <TextField
            label="Coffee Name"
            fullWidth
            variant="outlined"
            error={!!errors.coffeeName || !!nameWarning}
            helperText={errors.coffeeName?.message || nameWarning}
            {...register('coffeeName', { required: 'Coffee Name is required.' })}
            onFocus={() => setNameWarning('')}
          />

          <TextField
            label="Origin"
            fullWidth
            variant="outlined"
            error={!!errors.origin}
            helperText={errors.origin?.message}
            {...register('origin', { required: 'Origin is required.' })}
          />

          <TextField
            label="Processing Method"
            fullWidth
            variant="outlined"
            {...register('processingMethod')}
          />

          <FormControl fullWidth variant="outlined" error={!!errors.roastLevel}>
            <InputLabel>Roast Level</InputLabel>
            <Select
              label="Roast Level"
              {...register('roastLevel', {
                required: 'Roast Level is required.',
                validate: (value) =>
                  ['Light', 'Medium', 'Dark'].includes(value) || 'Invalid roast level.',
              })}
            >
              <MenuItem value="">-- Select Roast Level --</MenuItem>
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
            <Controller
              name="image"
              control={control}
              rules={{ required: 'Image selection is required' }}
              render={({ field }) => (
                <Select {...field} label="Select Image">
                  <MenuItem value="">-- Select an Image --</MenuItem>
                  {imageOptions.map((img, idx) => (
                    <MenuItem key={idx} value={img}>
                      {img}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
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
            helperText={errors.harvestInfo?.altitude?.message || undefined}
            {...register('harvestInfo.altitude', {
              pattern: {
                value: /^[0-9]+m$/,
                message: 'Altitude must be a number followed by "m" (e.g., "1200m").',
              },
            })}
          />

        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Tooltip title="Save changes to this coffee">
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Tooltip>
          <Tooltip title="Cancel and go back to the coffee details page">
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Tooltip>
        </Stack>
      </form>
    </Box>
  );
};

export default EditCoffeeForm;
