const { request, response, json } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', JSON.stringify(request.method))
  console.log('Path:  ', JSON.stringify(request.path))
  console.log('Body:  ', JSON.stringify(request.body))
  console.log('---')
  next()
}


app.use(requestLogger)
let persons = [

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




app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request,response) => {

  const date = new Date(Date.now()).toISOString();
  
  response.send(`<p>The phonebook has info for ${persons.length}</p><p>${date}</p>`)
  
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random() * 10000000000)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number missing' 
    })
  }

  if(persons.map(person => person.name === body.name)){
    return response.status(400).json({ 
      error: 'Name already on the list' 
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }
  persons = persons.concat(person)
  response.json(person)
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})