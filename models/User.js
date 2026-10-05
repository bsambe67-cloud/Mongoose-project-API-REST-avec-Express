// models/User.js
// Définition du schéma Mongoose et export du modèle User

const mongoose = require("mongoose");

// Schéma : décrit la structure d'un document "user" dans MongoDB
const userSchema = new mongoose.Schema(
  {
    // Nom de l'utilisateur (obligatoire)
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    // Email (obligatoire et unique)
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Âge (optionnel)
    age: {
      type: Number,
      min: [0, "L'âge ne peut pas être négatif"],
    },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// On exporte le modèle pour l'utiliser dans server.js
module.exports = mongoose.model("User", userSchema);
