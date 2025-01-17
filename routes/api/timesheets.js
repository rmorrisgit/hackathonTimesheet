// Routes: routes/timesheets.js
import express from 'express';
import Timesheet from '../../models/timesheet.js'
import checkthetoken from '../../middleware/checkToken.js'
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';  // Ensure pdf-lib is installed
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// GET /timesheets -> Filter by role/group
router.get('/', checkthetoken, async (req, res) => {
  try {
    const { _id, role, group, wNum } = req.user; // from JWT payload
    let filter = {};

    if (role === 'admin') {
      // Admin sees all timesheets
      filter = {};
    } else if (role === 'supervisor') {
      // Supervisor sees timesheets for employees in their group
      if (!group) {
        return res.status(400).json({ error: 'No group assigned to this supervisor.' });
      }
      filter.group = group; // e.g. "HR"
    } else {
      // Regular employees see only their own timesheets
      filter.wNum = wNum; 
    }

    const timesheets = await Timesheet.find(filter);
    return res.status(200).json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
});

// GET a single employee's timesheets
router.get('/:wNum', async (req, res) => {
  const { wNum } = req.params;
  const timesheets = await Timesheet.find({ 'employeeInfo.wNum': wNum });
  res.json(timesheets);
});

router.post('/api/timesheets', async (req, res) => {
  try {
    const timesheetData = req.body; // Capture the payload from the frontend
    const newTimesheet = new Timesheet(timesheetData); // Create a new timesheet document
    await newTimesheet.save(); // Save it to the database
    res.status(201).json(newTimesheet); // Respond with the created timesheet
  } catch (error) {
    console.error("Error creating timesheet:", error);
    res.status(500).json({ error: "Failed to create timesheet" });
  }
});

router.post('/generate-pdf', async (req, res) => {
  const payload = req.body; // Assuming you send the payload with the necessary data like firstName, lastName, etc.
  try {
    console.log("endpoint hit try");
    const pdfPath = path.resolve(__dirname, '../../client/public/pdfTemplate/timesheetTemplate.pdf');  // Adjust path to your template
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      
      // first name
      firstPage.drawText(`${payload.firstName} ${payload.lastName}`, {
        x: 230,
        y: 590-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // w number
      firstPage.drawText(`${payload.wNum}`, {
        x: 420,
        y: 590-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // chunk one
      // fund
      firstPage.drawText(`${payload.fund}`, {
        x: 85,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // dept
      firstPage.drawText(`${payload.dept}`, {
        x: 117,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // programme
      firstPage.drawText(`${payload.program}`, {
        x: 150,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // acct
      firstPage.drawText(`${payload.acct}`, {
        x: 200,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      //project
      firstPage.drawText(`${payload.project}`, {
        x: 235,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // chunk 2
      // period start
      firstPage.drawText(`${payload.payPeriodStartDate}`, {
        x: 315,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // period end
      firstPage.drawText(`${payload.payPeriodEndDate}`, {
        x: 440,
        y: 500-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // hourly rate
      firstPage.drawText(`${payload.hourlyRate}`, {
        x: 230,
        y: 430-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // casAux
      if(payload.isCasual === true){ // casual
        firstPage.drawText(`X`, {
          x: 469,
          y: 445-10,
          size: 9,
          font,
          color: rgb(0, 0, 0)
        });
      }else{ // aux cable. lol
        firstPage.drawText(`X`, {
          x: 469,
          y: 425-10,
          size: 9,
          font,
          color: rgb(0, 0, 0)
        });
      };
      

      // week chunk 1
      // sunday  1
      // hours
      firstPage.drawText(`${payload.week1.sunday.hours}`, {
        x: 225,
        y: 298-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.sunday.info}`, {
        x: 295,
        y: 298-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // monday  1
      // hours
      firstPage.drawText(`${payload.week1.monday.hours}`, {
        x: 225,
        y: 275-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.monday.info}`, {
        x: 295,
        y: 275-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // tues 1
      // hours
      firstPage.drawText(`${payload.week1.tuesday.hours}`, {
        x: 225,
        y: 255-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.tuesday.info}`, {
        x: 295,
        y: 255-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // wednesday  1
      // hours
      firstPage.drawText(`${payload.week1.wednesday.hours}`, {
        x: 225,
        y: 235-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.wednesday.info}`, {
        x: 295,
        y: 235-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // thur 1
      // hours
      firstPage.drawText(`${payload.week1.thursday.hours}`, {
        x: 225,
        y: 215-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.thursday.info}`, {
        x: 295,
        y: 215-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // friday  1
      // hours
      firstPage.drawText(`${payload.week1.friday.hours}`, {
        x: 225,
        y: 195-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.friday.info}`, {
        x: 295,
        y: 195-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // saturday  1
      // hours
      firstPage.drawText(`${payload.week1.saturday.hours}`, {
        x: 225,
        y: 175-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      firstPage.drawText(`${payload.week1.saturday.info}`, {
        x: 295,
        y: 175-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // tot 1
      firstPage.drawText(`${payload.week1.sunday.hours + payload.week1.monday.hours + payload.week1.tuesday.hours + payload.week1.wednesday.hours + payload.week1.thursday.hours + payload.week1.friday.hours + payload.week1.saturday.hours}`, {
        x: 240,
        y: 155-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });
      
      //////// page 2 ////////
    
      // week chunk 2
      // sunday  2
      // hours
      secondPage.drawText(`${payload.week2.sunday.hours}`, {
        x: 225,
        y: 298+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.sunday.info}`, {
        x: 295,
        y: 298+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // monday  2
      // hours
      secondPage.drawText(`${payload.week2.monday.hours}`, {
        x: 225,
        y: 275+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.monday.info}`, {
        x: 295,
        y: 275+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // tues 2
      // hours
      secondPage.drawText(`${payload.week2.tuesday.hours}`, {
        x: 225,
        y: 255+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.tuesday.info}`, {
        x: 295,
        y: 255+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // wednesday  2
      // hours
      secondPage.drawText(`${payload.week2.wednesday.hours}`, {
        x: 225,
        y: 235+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.wednesday.info}`, {
        x: 295,
        y: 235+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // thur 2
      // hours
      secondPage.drawText(`${payload.week2.thursday.hours}`, {
        x: 225,
        y: 215+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.thursday.info}`, {
        x: 295,
        y: 215+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // friday  2
      // hours
      secondPage.drawText(`${payload.week2.friday.hours}`, {
        x: 225,
        y: 195+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.friday.info}`, {
        x: 295,
        y: 195+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // saturday  2
      // hours
      secondPage.drawText(`${payload.week2.saturday.hours}`, {
        x: 225,
        y: 175+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info
      secondPage.drawText(`${payload.week2.saturday.info}`, {
        x: 295,
        y: 175+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // tot 2
      secondPage.drawText(`${payload.week2.sunday.hours + payload.week2.monday.hours + payload.week2.tuesday.hours + payload.week2.wednesday.hours + payload.week2.thursday.hours + payload.week2.friday.hours + payload.week2.saturday.hours}`, {
        x: 240,
        y: 155+357-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });


      // 'entered' grand tot
      secondPage.drawText(`${payload.week1.sunday.hours + payload.week1.monday.hours + payload.week1.tuesday.hours + payload.week1.wednesday.hours + payload.week1.thursday.hours + payload.week1.friday.hours + payload.week1.saturday.hours+payload.week2.sunday.hours + payload.week2.monday.hours + payload.week2.tuesday.hours + payload.week2.wednesday.hours + payload.week2.thursday.hours + payload.week2.friday.hours + payload.week2.saturday.hours}`, {
        x: 548,
        y: 478-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });

      // info comments
      secondPage.drawText(``, {
        x: 232,
        y: 438-10,
        size: 9,
        font,
        color: rgb(0, 0, 0)
      });
    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Write the PDF to the server's disk (you can also serve it directly as a response)
    const outputPdfPath = path.resolve(__dirname, '../../client/public/GeneratedTimesheet.pdf');
    fs.writeFileSync(outputPdfPath, pdfBytes);

    // Respond with the URL of the generated PDF
    res.json({ message: 'PDF generated successfully', pdfUrl: '/GeneratedTimesheet.pdf' });
  } catch (error) {
    console.log("endpoint hit catch");
    console.error('Error generating PDF:', error.stack);
  }
});

// POST a new timesheet
router.post('/', async (req, res) => {
  const timesheet = new Timesheet(req.body);
  await timesheet.save();
  res.status(201).json(timesheet);
});

// PUT to update a timesheet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTimesheet = await Timesheet.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedTimesheet);
});

// DELETE a timesheet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Timesheet.findByIdAndDelete(id);
  res.status(204).end();
});

export default router;
