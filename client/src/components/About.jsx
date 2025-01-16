import React from 'react';
import "../css/about.css";
import logo from '/public/img/nscclogo.png';  // Import the logo
//Just in case 
const About = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', marginLeft: 25 }}>       

            <div style={{ marginBottom: '20px' }}>
                <img src={logo} alt="NSCC Logo" style={{ maxWidth: '200px', height: 'auto' }} />
            </div>

            <h1>Hackathon 2025</h1>
        

            <h2>Authors</h2>
            <p>
              Ryan Morris, Breanna Young, Dominique Yue-Skinner, Hiren Gajjar, Sam Watts
              </p>

            <h2>How It Works</h2>

            <h3>Supervisor Registration</h3>
            <ul>
                <li>Supervisors must register using an email under the domain <strong>research#@nscc.ca</strong>.</li>
                <li>Once registered, supervisors gain access to manage employees in their department.</li>
            </ul>

            <h3>Employee Management</h3>
            <ul>
                <li>Supervisors can register new employees, linking them to their department.</li>
                <li>Employees will receive login credentials after being registered by a supervisor.</li>
            </ul>

            <h3>Timesheet Submission</h3>
            <ul>
                <li>Employees must submit timesheets for the previous two weeks worked.</li>
                <li>Employees will receive a notification the day payroll ends, signaling the start of the submission window.</li>
                <li>The submission window closes at <strong>11:59 PM</strong> two days after the payroll period ends.</li>
            </ul>

            <h3>Timesheet Approval</h3>
            <ul>
                <li>Supervisors can view submitted timesheets from employees in their department.</li>
                <li>Supervisors must review and sign off on timesheets to finalize them for payroll processing.</li>
            </ul>

            <h2>Payroll Cycle</h2>
            <p>
                Payroll runs on a biweekly schedule, ending every 15 days. Notifications are automatically sent to employees to remind them to submit their timesheets within the designated period.
            </p>

            <h2>Features</h2>
            <ul>
                <li>Secure user registration and authentication for supervisors and employees.</li>
                <li>Automated notifications for submission deadlines.</li>
                <li>Intuitive interface for managing and submitting timesheets.</li>
                <li>Role-specific permissions to ensure secure access and functionality.</li>
            </ul>

            <h2>Getting Started</h2>
            <ol>
                <li>Supervisors register using their NSCC Research email address.</li>
                <li>Supervisors add employees to their department through the portal.</li>
                <li>Employees log in to submit their timesheets within the specified deadlines.</li>
                <li>Supervisors review and approve submitted timesheets.</li>
            </ol>
        </div>
    );
};

export default About;
