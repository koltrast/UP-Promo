const fs = require("fs").promises;
const { exec } = require("child_process");
const { data, logo } = require("./data");

// Function to get user input and manage state
async function getUserInput(ask) {
	console.log("Enter value :\n");

	const state = { obj: [], price: [], tranche: null, item: [] };
	while (true) {
		const value = await ask("Enter value:\n");
		console.log("Entered value:", value);

		if (Object.keys(data).includes(value)) {
			state.item.push(value);
			console.log("Item added:", value);
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
	console.log("Final state:", state);
	return state;
}

// Function to calculate the price based on the state
function calculatePrice(state) {
	const obj = [];
	const price = [];
	state.item.forEach((itm) => {
		price.push(data[itm][state.tranche]);
		if (itm === "UP-VST-23") obj.push("veste");
		else if (itm === "UP-CMB-23") obj.push("combinaison");
		else if (itm === "UP-CSQ-23") obj.push("casquette");
	});
	return { obj, price };
}

// Function to generate the content for the preview ticket
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

// Function to get the description based on tranche
function getTrancheDescription(tranche) {
	if (tranche === 0)
		return "Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n";
	else if (tranche === 1)
		return `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}er et le ${
			tranche + 1
		}e décile.\n`;
	else if (1 <= tranche && tranche < 9)
		return `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}e et le ${
			tranche + 1
		}e décile.\n`;
	else if (tranche === 9)
		return "Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n";
}

// Function to handle the case where no items are scanned
async function handleNoItemScanned() {
	await fs.writeFile(
		"error.tmp",
		`${logo}\n\nVeuillez scanner un article en premier.\n\n\n\n\n.`
	);
	execPrintCommand("error.tmp");
	await fs.unlink("error.tmp");
}

// Function to print the preview ticket
async function printPreview(content) {
	await fs.writeFile("preview.tmp", content);
	console.log("printing preview ticket");
	execPrintCommand("preview.tmp");
	await fs.unlink("preview.tmp");
}

// Function to print the final ticket
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
	await sleep(4000); // Wait for 4 seconds
	console.log("printing UP ticket");
	execPrintCommand("ticket.tmp");
	await fs.unlink("ticket.tmp");
}

// Function to execute the print command using the shell
function execPrintCommand(file) {
	exec(`lpr -P EPSON_TM-T20III ${file} -o cpi=16 -o lpi=7`);
}

// Function to pause execution for a given time (in milliseconds)
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to handle adding an item
function addItem(item) {
	const state = { obj: [], price: [], tranche: null, item: [] };
	if (Object.keys(data).includes(item)) {
		state.item.push(item);
	}
	return state;
}

// a the functions for use in other modules
module.exports = {
	getUserInput,
	calculatePrice,
	generatePreviewContent,
	printPreview,
	printTicket,
	addItem,
	// appendToCSV,
};
