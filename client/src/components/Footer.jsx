// Footer.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          backgroundColor: '#2D2D2C',
          color: 'white',
          padding: '10px 0',
          textAlign: 'center',
          marginTop: 'auto', // Pushes the footer to the bottom in the flex container
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Timesheet Portal.
        </Typography>
        <Typography variant="body2">
          Developed by Ryan Morris, Dominique Yue-Skinner, Sam Watts, Breanna Young, Hiren Gajjar
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;
