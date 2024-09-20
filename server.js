const express = require("express");
const path = require("path");
const logic = require("./core/logic");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middleware pour parser les données en JSON
app.use(express.json());

// Endpoint pour gérer l'ajout d'articles
app.post("/add-item", (req, res) => {
	const { item } = req.body;
	// Appelle la logique dans logic.js
	const result = logic.addItem(item);
	res.json({ state: result });
});

// Endpoint pour gérer la sélection de tranche de revenus
app.post("/select-decile", (req, res) => {
	const { tranche } = req.body;
	const state = { tranche };
	res.json({ state });
});

// Endpoint pour générer le ticket
app.post("/generate-ticket", (req, res) => {
	const { state } = req.body;
	const ticket = logic.generatePreviewContent(
		state.tranche,
		state.obj,
		state.price
	);
	res.json({ ticket });
});

app.listen(PORT, () => {
	console.log("Server running on http://localhost:${PORT}");
});
