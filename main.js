#!/usr/bin/env node

const fs = require("fs").promises;
const { exec } = require("child_process");
const readline = require("readline");

const data = {
	"UP-VST-23": [25, 30, 35, 40, 50, 60, 75, 90, 105, 130],
	"UP-CMB-23": [30, 35, 40, 45, 55, 65, 80, 95, 110, 140],
	"UP-CSQ-23": [10, 15, 20, 25, 35, 45, 60, 75, 95, 120],
};

const logo = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██ ██ ██ ▄▄ ████ ██ ██ ▄▄ ████ ██ ██ ▄▄ ██
██ ██ ██ ▀▀ ████ ██ ██ ▀▀ ████ ██ ██ ▀▀ ██
██▄▀▀▄██ ███████▄▀▀▄██ ███████▄▀▀▄██ █████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
Union Pragmatique                     2023
`;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function main() {
	while (true) {
		const state = await getUserInput();

		if (state.item.length) {
			const { obj, price } = calculatePrice(state);

			const previewContent = generatePreviewContent(state.tranche, obj, price);
			await printPreview(previewContent);
			await appendToCSV("preview.csv", state.tranche, state.item, price);

			const userInput = await ask("Validate choice ?\n");

			if (userInput === "VALIDER") {
				await printTicket(previewContent, state.tranche, state.item, price);
				await appendToCSV("trace.csv", state.tranche, state.item, price);
			} else if (userInput === "ANNULER") {
				console.log("cancel by type");
			}
		}
	}
}

async function getUserInput() {
	const state = { obj: [], price: [], tranche: null, item: [] };

	while (true) {
		const value = await ask("Enter value :\n");

		if (Object.keys(data).includes(value)) {
			state.item.push(value);
		} else {
			try {
				state.tranche = parseInt(value);
				if (!state.item.length) {
					await handleNoItemScanned();
					break;
				}
				break;
			} catch (err) {
				console.log(
					"Invalid input. Please enter a valid column name or integer."
				);
			}
		}
	}
	return state;
}

function calculatePrice(state) {
	const obj = [];
	const price = [];

	state.item.forEach((itm, i) => {
		price.push(data[itm][state.tranche]);
		if (itm === "UP-VST-23") {
			obj.push("veste");
		} else if (itm === "UP-CMB-23") {
			obj.push("combinaison");
		} else if (itm === "UP-CSQ-23") {
			obj.push("casquette");
		}
	});

	return { obj, price };
}

function generatePreviewContent(tranche, obj, price) {
	let content = `${logo}\n\n`;

	content += getTrancheDescription(tranche);
	content += "\nAfin de garantir une équité tarifaire\n";
	content +=
		obj.length > 1
			? "les prix ont été ajustés.\n\n"
			: "le prix a été ajusté.\n\n";

	obj.forEach((o, i) => {
		content += `    ${o} ${price[i]}€\n`;
	});
	content += `\n    TOTAL : ${price.reduce((a, b) => a + b, 0)}€`;
	content +=
		"\n\n\nPour valider la commande scannez\nle code-barres VALIDER.\nPour annuler la commande scannez\nle code-barres ANNULER\n\n.";

	return content;
}

function getTrancheDescription(tranche) {
	if (tranche === 0) {
		return "Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n";
	} else if (tranche === 1) {
		return `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}er et le ${
			tranche + 1
		}e décile.\n`;
	} else if (1 <= tranche && tranche < 9) {
		return `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}e et le ${
			tranche + 1
		}e décile.\n`;
	} else if (tranche === 9) {
		return "Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n";
	}
}

async function handleNoItemScanned() {
	await fs.writeFile(
		"error.tmp",
		`${logo}\n\nVeuillez scanner un article en premier.\n\n\n\n\n.`
	);
	execPrintCommand("error.tmp");
	await fs.unlink("error.tmp");
}

async function printPreview(content) {
	await fs.writeFile("preview.tmp", content);
	console.log("printing preview ticket");
	execPrintCommand("preview.tmp");
	await fs.unlink("preview.tmp");
}

async function printTicket(previewContent, tranche, item, price) {
	let ticketContent = previewContent.replace(
		"Pour valider la commande scannez\nle code-barres VALIDER.\nPour annuler la commande scannez\nle code-barres ANNULER\n\n.",
		""
	);
	ticketContent +=
		"\n\n\nPar cet achat vous contribuez au\nfinancement d'outils de création mutualisés\ndestinés à l'association d'artistes le\nComité des Choses Concrètes.\n\nTickets imprimés en 2 exemplaires,\nfaisant foi d'authenticité.\n\n.";

	await fs.writeFile("ticket.tmp", ticketContent);
	console.log("printing client ticket");
	execPrintCommand("ticket.tmp");

	await fs.appendFile("ticket.tmp", "\n\nExemplaire Union Pragmatique\n\n.");
	await sleep(4000);

	console.log("printing UP ticket");
	execPrintCommand("ticket.tmp");
	await fs.unlink("ticket.tmp");
}

async function appendToCSV(filename, tranche, item, price) {
	await fs.appendFile(
		filename,
		`${tranche}; ${item}; ${price}; ${price.reduce((a, b) => a + b, 0)}\n`
	);
}

function execPrintCommand(file) {
	exec(`lpr -P EPSON_TM-T20III ${file} -o cpi=16 -o lpi=7`);
}

function ask(question) {
	return new Promise((resolve) => rl.question(question, resolve));
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => console.error(err));
