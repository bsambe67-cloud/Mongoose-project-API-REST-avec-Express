// server.js
// API REST (CRUD) pour gérer des utilisateurs avec Express et Mongoose

// 1. Chargement des variables d'environnement depuis config/.env
require("dotenv").config({ path: "./config/.env" });

// 2. Importation des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

// 3. Création de l'application Express
const app = express();

// Middleware : permet de lire le JSON envoyé dans le body des requêtes
app.use(express.json());

// 4. Connexion à MongoDB Atlas, puis démarrage du serveur
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté !");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
  });

// ---------------- ROUTES ----------------

// GET /users : retourne tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /users : ajoute un nouvel utilisateur
app.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    // 11000 = email déjà utilisé
    if (err.code === 11000) {
      return res.status(409).json({ message: "Cet email existe déjà" });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT /users/:id : modifie un utilisateur par son id
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // renvoie le document modifié + validation
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /users/:id : supprime un utilisateur par son id
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Utilisateur supprimé", user: deletedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
