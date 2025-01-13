import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    try {
      console.log('Cookies:', req.cookies); // Log cookies
      const token = req.cookies?.jwt;
      console.log('Extracted Token:', token); // Log extracted token
  
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user to request
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };