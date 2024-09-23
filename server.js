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
	// printPreview(previewContent);

	// Retourner l'aperçu au frontend
	res.json({ preview: previewContent });
});

app.post("/api/print-ticket", (req, res) => {
    const { tranche, items } = req.body; // Récupérer tranche et items

    if (tranche && items) {
        // Générer l'aperçu du ticket avant impression
        const { obj, price } = calculatePrice({ tranche, item: items });
        const previewContent = generatePreviewContent(tranche, obj, price);

        // Envoyer l'aperçu à la fonction d'impression
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
    content += "\nAfin de garantir une équité tarifaire\n"
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
			return "Vous avez déclaré toucher des revenus\ninférieurs au 1er décile.\n";
		case "1":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 1er et le 2e décile.\n";
		case "2":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 2e et le 3e décile.\n";
		case "3":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 3e et le 4e décile.\n";
		case "4":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 4e et le 5e décile.\n";
		case "5":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 5e et le 6e décile.\n";
		case "6":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 6e et le 7e décile.\n";
		case "7":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 7e et le 8e décile.\n";
		case "8":
			return "Vous avez déclaré toucher des revenus\ncompris entre le 8e et le 9e décile.\n";
		case "9":
			return "Vous avez déclaré toucher des revenus\nsupérieurs au 9e décile\n";
		default:
			return "Revenus non spécifiés.\n";
	}
}
