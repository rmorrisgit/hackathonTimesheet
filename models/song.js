import mongoose from 'mongoose'
const { Schema, model } = mongoose
//define our schema 
const songSchema = new Schema({    

    title: {
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    releaseYear: Number,
    genres: [ String ],
    ratings: [ Number ]

}, {collection: 'CoolSongs'})

export default model('Song', songSchema)


//export