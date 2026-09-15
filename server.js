// Charge les variables privees du fichier .env avant d'ouvrir la connexion.
require('dotenv').config();

const mongoose = require('mongoose');

// Initialise la connexion MongoDB Atlas avec l'URI conservee dans .env.
// Mongoose 9 active deja useNewUrlParser et useUnifiedTopology par defaut.
mongoose.connect(process.env.MONGO_URI);

// Definit les champs d'une personne et les types attendus par MongoDB.
const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	age: Number,
	favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

// Enregistre une personne et renvoie le document cree au callback.
const createAndSavePerson = (done) => {
	const person = new Person({
		name: 'John Doe',
		age: 30,
		favoriteFoods: ['pizza', 'burritos']
	});

	person.save()
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Cree plusieurs personnes a partir du tableau fourni par l'appelant.
const createManyPeople = (arrayOfPeople, done) => {
	Person.create(arrayOfPeople)
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Recherche toutes les personnes portant le nom demande.
const findPeopleByName = (personName, done) => {
	Person.find({ name: personName })
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Recherche une personne qui aime l'aliment indique.
const findOneByFood = (food, done) => {
	Person.findOne({ favoriteFoods: food })
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Recherche une personne a partir de son identifiant MongoDB.
const findPersonById = (personId, done) => {
	Person.findById(personId)
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Ajoute hamburger aux aliments favoris avant d'enregistrer la personne.
const findEditThenSave = (personId, done) => {
	Person.findById(personId)
		.then((person) => {
			person.favoriteFoods.push('hamburger');
			return person.save();
		})
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Met a jour l'age d'une personne et renvoie la nouvelle version du document.
const findAndUpdate = (personName, done) => {
	Person.findOneAndUpdate(
		{ name: personName },
		{ age: 20 },
		{ new: true }
	)
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Supprime une personne a partir de son identifiant.
const removeById = (personId, done) => {
	const removeQuery = typeof Person.findByIdAndRemove === 'function'
		? Person.findByIdAndRemove(personId)
		: Person.findByIdAndDelete(personId);

	removeQuery
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Supprime toutes les personnes qui portent le nom Mary.
const removeManyPeople = (done) => {
	const removeQuery = typeof Person.remove === 'function'
		? Person.remove({ name: 'Mary' })
		: Person.deleteMany({ name: 'Mary' });

	removeQuery
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

// Trie les amateurs de burritos, limite le resultat et masque leur age.
const queryChain = (done) => {
	Person.find({ favoriteFoods: 'burritos' })
		.sort({ name: 1 })
		.limit(2)
		.select('-age')
		.exec()
		.then((data) => done(null, data))
		.catch((error) => done(error));
};

module.exports = {
	Person,
	createAndSavePerson,
	createManyPeople,
	findPeopleByName,
	findOneByFood,
	findPersonById,
	findEditThenSave,
	findAndUpdate,
	removeById,
	removeManyPeople,
	queryChain
};
