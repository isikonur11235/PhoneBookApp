const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://donttt1876:${password}@phonebookapp.undiuzc.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})



const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name:name,
  number:number,
})

if(process.argv.length < 4){

    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
        process.exit(0)
      })
}else{

    
person.save().then(result => {
    console.log(`added ${name} ${number} to the phonebook`)
    mongoose.connection.close()
  })
    
}


