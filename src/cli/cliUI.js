const readline = require("readline");
const {
	getUserInput,
	calculatePrice,
	generatePreviewContent,
	printPreview,
	printTicket,
	appendToCSV,
} = require("../core/logic");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function runCLI() {
	while (true) {
		const state = await getUserInput(ask);

		if (state.item.length) {
			const { obj, price } = calculatePrice(state);

			const previewContent = generatePreviewContent(state.tranche, obj, price);
			await printPreview(previewContent);
			// await appendToCSV("preview.csv", state.tranche, state.item, price);

			const userInput = await ask("Validate choice ?\n");

			if (userInput === "VALIDER") {
				await printTicket(previewContent, state.tranche, state.item, price);
				// await appendToCSV("trace.csv", state.tranche, state.item, price);
			} else if (userInput === "ANNULER") {
				console.log("cancel by type");
			}
		}
	}
}

function ask(question) {
	return new Promise((resolve) => rl.question(question, resolve));
}

module.exports = { runCLI };
