// main.js

// Variables
const decileSelection = document.getElementById("decile-selection");
const validateButton = document.getElementById("validate-ticket");
const articleNames = {
	"UP-VST-23": "Veste",
	"UP-CMB-23": "Combinaison",
	"UP-CSQ-23": "Casquette",
};

const state = {
	enteredItems: [],
	selectedTranche: null,
};

document.addEventListener("DOMContentLoaded", () => {
	// Set initial visibility to step1 and focus on the user-input
	updateStepVisibility("step1");
});

// Update step visibility
function updateStepVisibility(step) {
	const steps = ["step1", "step2", "step3", "step4"];
	steps.forEach((id) => {
		document.getElementById(id).style.display = "none";
	});
	document.getElementById(step).style.display = "flex";

	// Show item-input for both step1 and step2
	const itemInput = document.getElementById("item-input");
	itemInput.style.display =
		step === "step1" || step === "step2" ? "block" : "none";

	// Set focus on user-input in step1 and step2
	if (step === "step1" || step === "step2") {
		document.getElementById("user-input").focus();
	}
}

// Handle the addition of item (step1 & step2)
function addItemToList() {
	const userInput = document.getElementById("user-input").value;
	if (userInput) {
		state.enteredItems.push(userInput);
		const articleName = articleNames[userInput] || userInput;
		const li = document.createElement("li");
		li.textContent = articleName;
		document.getElementById("entered-items-list").appendChild(li);
		document.getElementById("user-input").value = "";
		updateStepVisibility("step2");
	}
}

document
	.getElementById("validate-item")
	.addEventListener("click", addItemToList);
document.getElementById("user-input").addEventListener("keydown", (event) => {
	if (event.key === "Enter") addItemToList();
});

// Validate the item list and display the decile selection (step2)
document.getElementById("validate-list").addEventListener("click", () => {
	if (state.enteredItems.length > 0) {
		updateStepVisibility("step3");
	}
});

// Handle decile selection (step3)
function handleDecileSelection(option) {
	document
		.querySelectorAll(".decile-option")
		.forEach((opt) => opt.classList.remove("selected"));
	option.classList.add("selected");
	state.selectedTranche = option.getAttribute("data-value");
	console.log("Option sélectionnée : ", state.selectedTranche);
}

document.querySelectorAll(".decile-option").forEach((option) => {
	option.addEventListener("click", function () {
		handleDecileSelection(this);
	});
});

// Handle decile validation and preview generation (step3)
document
	.getElementById("validate-decile")
	.addEventListener("click", async () => {
		const selectedOption = document.querySelector(".decile-option.selected");
		if (selectedOption !== null) {
			updateStepVisibility("step4");
			try {
				const response = await fetch("/api/generate-preview", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						tranche: state.selectedTranche,
						items: state.enteredItems,
					}),
				});
				const data = await response.json();
				document.getElementById("preview").innerText = data.preview;
			} catch (error) {
				console.error("Erreur lors de la génération de l'aperçu :", error);
			}
		} else {
			console.log("Aucune option sélectionnée.");
		}
	});

// Ticket printing validation
validateButton.addEventListener("click", async () => {
	try {
		const response = await fetch("/api/print-ticket", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				tranche: state.selectedTranche,
				items: state.enteredItems,
			}),
		});
		if (response.ok) {
			const result = await response.json();
			if (result.success) {
				setTimeout(() => {
					console.log("Impression réussie, réinitialisation en cours...");
					resetShoppingList();
				}, 4000);
			} else {
				console.log("Échec de l'impression du ticket.");
			}
		} else {
			console.error("Réponse non-JSON :", await response.text());
		}
	} catch (error) {
		console.error("Erreur d'impression : ", error);
	}
});

// Reset
function resetShoppingList() {
	state.enteredItems = [];
	document.getElementById("entered-items-list").innerHTML = "";
	document.getElementById("preview").innerText = "";
	updateStepVisibility("step1");
	document
		.querySelectorAll(".decile-option")
		.forEach((opt) => opt.classList.remove("selected"));
	document.getElementById("user-input").focus();
}

// Cancel Button
document.getElementById("cancel").addEventListener("click", resetShoppingList);
