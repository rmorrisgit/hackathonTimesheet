import mongoose from 'mongoose'
const { Schema, model } = mongoose

const loginSchema = new Schema({
email: {
type: String,
required: true},
password: {
type: String,
required: true}
}, {collection: 'users'}); 




export default new model('Login', loginSchema)