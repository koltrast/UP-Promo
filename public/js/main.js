// main.js

// Variables de l'application
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

// Mise à jour de la visibilité des boutons
function updateButtonVisibility(step) {
	const buttons = {
		"validate-list": "none",
		"cancel-list-action": "none",
		"validate-decile": "none",
		"cancel-decile-action": "none",
		"validate-ticket": "none",
		"cancel-preview-action": "none",
	};

	switch (step) {
		case "itemInput":
			buttons["validate-list"] = "block";
			buttons["cancel-list-action"] = "block";
			break;
		case "decileSelection":
			buttons["validate-decile"] = "block";
			buttons["cancel-decile-action"] = "block";
			break;
		case "previewValidation":
			buttons["validate-ticket"] = "block";
			buttons["cancel-preview-action"] = "block";
			break;
	}

	Object.keys(buttons).forEach((id) => {
		document.getElementById(id).style.display = buttons[id];
	});
}

// Gérer l'ajout d'articles
document.getElementById("validate-item").addEventListener("click", () => {
	const userInput = document.getElementById("user-input").value;
	if (userInput) {
		enteredItems.push(userInput);

		const articleName = articleNames[userInput] || userInput;
		const li = document.createElement("li");
		li.textContent = articleName;
		enteredItemsList.appendChild(li);
		document.getElementById("user-input").value = "";

		itemImage.style.display = "none"; // Masquer l'image
		document.getElementById("entered-list-section").style.display = "block"; // Afficher la liste

		updateButtonVisibility("itemInput");
		document.getElementById("message-step1").style.display = "none";
		document.getElementById("message-step2").style.display = "block";
	}
});

// Valider avec la touche "Enter"
document.getElementById("user-input").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		document.getElementById("validate-item").click();
	}
});

// Passer à la sélection de tranche après validation des articles
document.getElementById("validate-list").addEventListener("click", () => {
	if (enteredItems.length > 0) {
		document.getElementById("item-input-section").style.display = "none";
		document.getElementById("entered-list-section").style.display = "none";
		document.getElementById("selection-list-section").style.display = "block";

		updateButtonVisibility("decileSelection");
		document.getElementById("message-step2").style.display = "none";
		document.getElementById("message-step3").style.display = "block";
	}
});

// Validation de la tranche de revenus
document
	.getElementById("validate-decile")
	.addEventListener("click", async () => {
		const selectedTranche = decileSelection.value;
		if (selectedTranche !== null) {
			const shoppingList = enteredItems
				.map((item) => `<li>${item}</li>`)
				.join("");
			shoppingValidation.innerHTML = shoppingList;

			document.getElementById("preview-section").style.display = "block";
			updateButtonVisibility("previewValidation");
			document.getElementById("message-step3").style.display = "none";
			document.getElementById("message-step4").style.display = "block";
			document.getElementById("selection-list-section").style.display = "none";

			// Générer l'aperçu du ticket
			const response = await fetch("/api/generate-preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tranche: selectedTranche, items: enteredItems }),
			});

			const data = await response.json();
			document.getElementById("preview").innerText = data.preview;
		}
	});

// Impression du ticket lors de la validation
validateButton.addEventListener("click", async () => {
	try {
		const response = await fetch("/api/print-ticket", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				tranche: decileSelection.value,
				items: enteredItems,
			}),
		});

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			const result = await response.json();
			messageBox.textContent = result.success
				? "Veuillez prendre votre ticket."
				: "Échec de l'impression du ticket.";

			if (result.success) resetShoppingList(); // Réinitialiser après l'impression
		} else {
			messageBox.textContent = "Réponse inattendue du serveur.";
			console.error("Réponse non-JSON :", await response.text());
		}
	} catch (error) {
		console.error("Erreur d'impression : ", error);
		messageBox.textContent = "Une erreur est survenue lors de l'impression.";
	}
});

// Réinitialisation du programme et de la liste d'achats
function resetShoppingList() {
	enteredItems = [];
	enteredItemsList.innerHTML = "";
	document.getElementById("preview").innerText = "";

	// Masquer toutes les sections
	[
		"shopping-validation-section",
		"preview-section",
		"selection-list-section",
	].forEach((id) => {
		document.getElementById(id).style.display = "none";
	});

	// Réafficher la section de saisie
	document.getElementById("item-input-section").style.display = "block";
	itemImage.style.display = "block";

	updateButtonVisibility("itemInput");
	document.getElementById("message-step4").style.display = "none";
	document.getElementById("message-step1").style.display = "block";
}

// Gérer les annulations d'action
["cancel-list-action", "cancel-decile-action", "cancel-preview-action"].forEach(
	(id) => {
		document.getElementById(id).addEventListener("click", resetShoppingList);
	}
);
