// main.js

// Variables
const messageBox = document.getElementById("message");
const enteredItemsList = document.getElementById("entered-items-list");
const decileSelection = document.getElementById("decile-selection");
const shoppingValidation = document.getElementById("shopping-validation");
const validateButton = document.getElementById("validate-ticket");
const itemImage = document.getElementById("item-image");
const articleNames = {
	"UP-VST-23": "Veste",
	"UP-CMB-23": "Combinaison",
	"UP-CSQ-23": "Casquette",
};
let enteredItems = [];
