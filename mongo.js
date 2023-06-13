const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Give password as an argument")
    process.exit(1)
}

const pass = process.argv[2]
const dbUrl = `mongodb+srv://ramosadriand:${pass}@fullstackopen.2rh79pu.mongodb.net/ContactsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
console.log("Connecting to database")
mongoose.connect(dbUrl)
    .then(r => console.log("Connected"))
    .catch(e => {
        console.log("Error while connecting.", e.message)
        process.exit(1)
    })

const schema = new mongoose.Schema({
    name: String,
    number: Number
})

const noteModel = mongoose.model('Person', schema)

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newNote = new noteModel({name, number})
    newNote.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    noteModel.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}
