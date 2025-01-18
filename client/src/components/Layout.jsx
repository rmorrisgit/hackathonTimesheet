import React from 'react';
import Footer from './Footer'; // Import Footer component
import '../css/layout.css'; // Add optional CSS for layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
