const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { StatusCodes } = require('http-status-codes')
const Note = require('./models/note')
require('dotenv').config()
const baseUrl = '/api/notes'
let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2022-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-05-30T19:20:14.298Z',
    important: true,
  },
]

app.use(express.json())
app.use(express.static('dist'))

// // NE SAUVEGARDEZ PAS VOTRE MOT DE PASSE SUR GITHUB !!
// const password = process.argv[2]
// const url = `mongodb+srv://dupontdjeague:${password}@cluster0.t2xncq8.mongodb.net/Notes?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set(`strictQuery`, false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })
// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   },
// })

// const Note = mongoose.model('Note', noteSchema)

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello le monde!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) return response.json(note)

  response.status(StatusCodes.NOT_FOUND).end()
})

app.delete('/api/notes/:id', (request, response) => {
  const id = +request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(StatusCodes.NOT_CONTENT).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
