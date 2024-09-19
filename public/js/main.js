// Info-box
const messages = [
	"Scannez vos articles", // Step 1
	"Indiquez votre tranche de revenus", // Step 2
	"Validez vos achats", // Step 3
	"Merci pour votre soutien", // Step 4
];

const messageContainer = document.getElementById("message");

// Function to display the message based on index
function displayMessage(index) {
	if (index < messages.length) {
		messageContainer.textContent = messages[index];
	}
}

// Interaction-box

let currentStep = 0;
let itemsScanned = false; // Track if items have been scanned

// Focus on user input when the page loads
document.addEventListener("DOMContentLoaded", () => {
	// document.getElementById("user-input").focus();
	displayMessage(currentStep); // Initialize with the first message
});

// Press Enter to validate text input and add scanned item
document.getElementById("user-input").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		document.getElementById("validate-text").click(); // Simulate click on "Validate"
	}
});

// Click "Validate" in the text input section (for scanning items)
document.getElementById("validate-text").addEventListener("click", () => {
	const userInput = document.getElementById("user-input").value;
	if (userInput.trim() !== "") {
		const listItem = document.createElement("li");
		listItem.textContent = userInput;
		document.getElementById("entered-items-list").appendChild(listItem);
		document.getElementById("user-input").value = "";
		itemsScanned = true; // Mark that an item has been scanned
	}
});

// Click "Validate" in the decile selection section (only after items are scanned)
document.getElementById("validate-context").addEventListener("click", () => {
	if (itemsScanned) {
		// Move to the next step: decile selection
		currentStep = 1;
		displayMessage(currentStep); // Display "Indiquez votre tranche de revenus"
		itemsScanned = false; // Reset scanned items tracker
	}
});

// Click "Validate" in the decile selection section
document.getElementById("validate-context").addEventListener("click", () => {
	const selectedItem = document.getElementById("decile-selection").value;
	alert(`Validé: ${selectedItem}`);

	// Move to the next step
	currentStep = 2;
	displayMessage(currentStep); // Display "Validez vos achats"
});

// Reset the shopping list
function resetShoppingList() {
	const enteredItemsList = document.getElementById("entered-items-list");
	enteredItemsList.innerHTML = ""; // Clear the list
	itemsScanned = false; // Reset items scanned tracker
}

// Click "Cancel" or "Validate" at the end
document.getElementById("cancel-action").addEventListener("click", () => {
	alert("Annulé");

	// Reset to the first step and clear the shopping list
	resetShoppingList();
	currentStep = 0;
	displayMessage(currentStep); // Display "Scannez vos articles"
});

document.getElementById("validate-context").addEventListener("click", () => {
	alert("Commande validée");

	// Move to the final step
	currentStep = 3;
	displayMessage(currentStep); // Display "Merci pour votre soutien"

	// Reset the shopping list and message after 5 seconds
	resetShoppingList();
	setTimeout(() => {
		currentStep = 0;
		displayMessage(currentStep); // Display "Scannez vos articles"
	}, 5000);
});
