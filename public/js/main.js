// main.js

// Variables

const decileSelection = document.getElementById("decile-selection");
const validateButton = document.getElementById("validate-ticket");
const articleNames = {
	"UP-VST-23": "Veste",
	"UP-CMB-23": "Combinaison",
	"UP-CSQ-23": "Casquette",
};
let enteredItems = [];
let selectedTranche;

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
			document.getElementById("item-input").style.display = "block";
			break;
		case "itemInput":
			document.getElementById("step2").style.display = "flex";
			break;
		case "decileInput":
			document.getElementById("step3").style.display = "flex";
			document.getElementById("item-input").style.display = "none";
			break;
		case "previewDisplay":
			document.getElementById("step4").style.display = "flex";
			break;
	}
}

// Handle the addition of item (step1 & step2)
document.getElementById("validate-item").addEventListener("click", () => {
	const userInput = document.getElementById("user-input").value;
	if (userInput) {
		enteredItems.push(userInput);
		const articleName = articleNames[userInput] || userInput;
		const li = document.createElement("li");
		li.textContent = articleName;
		document.getElementById("entered-items-list").appendChild(li);
		document.getElementById("user-input").value = "";
		updateStepVisibility("itemInput");
	}
});

// Return key behave as validate-item click (step1 & step2)
document.getElementById("user-input").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		document.getElementById("validate-item").click();
	}
});

// Validate the item list and display the decile selection (step2)
document.getElementById("validate-list").addEventListener("click", () => {
	if (enteredItems.length > 0) {
		updateStepVisibility("decileInput");
	}
});

// Handle decile selection (step3)
document.querySelectorAll(".decile-option").forEach((option) => {
	option.addEventListener("click", function () {
		document
			.querySelectorAll(".decile-option")
			.forEach((opt) => opt.classList.remove("selected"));
		this.classList.add("selected");
		selectedTranche = this.getAttribute("data-value");
		console.log("Option sélectionnée : ", selectedTranche);
	});
});

// Handle decile validation and preview generation (step3)
document
	.getElementById("validate-decile")
	.addEventListener("click", async () => {
		const selectedOption = document.querySelector(".decile-option.selected");
		if (selectedOption !== null) {
			const selectedTranche = selectedOption.getAttribute("data-value");
			updateStepVisibility("previewDisplay");
			const response = await fetch("/api/generate-preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tranche: selectedTranche, items: enteredItems }),
			});
			const data = await response.json();
			document.getElementById("preview").innerText = data.preview;
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
				tranche: selectedTranche,
				items: enteredItems,
			}),
		});
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
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
	enteredItems = [];
	document.getElementById("entered-items-list").innerHTML = "";
	document.getElementById("preview").innerText = "";
	updateStepVisibility("initialState");
	document
		.querySelectorAll(".decile-option")
		.forEach((opt) => opt.classList.remove("selected"));
	itemImage.style.display = "block";
	document.getElementById("user-input").focus();
}

// Cancel Button
document.getElementById("cancel").addEventListener("click", resetShoppingList);
