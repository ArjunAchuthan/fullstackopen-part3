import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const url = process.env.MONGODB_URI;

if (!url) {
  console.error("MongoDB URI is missing! Check .env file.");
  process.exit(1);
}

mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });


// Define Schema and Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
  console.log("Please provide the password as the first argument");
  process.exit(1);
}

if (name && number) {
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    console.log("Phonebook:");
    result.forEach(person => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}
