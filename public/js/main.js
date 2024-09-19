// Info-box
// Message to display
const messages = [
	"Scannez vos articles",
	"Indiquez votre tranche de revenus",
	"Validez vos achats",
	"Merci pour votre soutien",
];

// place to display message
const messageContainer = document.getElementById("message");

function displayMessage(index) {
	if (index < messages.length) {
		messageContainer.textContent = messages[index];
	}
}

// Exemple d'utilisation : changer le message à des moments spécifiques
// Ici, j'utilise setTimeout comme exemple, mais vous pouvez l'intégrer à votre logique
// setTimeout(() => displayMessage(0), 1000); // Après 1 seconde
// setTimeout(() => displayMessage(1), 5000); // Après 5 secondes
// setTimeout(() => displayMessage(2), 10000); // Après 10 secondes
// setTimeout(() => displayMessage(3), 15000); // Après 15 secondes

// Interaction-box

// focus in the user-input field, remember to uncomment section.
// document.addEventListener("DOMContentLoaded", () => {
// 	document.getElementById("user-input").focus();
// });

// press Enter act as a click on Valider.
document.getElementById("user-input").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		document.getElementById("validate-text").click(); // Simule un clic sur le bouton "Valider"
	}
});

document.getElementById("validate-text").addEventListener("click", () => {
	const userInput = document.getElementById("user-input").value;
	if (userInput.trim() !== "") {
		const listItem = document.createElement("li");
		listItem.textContent = userInput;
		document.getElementById("entered-items-list").appendChild(listItem);
		document.getElementById("user-input").value = "";
	}
});

document.getElementById("validate-context").addEventListener("click", () => {
	const selectedItem = document.getElementById("decile-selection").value;
	alert(`Validé: ${selectedItem}`);
});

document.getElementById("cancel-action").addEventListener("click", () => {
	alert("Annulé");
});
