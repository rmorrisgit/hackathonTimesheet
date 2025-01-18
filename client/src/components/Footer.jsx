import React from 'react';
import { Typography, Box } from '@mui/material';
// import '../css/footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <Box
        sx={{
          backgroundColor: '#2D2D2C',
          color: 'white',
          padding: '10px 0',
          textAlign: 'center',
          marginTop: 'auto', 
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Timesheet Portal.
        </Typography>
        <Typography variant="body2">Developed by Ryan Morris, Dominique Yue-Skinner, Sam Watts, Breanna Young, Hiren Gajjar</Typography>
     </Box>
    </footer>
  );
};

export default Footer;

