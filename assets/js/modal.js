// Fenêtre modale

import { displayWorks } from "./gallery.js";

// Affichage fenêtre modale
const displayModal = document.getElementById("modal");
const modalElement = document.querySelector(".modal");

function openModal() {
  displayModal.style.display = "flex";

  modalElement.removeAttribute("aria-hidden");
  modalElement.setAttribute("aria-modal", "true");
  console.log(modalElement);
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
}

const closeIcons = document.querySelectorAll(".close-modal");
for (let closeIcon of closeIcons) {
  closeIcon.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
});

//Affichage des projets dans la modale
let works = JSON.parse(window.localStorage.getItem("worksGallery"));
const galleryModalElement = document.querySelector(".modal-gallery");
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
displayWorksModal(works, galleryModalElement);

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
});

//Affichage de la photo choisie
const fileInput = document.getElementById("picture-file");
const imagePreview = document.getElementById("image-preview");

fileInput.addEventListener("change", (event) => {
  event.preventDefault();
  const pictureFile = event.target.files[0];
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
})


//Catégorie dans le formulaire modale 2
  const formCategory = document.getElementById("form-category");
  const categoriesFromStorage = JSON.parse(window.localStorage.getItem("categories"));

  for (let category of categoriesFromStorage) {
    const optionCategoryElement = document.createElement("option");
    optionCategoryElement.value = category.id;
    optionCategoryElement.textContent = category.name;

    formCategory.appendChild(optionCategoryElement);
  }


//Ajouter une photo dans la modale 2
const submitNewPicture = document.querySelector(".btn-picture-submit");
submitNewPicture.addEventListener("click", async (event) => {
  event.preventDefault();

  const pictureFile = fileInput.files[0];

  const formData = new FormData();
  const formTitle = document.getElementById("form-title").value;
  const formCategory = document.getElementById("form-category").value;
  console.log(formTitle)
  console.log(formCategory)
  
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
      console.log(response);
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
  } catch (error) {
    console.error("Erreur lors de la requête fetch :", error.message);
  }
});

console.log(works);