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
	// await fs.unlink("preview.tmp"); // Commenting this fix the issue of not printing
}

async function printTicket(previewContent) {
	// Ajout du texte pour le ticket client
	let ticketContent =
		previewContent + "\n\nTicket imprimé en double exemplaire.";
	await fs.writeFile("ticket.tmp", ticketContent);
	execPrintCommand("ticket.tmp");
	// await fs.unlink("ticket.tmp");
}

function execPrintCommand(file) {
	exec(`lpr -P EPSON_TM-T20III ${file} -o cpi=16 -o lpi=7`);
}

module.exports = { printPreview, printTicket, logo };
