require("dotenv").config();
const { request, response, json } = require("express");
const express = require("express");
const Person = require("./models/person.jsx");

const app = express();
app.use(express.json());
app.use(express.static("dist"));

const cors = require("cors");
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", JSON.stringify(request.method));
  console.log("Path:  ", JSON.stringify(request.path));
  console.log("Body:  ", JSON.stringify(request.body));
  console.log("---");
  next();
};

app.use(requestLogger);

const errorHandler = (error, request, response, next) => {
  
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
 
}
 

app.use(errorHandler)


app.get("/", (request, response) => {
  response.send("hello world");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  const date = new Date(Date.now()).toISOString();

  response.send(
    `<p>The phonebook has info for ${Person.length}</p><p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response,next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const id = Math.floor(Math.random() * 10000000000);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: id,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
   name:body.name,
   number:body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
