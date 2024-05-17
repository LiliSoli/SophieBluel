// Fenêtre modale

import { displayWorks } from "./gallery.js";

const fileInput = document.getElementById("picture-file");
const formTitleElement = document.getElementById("form-title");
const formCategoryElement = document.getElementById("form-category");

// Affichage fenêtre modale
const displayModal = document.getElementById("modal");
const modalElement = document.querySelector(".modal");
const galleryModalElement = document.querySelector(".modal-gallery");

function openModal() {
  displayModal.style.display = "flex";

  modalElement.removeAttribute("aria-hidden");
  modalElement.setAttribute("aria-modal", "true");

  galleryModalElement.replaceChildren();
  displayWorksModal(works, galleryModalElement);

  document.body.classList.add("body-overflow-hidden");
}

const modifyDiv = document.getElementById("modify");
modifyDiv.addEventListener("click", (event) => {
  event.preventDefault();
  openModal();
});

//Fermeture fenêtre modale
function closeModal() {
  displayModal.style.display = "none";

  modalElement.setAttribute("aria-hidden", "true");
  modalElement.setAttribute("aria-modal", "false");

  displayModal1.style.display = "block";
  displayModal2.style.display = "none";

  document.body.classList.remove("body-overflow-hidden");
  resetFormModal2();
}

//Réinitialisation du formulaire de la modale
function resetFormModal2() {
  const imageContentContainer = document.querySelector(".img-content");
  const imageContentIcon = document.querySelector(".fa-image");
  const imageContentButton = document.querySelector(".btn-picture");
  const imageContentText = document.querySelector(".img-content-txt");
  const form = document.getElementById("form-modal2");

  form.reset();

  imagePreview.src = "";
  fileInput.value = "";
  imageContentContainer.style.padding = "22px 0 19px 0";
  imageContentContainer.style.display = "flex";
  imagePreview.style.display = "none";
  imageContentIcon.style.display = "flex";
  imageContentButton.style.display = "flex";
  imageContentText.style.display = "inline-block";
}

const closeIcons = document.querySelectorAll(".close-modal");
for (let closeIcon of closeIcons) {
  closeIcon.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });
}

window.addEventListener("click", (event) => {
  if (event.target === displayModal) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
});

//Affichage des projets dans la modale
let works = JSON.parse(window.localStorage.getItem("worksGallery"));

const tokenFromStorage = window.localStorage.getItem("token");

function displayWorksModal(worksParam, galleryModalParam) {
  for (let work of worksParam) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.classList.add("modal-img");

    const figureElement = document.createElement("figure");

    //Affichage encart de suppression des projets
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");

    const deleteInset = document.createElement("div");
    deleteInset.classList.add("delete-inset");
    deleteInset.appendChild(deleteIcon);

    figureElement.classList.add("modal-figure");
    figureElement.append(imageElement, deleteInset);
    galleryModalParam.appendChild(figureElement);

    //Suppression des projets
    deleteInset.addEventListener("click", async (event) => {
      event.preventDefault();
      fetch("http://localhost:5678/api/works/" + work.id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenFromStorage}` },
      });

      //Mise à jour de la modale et de l'affichage des projets
      galleryModalParam.removeChild(figureElement);
      const galleryElement = document.querySelector(".gallery");

      works = await fetch("http://localhost:5678/api/works").then((works) =>
        works.json()
      );
      window.localStorage.setItem("worksGallery", JSON.stringify(works));

      displayWorks(works, galleryElement);
    });
  }
}

//Affichage modale 1 ou 2
const btnOpenModal2 = document.querySelector(".btn-open-modal2");
const displayModal1 = document.querySelector(".modal1");
const displayModal2 = document.querySelector(".modal2");
btnOpenModal2.addEventListener("click", (event) => {
  event.preventDefault();

  displayModal2.style.display = "block";
  displayModal1.style.display = "none";
});

const returnModal1 = document.querySelector(".fa-arrow-left");
returnModal1.addEventListener("click", (event) => {
  event.preventDefault();
  displayModal1.style.display = "block";
  displayModal2.style.display = "none";

  resetFormModal2();
});

//Formulaire modale 2
//Affichage de la photo choisie
const imagePreview = document.getElementById("image-preview");

fileInput.addEventListener("change", (event) => {
  event.preventDefault();
  const pictureFile = event.target.files[0];

  if (
    !pictureFile.type.includes("image/jpeg") &&
    !pictureFile.type.includes("image/png")
  ) {
    alert("Veuillez sélectionner une image au format JPEG ou PNG.");
    return;
  }

  imagePreview.src = URL.createObjectURL(pictureFile);
  imagePreview.style.display = "block";

  const imageContentContainer = document.querySelector(".img-content");
  const imageContentIcon = document.querySelector(".fa-image");
  const imageContentButton = document.querySelector(".btn-picture");
  const imageContentText = document.querySelector(".img-content-txt");

  imageContentContainer.style.padding = "0";
  imageContentIcon.style.display = "none";
  imageContentButton.style.display = "none";
  imageContentText.style.display = "none";

  displayGreenSubmitButton();
});

//Titre dans le formulaire modale 2
formTitleElement.addEventListener("change", (event) => {
  event.preventDefault();
  displayGreenSubmitButton();
});

//Catégorie dans le formulaire modale 2
const categoriesFromStorage = JSON.parse(
  window.localStorage.getItem("categories")
);

for (let category of categoriesFromStorage) {
  const optionCategoryElement = document.createElement("option");
  optionCategoryElement.value = category.id;
  optionCategoryElement.textContent = category.name;

  formCategoryElement.appendChild(optionCategoryElement);
}

formCategoryElement.addEventListener("change", (event) => {
  event.preventDefault();
  displayGreenSubmitButton();
});

//Ajouter une photo dans la modale 2
const submitNewPicture = document.querySelector(".btn-picture-submit");

submitNewPicture.addEventListener("click", async (event) => {
  event.preventDefault();

  const pictureFile = fileInput.files[0];
  const formTitle = formTitleElement.value;
  const formCategory = formCategoryElement.value;

  if (pictureFile === undefined) {
    alert("Veuillez sélectionner une image.");
    return;
  }

  if (!formTitle) {
    alert("Veuillez saisir un titre.");
    return;
  }

  if (!formCategory) {
    alert("Veuillez choisir une catégorie.");
    return;
  }

  const formData = new FormData();
  try {
    formData.append("title", formTitle);
    formData.append("category", formCategory);
    formData.append("image", pictureFile);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenFromStorage}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la photo");
    }

    //Mise à jour de la modale et de l'affichage des projets
    // galleryModalParam.appendChild(figureElement);
    const galleryElement = document.querySelector(".gallery");

    works = await fetch("http://localhost:5678/api/works").then((works) =>
      works.json()
    );
    window.localStorage.setItem("worksGallery", JSON.stringify(works));

    displayWorks(works, galleryElement);
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la requête fetch :", error.message);
  }
});

//Fonction pour afficher le bouton vert si le questionnaire est rempli
function displayGreenSubmitButton() {
  const pictureFileSelected = fileInput.files[0];
  if (
    pictureFileSelected !== undefined &&
    formTitleElement.value !== "" &&
    formCategoryElement.value !== ""
  ) {
    submitNewPicture.classList.add("btn-picture-submit-valid");
  } else {
    submitNewPicture.classList.remove("btn-picture-submit-valid");
  }
}
