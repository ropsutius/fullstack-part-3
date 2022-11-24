const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password, as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const pwd = process.argv[2];
const url = `mongodb+srv://ropsutius:${pwd}@cluster0.gmbbdso.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  mongoose
    .connect(url)
    .then((result) => {
      Person.find({}).then((result) => {
        console.log('phonebook:');
        result.forEach((person) => {
          console.log(person.name, person.number);
        });
        mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected');

      const person = new Person({
        name: name,
        number: number,
      });

      return person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
      });
    })
    .then(() => mongoose.connection.close())
    .catch((err) => console.log(err));
}
