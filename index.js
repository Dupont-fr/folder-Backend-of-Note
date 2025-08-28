const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const { StatusCodes } = require('http-status-codes')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

// 🔹 Connexion MongoDB via Render (avec variable d’environnement MONGODB_URI)
const url = process.env.MONGODB_URI
if (!url) {
  console.error('MongoDB URI is not defined!')
  process.exit(1)
}
mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error))

// 🔹 Définition du modèle Note
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
  date: Date,
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Note = mongoose.model('Note', noteSchema)

// 📌 ROUTES
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => res.json(notes))
})

app.post('/api/notes', (req, res) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note.save().then((savedNote) => res.json(savedNote))
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    if (note) res.json(note)
    else res.status(StatusCodes.NOT_FOUND).end()
  })
})

// ...existing code...
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(StatusCodes.NO_CONTENT).end())
    .catch((error) => next(error))
})
// ...existing code...

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined! Check Render Environment settings')
  process.exit(1)
}
console.log('MongoDB URI:', process.env.MONGODB_URI)

app.use((error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  next(error)
})
