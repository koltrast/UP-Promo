// priceCalculator.js
const data = require("./data");

function calculatePrice(state) {
	const obj = [];
	const price = [];

	state.item.forEach((itm) => {
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

module.exports = calculatePrice;
