import express from 'express';
import Coffee from '../../models/coffee.js'
import checkthetoken from '../../middleware/checkToken.js'
var router = express.Router();
 //GET ALL OBJECTS
router.get('/', async (req, res) => {
  try {
    const data = await Coffee.find().exec(); //MONGOOSE QUERY

    res.json(data)
  } catch (err) {
    res.statusCode(500).send()
    console.log(err);
  }
});
//GET COFFEE BY ID
router.get('/:id', async (req, res) => {
  try{
    const data = await Coffee.findById(req.params.id).exec();

    if(!data){
      return res.status(404).send()
    }

    res.json(data)
   } catch (err) {
    res.status(500).send()
  }
});

router.post('/', checkthetoken, async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming payload
    await Coffee.validate(req.body); // Validate fields
    const newCoffee = new Coffee(req.body); // Create a new Coffee instance
    const document = await newCoffee.save(); // Save the document to the database

    res.status(201).json(document); // Return the created document
  } catch (err) {
    console.error('Error in POST /api/coffees:', err); // Log the full error object
    if (err.name === 'ValidationError') {
      res.status(422).json({ error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
});


router.put('/:id', checkthetoken, async (req, res) => {
  try {
    // Sanitize the incoming payload
    const sanitizedData = {
      ...req.body,
      flavorNotes: req.body.flavorNotes || [],
      brewMethods: req.body.brewMethods || [],
      harvestInfo: req.body.harvestInfo || undefined,
    };

    console.log('Incoming payload:', req.body);
    console.log('Sanitized payload:', sanitizedData);

    // Validate the sanitized data against the schema
    await Coffee.validate(sanitizedData);

    // Find the coffee document by ID
    const coffee = await Coffee.findById(req.params.id).exec();
    if (!coffee) {
      return res.status(404).json({ error: 'Coffee not found.' });
    }

    // Update the document with new data
    Object.assign(coffee, sanitizedData);

    // Save the updated document with validation
    const updatedCoffee = await coffee.save({ validateBeforeSave: true });

    // Respond with the updated coffee
    res.json(updatedCoffee);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error('Validation error:', err.errors);
      return res.status(422).json({ error: 'Validation error', details: err.errors });
    }
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



//DELETE BY ID
router.delete('/:id', checkthetoken, async (req, res) => {
  try {
    const deletedCoffee = await Coffee.findByIdAndDelete(req.params.id).exec()
    console.log(deletedCoffee)

    if (!deletedCoffee){
      return res.status(404).send() 
    }
  
    res.status(204).send()      //deleted successfully
  } catch (err) {
    res.status(500).send()
  }
});

export default router;