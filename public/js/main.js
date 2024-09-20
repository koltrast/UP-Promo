// Variables de l'application
const messageBox = document.getElementById("message");
const enteredItemsList = document.getElementById("entered-items-list");
const decileSelection = document.getElementById("decile-selection");
const shoppingValidation = document.getElementById("shopping-validation");
let enteredItems = [];

// Masquer l'image après saisie du premier article
const itemImage = document.getElementById("item-image");

// Gérer l'ajout d'articles
document.getElementById("validate-item").addEventListener("click", () => {
	const userInput = document.getElementById("user-input").value;
	if (userInput) {
		enteredItems.push(userInput);
		const li = document.createElement("li");
		li.textContent = userInput;
		enteredItemsList.appendChild(li);
		document.getElementById("user-input").value = "";

		// Masquer l'image
		itemImage.style.display = "none";

		// Afficher la liste des articles saisis ainsi que les boutons
		document.getElementById("entered-list-section").style.display = "block";
		document.getElementById("validate-list").style.display = "block";
		document.getElementById("cancel-action").style.display = "block";

		// Mise à jour de l'info-box
		messageBox.textContent = "Article ajouté. Continuez ou validez la liste.";
	}
});

// Gérer la validation de la liste
document.getElementById("validate-list").addEventListener("click", () => {
	if (enteredItems.length > 0) {
		// Masquer les sections précédentes si nécessaire
		document.getElementById("item-input-section").style.display = "none";
		document.getElementById("entered-list-section").style.display = "none";
		document.querySelector(".action-buttons-section").style.display = "none";

		// Afficher la sélection de tranche
		document.getElementById("selection-list-section").style.display = "block";
		messageBox.textContent = "Sélectionnez une tranche de revenus.";
	}
});

// Validation de la tranche de revenus
document
	.getElementById("validate-decile")
	.addEventListener("click", async () => {
		const selectedTranche = decileSelection.value;
		if (selectedTranche !== null) {
			// Prépare les articles pour la validation
			const shoppingList = enteredItems
				.map((item) => `<li>${item}</li>`)
				.join("");
			shoppingValidation.innerHTML = shoppingList;

			// Afficher la section de validation
			document.getElementById("shopping-validation-section").style.display =
				"block";
			messageBox.textContent = "Voici vos achats. Validez ou annulez.";

			// Afficher le formulaire d'aperçu
			document.getElementById("preview-section").style.display = "block";

			// Masquer la sélection de tranche
			document.getElementById("selection-list-section").style.display = "none";
		}
	});

// Gérer la génération d'aperçu du ticket
document.getElementById("ticketForm").addEventListener("submit", async (e) => {
	e.preventDefault();

	const tranche = decileSelection.value;
	const items = enteredItems;

	const response = await fetch("/api/generate-preview", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tranche, items }),
	});

	const data = await response.json();
	document.getElementById("preview").innerText = data.preview;

	// Mise à jour de l'info-box
	messageBox.textContent = "Aperçu généré. Imprimez ou modifiez";
});
