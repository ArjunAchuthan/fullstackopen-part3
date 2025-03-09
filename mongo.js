import mongoose from 'mongoose';

// Get command-line arguments
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// MongoDB connection URL (replace with your actual connection string)
const url = `mongodb+srv://arjunachuthan05:Ineverfreez%401@phonebook.1ziyp.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`;

mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// If only the password is given, list all persons
if (!name || !number) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  // If name and number are given, add a new person
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
