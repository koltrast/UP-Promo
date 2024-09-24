// ticket.js
const fs = require("fs").promises;
const { exec } = require("child_process");
const logo = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██ ██ ██ ▄▄ ████ ██ ██ ▄▄ ████ ██ ██ ▄▄ ██
██ ██ ██ ▀▀ ████ ██ ██ ▀▀ ████ ██ ██ ▀▀ ██
██ ▀▀ ██ ███████ ▀▀ ██ ███████ ▀▀ ██ █████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
Union Pragmatique                     2024
`;

async function printPreview(content) {
	await fs.writeFile("preview.tmp", content);
	execPrintCommand("preview.tmp");
}

async function printTicket(previewContent) {
	// Ajout du texte pour le ticket client
	let ticketContent =
		previewContent +
		"\n\nPar cet achat, vous contribuez au" +
		"\nfinancement d'outils de création mutualisés" +
		"\ndestinés à l'association d'artistes le" +
		"\nComité des Choses Concrètes." +
		"\n\nTicket imprimé en deux exemplaires," +
		"\nfaisant foi d'authenticité.\n\n\n";
	await fs.writeFile("ticket.tmp", ticketContent);
	execPrintCommand("ticket.tmp");
	await new Promise((resolve) => setTimeout(resolve, 2000));
	execPrintCommand("ticket.tmp");
}

function execPrintCommand(file) {
	exec(`lpr -P EPSON_TM-T20III ${file} -o cpi=16 -o lpi=7`);
}

module.exports = { printPreview, printTicket, logo };
