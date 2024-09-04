#!/usr/bin/env node

// Modules
const fs = require("fs");
const { exec } = require("child_process");
const readline = require("readline");

// Dataframe
const data = {
	"UP-VST-23": [25, 30, 35, 40, 50, 60, 75, 90, 105, 130],
	"UP-CMB-23": [30, 35, 40, 45, 55, 65, 80, 95, 110, 140],
	"UP-CSQ-23": [10, 15, 20, 25, 35, 45, 60, 75, 95, 120],
};

// Logo
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
		let obj = [];
		let price = [];
		let tranche = null;
		let item = [];

		while (true) {
			const value = await ask("Enter value :\n");

			if (Object.keys(data).includes(value)) {
				item.push(value);
			} else {
				try {
					tranche = parseInt(value);
					if (!item.length) {
						fs.writeFileSync(
							"error.tmp",
							`${logo}\n\nVeuillez scanner un article en premier.\n\n\n\n\n.`,
							"utf-8"
						);
						exec("lpr -P EPSON_TM-T20III error.tmp -o cpi=16 -o lpi=7");
						fs.unlinkSync("error.tmp");
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

		if (item.length) {
			item.forEach((itm, i) => {
				price.push(data[itm][tranche]);
				if (itm === "UP-VST-23") {
					obj.push("veste");
				} else if (itm === "UP-CMB-23") {
					obj.push("combinaison");
				} else if (itm === "UP-CSQ-23") {
					obj.push("casquette");
				}
			});

			let previewContent = `${logo}\n\n`;
			if (tranche === 0) {
				previewContent +=
					"Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n";
			} else if (tranche === 1) {
				previewContent += `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}er et le ${
					tranche + 1
				}e décile.\n`;
			} else if (1 <= tranche && tranche < 9) {
				previewContent += `Vous avez déclaré toucher un revenu\ncompris entre le ${tranche}e et le ${
					tranche + 1
				}e décile.\n`;
			} else if (tranche === 9) {
				previewContent +=
					"Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n";
			}
			previewContent += "\nAfin de garantir une équité tarifaire\n";
			if (item.length > 1) {
				previewContent += "les prix ont été ajustés.\n\n";
			} else {
				previewContent += "le prix a été ajusté.\n\n";
			}
			obj.forEach((o, i) => {
				previewContent += `    ${o} ${price[i]}€\n`;
			});
			previewContent += `\n    TOTAL : ${price.reduce((a, b) => a + b, 0)}€`;
			previewContent +=
				"\n\n\nPour valider la commande scannez\nle code-barres VALIDER.\nPour annuler la commande scannez\nle code-barres ANNULER\n\n.";

			fs.writeFileSync("preview.tmp", previewContent, "utf-8");
			console.log("printing preview ticket");
			exec("lpr -P EPSON_TM-T20III preview.tmp -o cpi=16 -o lpi=7");
			fs.unlinkSync("preview.tmp");

			fs.appendFileSync(
				"preview.csv",
				`${tranche}; ${item}; ${price}; ${price.reduce((a, b) => a + b, 0)}\n`,
				"utf-8"
			);

			const user_input = await ask("Validate choice ?\n");

			if (user_input === "VALIDER") {
				let ticketContent = previewContent.replace(
					"Pour valider la commande scannez\nle code-barres VALIDER.\nPour annuler la commande scannez\nle code-barres ANNULER\n\n.",
					""
				);
				ticketContent +=
					"\n\n\nPar cet achat vous contribuez au\nfinancement d'outils de création mutualisés\ndestinés à l'association d'artistes le\nComité des Choses Concrètes.\n\nTickets imprimés en 2 exemplaires,\nfaisant foi d'authenticité.\n\n.";

				fs.writeFileSync("ticket.tmp", ticketContent, "utf-8");
				console.log("printing client ticket");
				exec("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=16 -o lpi=7");

				fs.appendFileSync(
					"ticket.tmp",
					"\n\nExemplaire Union Pragmatique\n\n.",
					"utf-8"
				);
				await sleep(4000);

				console.log("printing UP ticket");
				exec("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=16 -o lpi=7");
				fs.unlinkSync("ticket.tmp");

				fs.appendFileSync(
					"trace.csv",
					`${tranche}; ${item}; ${price}; ${price.reduce(
						(a, b) => a + b,
						0
					)}\n`,
					"utf-8"
				);
			} else if (user_input === "ANNULER") {
				console.log("cancel by type");
			}
		}
	}
}

function ask(question) {
	return new Promise((resolve) =>
		rl.question(question, (answer) => resolve(answer))
	);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
