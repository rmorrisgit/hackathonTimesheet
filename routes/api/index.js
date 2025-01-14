import express from 'express';
var router = express.Router();

import songsRouter from './songs.js'
import usersRouter from './users.js'
import coffeesRouter from './coffees.js'
import timesheetRouter from './timesheets.js'


router.use('/songs', songsRouter)
router.use('/users', usersRouter)
router.use('/coffees', coffeesRouter)
router.use('/timesheets', timesheetRouter)


router.get('/', (req, res) => res.send('Welcome to the API'));



export default router;
