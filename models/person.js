const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// eslint-disable-next-line no-undef
const dbUrl = process.env.MONGODB_URL

console.log('Connecting to database...')
mongoose.connect(dbUrl)
  .then(() => console.log('Connected!'))
  .catch(error => {
    console.log('There was an error during connection.', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (value) => {
        if (value.length < 8) return false
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PersonModel = mongoose.model('Person', personSchema)

module.exports = PersonModel