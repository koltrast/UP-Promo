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

// Update step visibility
function updateStepVisibility(step) {
	// Hide all steps initially
	document.getElementById("step1").style.display = "none";
	document.getElementById("step2").style.display = "none";
	document.getElementById("step3").style.display = "none";
	document.getElementById("step4").style.display = "none";

	// Show the relevant step based on the input
	switch (step) {
		case "initialState":
			document.getElementById("step1").style.display = "flex";
			break;
		case "itemInput":
			document.getElementById("step2").style.display = "flex";
			break;
		case "decileInput":
			document.getElementById("step3").style.display = "flex";
			break;
		case "previewDisplay":
			document.getElementById("step4").style.display = "flex";
			break;
	}
}
