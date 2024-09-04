const blessed = require("blessed");
const { logo, logoTui } = require("../../core/data");
// const { calculatePrice, appendToCSV } = require("../core/logic");

function runTUI() {
	const screen = blessed.screen({
		smartCSR: true,
		title: "Union Pragmatique Promo 2",
	});

	const items = [];

	// Main box
	const mainBox = blessed.box({
		top: "center",
		left: "center",
		width: "95%",
		height: "95%",
		style: {
			fg: "yellow",
			bg: "blue",
		},
	});

	// Top container box
	const topBox = blessed.box({
		parent: mainBox,
		top: "top",
		left: "center",
		width: "80%",
		height: "shrink",
		align: "center",
		valign: "top",
		style: {
			fg: "yellow",
			bg: "blue",
		},
		border: {
			type: "line",
			fg: "red",
			bg: "blue",
		},
	});

	// Logo box on the left
	const logoBox = blessed.box({
		parent: topBox,
		width: "shrink",
		height: "shrink",
		content: logoTui,
		tags: true,
		style: {
			fg: "yellow",
			bg: "blue",
		},
		border: {
			type: "line",
			fg: "green",
			bg: "blue",
		},
	});

	// items box on the right, filling remaining space
	const itemsbox = blessed.box({
		parent: topBox,
		left: "30%",
		top: 0,
		width: "68%",
		height: "shrink",
		tags: true,
		content: "scanned items:\n",
		align: "left",
		valign: "top",
		style: {
			fg: "yellow",
			bg: "blue",
		},
		border: {
			type: "line",
			fg: "yellow",
			bg: "blue",
		},
	});

	// bottom container box
	const bottomBox = blessed.box({
		parent: mainBox,
		top: "40%",
		left: "center",
		width: "80%",
		height: "50%",
		content: logo,
		align: "center",
		valign: "top",
		style: {
			fg: "yellow",
			bg: "blue",
		},
		border: {
			type: "line",
			fg: "green",
			bg: "blue",
		},
	});

	// const inputBox = blessed.box({
	// 	parent: topBox,
	// 	top: 0,
	// 	right: 0,
	// 	width: "60%",
	// 	height: "40%",
	// 	tags: true,
	// 	label: "SCAN YOUR ARTICLES",
	// 	align: "right",
	// 	valign: "top",
	// 	style: {
	// 		fg: "yellow",
	// 		bg: "blue",
	// 		label: {
	// 			bg: "blue",
	// 		},
	// 	},
	// 	border: {
	// 		type: "line",
	// 		fg: "yellow",
	// 		bg: "blue",
	// 	},
	// });

	// const botBox = blessed.box({
	// 	bottom: 0,
	// 	left: 2,
	// 	width: "100%",
	// 	height: "60%",
	// 	tags: true,
	// 	label: "DE LA PLUS VALUE ARTISTIQUE ET SES DÉBOUCHÉS",
	// 	align: "right",
	// 	valign: "top",
	// 	style: {
	// 		fg: "yellow",
	// 		bg: "blue",
	// 		label: {
	// 			bg: "blue",
	// 		},
	// 	},
	// 	border: {
	// 		type: "line",
	// 		fg: "yellow",
	// 		bg: "blue",
	// 	},
	// });

	// Buttons for validation

	// const buttonBox = blessed.box({
	// 	parent: inputBox,
	// 	bottom: 2,
	// 	left: "20%",
	// 	width: "shrink",
	// 	height: "shrink",
	// 	align: "center",
	// 	valign: "middle",
	// 	border: {
	// 		type: "line",
	// 		fg: "yellow",
	// 		bg: "blue",
	// 	},
	// });

	// const validateButton = blessed.button({
	// 	parent: buttonBox,
	// 	bottom: 1,
	// 	left: "20%",
	// 	width: 8,
	// 	height: 2,
	// 	content: "VALIDER",
	// 	align: "center",
	// 	valign: "middle",
	// 	style: {
	// 		fg: "white",
	// 		bg: "green",
	// 		focus: {
	// 			bg: "lightgreen",
	// 		},
	// 	},
	// 	border: {
	// 		type: "line",
	// 		fg: "white",
	// 		bg: "green",
	// 	},
	// });

	// const cancelButton = blessed.button({
	// 	parent: buttonBox,
	// 	bottom: 1,
	// 	right: "20%",
	// 	width: 8,
	// 	height: 2,
	// 	content: "ANNULER",
	// 	align: "center",
	// 	valign: "middle",
	// 	style: {
	// 		fg: "white",
	// 		bg: "red",
	// 		focus: {
	// 			bg: "lightcoral",
	// 		},
	// 	},
	// 	border: {
	// 		type: "line",
	// 		fg: "white",
	// 		bg: "red",
	// 	},
	// });

	// // Focus on input box initially
	// inputBox.focus();

	// // Handle item submission
	// inputBox.on("submit", (value) => {
	// 	if (value.trim()) {
	// 		items.push(value.trim()); // Add the item to the list
	// 		updateItemsDisplay(); // Update the display of scanned items
	// 		inputBox.clearValue(); // Clear the input field
	// 		screen.render(); // Re-render the screen
	// 	}
	// 	inputBox.focus(); // Refocus on the input box
	// });

	// // Function to update the items display
	// function updateItemsDisplay() {
	// 	const itemCount = items.reduce((countMap, item) => {
	// 		countMap[item] = (countMap[item] || 0) + 1;
	// 		return countMap;
	// 	}, {});

	// 	let content = "Scanned Items:\n";
	// 	for (let item in itemCount) {
	// 		content += `${itemCount[item]} x ${item}\n`; // Display quantity and item name
	// 	}
	// 	itemsBox.setContent(content); // Update the box content
	// }

	// // Button navigation logic
	// screen.key(["left", "right"], (ch, key) => {
	// 	if (key.name === "left") {
	// 		validateButton.focus();
	// 	} else if (key.name === "right") {
	// 		cancelButton.focus();
	// 	}
	// });

	// // Handle validation
	// validateButton.on("press", () => {
	// 	console.log("Items validated:", items);
	// 	// Perform logic for validation here
	// 	// calculatePrice(items); // Example of invoking your logic
	// 	items.length = 0; // Clear items after validation
	// 	updateItemsDisplay(); // Update display after clearing
	// 	inputBox.focus(); // Refocus on input
	// 	screen.render(); // Re-render screen
	// });

	// // Handle cancellation
	// cancelButton.on("press", () => {
	// 	console.log("Validation canceled.");
	// 	items.length = 0; // Clear items on cancel
	// 	updateItemsDisplay(); // Update display after clearing
	// 	inputBox.focus(); // Refocus on input
	// 	screen.render(); // Re-render screen
	// });

	// Screen rendering
	screen.append(mainBox);

	screen.render();

	// Exit the TUI with 'q' or 'Ctrl+C'
	screen.key(["escape", "q", "C-c"], () => process.exit(0));
}

module.exports = { runTUI };
