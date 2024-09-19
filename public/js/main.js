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
