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

	const previewContent = generatePreviewContent(tranche, obj, price);
	printPreview(previewContent);

	res.json({ preview: previewContent });
});

app.post("/api/print-ticket", (req, res) => {
	const { previewContent } = req.body;
	printTicket(previewContent);
	res.sendStatus(200);
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

	obj.forEach((o, i) => {
		content += `    ${o} ${price[i]}€\n`;
	});
	content += `\n    TOTAL : ${price.reduce((a, b) => a + b, 0)}€`;
	content +=
		"\n\nPour valider, scannez VALIDER.\nPour annuler, scannez ANNULER\n\n.";

	return content;
}

function getTrancheDescription(tranche) {
	// Logic pour la description des tranches
	// Similaire à ce que tu as déjà
}
