require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
    skip: (req, res) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, res) => req.method !== 'POST'
}))

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: "malformed id"})
    }

    else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.get('/api/persons', (req, res) => {
    PersonModel.find({})
        .then(result => res.json(result))
})

app.get('/info', (req, res) => {
    PersonModel.find({})
        .then(result => {
            res.send(`<div><p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p></div>`)
        })
})

app.get('/api/persons/:id', (req, res, next) => {
    console.log("Looking by ID")
    const id = req.params.id
    PersonModel.findById(id)
        .then(person => {
            if (person) res.json(person)
            else {
                res.statusMessage = "Person with that ID does not exist!"
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    PersonModel.findByIdAndRemove(id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
    const person = req.body

    const name = person.name
    const number = person.number

    const newPerson = new PersonModel({name, number})
    newPerson
        .save().then(result => res.json(result))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const name = body.name
    const number = body.number

    PersonModel.findByIdAndUpdate(id, {name, number}, {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})