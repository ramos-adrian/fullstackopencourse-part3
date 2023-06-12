const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
    skip: (req, res) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, res) => req.method !== 'POST'
}))

let persons =
    [
        {
            "id": 1,
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": 2,
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": 3,
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": 4,
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

const getNewId = () => Math.floor(Math.random() * 999)

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p></div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) res.json(person)
    else {
        res.statusMessage = "Person with that ID does not exist!"
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
    const person = req.body

    const newId = getNewId()
    const name = person.name
    const number = person.number

    if (persons.find(p => p.name === name)) {
        res.status(400).json({error: 'A person with that name already exists'})
        return;
    }

    if (!name) {
        res.status(400).json({error: 'Name is missing'})
        return
    }

    if (!number) {
        res.status(400).json({error: 'Number is missing'})
        return
    }

    const newPerson = {
        id: newId,
        name: name,
        number: number
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

app.use(cors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Listening on port 3001...")
})