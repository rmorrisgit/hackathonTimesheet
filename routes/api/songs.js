import express from 'express';
import Song from '../../models/song.js'

var router = express.Router();
  //GET ALL SONGS
router.get('/', async (req, res) => {
  try{
    const data = await Song.find().exec();

    res.json(data)
  } catch (err) {
    res.statusCode(500).send()

    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try { 
    const data = await Song.findById(req.params.id).exec(); //Mongoose query

    if(!data){
      return res.status(404).send()
    }
    res.json(data) //respond with data
  } catch (err) {
    res.status(500).send() // Handle server error
  }
});

// CREATE NEW SONG
router.post('/',  async (req, res) => {
  try{
    const newSong = new Song(req.body)    //create a new model from scratch
    const document = await newSong.save()
    res.status(201).json(document)
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(422).send(err)
    } else {
    res.status(500).send() //server
  }
}
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id).exec()
    console.log(deletedSong)

    if (!deletedSong){
      return res.status(404).send() //not found
    }
    res.status(204).send()  //deleted successfully
  } catch(err) {
    res.status(500).send()
  }

});

export default router;



// //GET SONG BY ID 
// 
  //   router.get('/:id', function(req, res) {
  //   res.send(`GET SONG WITH ID ${req.params.id}`);
  // });
// 
    // Song.find()
    //     .exec()
    //     .then(data => res.send(data)) //all good
    //     .catch(err => res.statusCode(500).send()) //server problem
//