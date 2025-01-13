import mongoose from 'mongoose'
const { Schema, model } = mongoose

    const harvestInfoSchema = new Schema({
        season: {
          type: String,
          required: false
        },
        harvestMethod: {
          type: String,
          required: false
        },
        altitude: {
          type: String, // Keeping it as String
          required: false, // Ensure it's not required
          validate: {
            validator: function (value) {
              // Only validate if a value is provided
              if (!value) return true;
              return /^[0-9]+m$/.test(value);
            },
            message: 'Altitude must be a number followed by "m" (e.g., "1200m").',
          },
        },
      });
      
      // Main schema for coffee
      const coffeeSchema = new Schema({
        coffeeName: {
          type: String,
          required: true,
          unique: true, // Ensure coffeeName is unique
        },
        origin: {
          type: String,
          required: true
        },
        processingMethod: {
          type: String,
          required: false
        },
        roastLevel: {
          type: String,
          required: true,
          enum: ['Light', 'Medium', 'Dark']  
        },
        flavorNotes: {
          type: [String],  
          required: false
        },
        brewMethods: {
          type: [String],  
          required: false
        },
        image: {
          type: String,
          required: false
        },
        harvestInfo: {
          type: harvestInfoSchema,  // Embedded sub-schema
          required: false
        }
      }, {collection: 'coffee'

})

export default model('Coffee', coffeeSchema)