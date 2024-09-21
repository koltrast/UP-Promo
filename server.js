// server.js
const express = require("express");
const app = express();
const port = 3000;
const { printPreview, printTicket, logo } = require("./core/ticket");
const calculatePrice = require("./core/priceCalculator");

app.use(express.static("public"));
app.use(express.json());

app.post("/api/generate-preview", (req, res) => {
	const { tranche, items } = req.body;
	const { obj, price } = calculatePrice({ tranche, item: items });

	// Générer l'aperçu du ticket
	const previewContent = generatePreviewContent(tranche, obj, price);

	// Imprimer l'aperçu en utilisant printPreview
	printPreview(previewContent);

	// Retourner l'aperçu au frontend
	res.json({ preview: previewContent });
});

app.post("/api/print-ticket", (req, res) => {
	const { previewContent } = req.body;

	// Envoyer l'aperçu pour impression
	if (previewContent) {
		printTicket(previewContent);
		res.json({ success: true });
	} else {
		res.json({ success: false, message: "Erreur lors de l'impression" });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

function generatePreviewContent(tranche, obj, price) {
	let content = `${logo}\n\n`;

	content += getTrancheDescription(tranche);
	content +=
		obj.length > 1
			? "les prix ont été ajustés.\n\n"
			: "le prix a été ajusté.\n\n";

	// Ajouter chaque article et son prix
	obj.forEach((o, i) => {
		content += `    ${o} ${price[i]}€\n`;
	});
	content += `\n    TOTAL : ${price.reduce((a, b) => a + b, 0)}€`;

	return content;
}

function getTrancheDescription(tranche) {
	// Logique pour retourner la description de la tranche de revenus
	switch (tranche) {
		case "0":
			return "Revenus < 9570 €.\n";
		case "1":
			return "Revenus entre 9570 € et 14740 €.\n";
		// Ajoute les autres cases pour chaque tranche
		default:
			return "Revenus non spécifiés.\n";
	}
}
