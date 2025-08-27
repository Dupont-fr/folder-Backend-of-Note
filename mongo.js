const mongoose = require(`mongoose`)

if (process.argv.length < 3) {
  console.log(`give password as argument`)
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://dupontdjeague:${password}@cluster0.t2xncq8.mongodb.net/Notes?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set(`strictQuery`, false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
const Note = mongoose.model(`Note`, noteSchema)

const notes = [
  { content: 'Browser can execute only JavaScript', important: false },
  { content: 'HTML is essy', important: true },
  {
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: false,
  },
  { content: 'like react programming', important: true },
]

// Note.insertMany(notes).then((result) => {
//   console.log(`note saved!`)
//   mongoose.connection.close()
// })
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
