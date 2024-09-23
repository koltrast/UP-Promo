// main.js
// Variables de l'application
const messageBox = document.getElementById("message");
const enteredItemsList = document.getElementById("entered-items-list");
const decileSelection = document.getElementById("decile-selection");
const shoppingValidation = document.getElementById("shopping-validation");
const validateButton = document.getElementById("validate-ticket");
const cancelButton = document.getElementById("cancel-action");
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

// La touche "enter" valide l’ajout d’article
document.getElementById("user-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("validate-item").click();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").focus();
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

      // Générer l'aperçu du ticket directement après la validation de la tranche
      const tranche = selectedTranche;
      const items = enteredItems;

      const response = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tranche, items }),
      });

      const data = await response.json();
      document.getElementById("preview").innerText = data.preview;

      // Afficher les boutons "Valider" et "Annuler"
      validateButton.style.display = "block";
      cancelButton.style.display = "block";

      // Mise à jour de l'info-box
      messageBox.textContent = "Validez vos achats.";
    }
  });

// Gérer la génération d'impression du ticket lors de la validation
validateButton.addEventListener("click", async () => {
  const tranche = decileSelection.value;
  const items = enteredItems;

  try {
    const response = await fetch("/api/print-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tranche, items }),
    });

    // Vérification que la réponse est bien du JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (result.success) {
        messageBox.textContent = "Veuillez prendre votre ticket.";
        resetShoppingList(); // Réinitialiser après l'impression
      } else {
        messageBox.textContent = "Échec de l'impression du ticket.";
      }
    } else {
      messageBox.textContent = "Réponse inattendue du serveur. Attendu : JSON.";
      console.error("Réponse du serveur non-JSON :", await response.text());
    }
  } catch (error) {
    console.error("Erreur lors de l'impression du ticket : ", error);
    messageBox.textContent =
      "Une erreur est survenue lors de l'impression du ticket.";
  }
});

// Remise à zero de la liste d’achat et du programme
function resetShoppingList() {
  enteredItems = [];
  enteredItemsList.innerHTML = "";
  document.getElementById("preview").innerText = "";
  document.getElementById("shopping-validation-section").style.display = "none";
  document.getElementById("preview-section").style.display = "none";
  document.getElementById("item-input-section").style.display = "block";
  itemImage.style.display = "block";
  messageBox.textContent = "Scannez vos articles.";
}

// Ajout de la fonction annuler
document.getElementById("cancel-action").addEventListener("click", () => {
  resetShoppingList();
});
