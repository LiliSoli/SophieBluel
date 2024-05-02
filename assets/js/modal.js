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

//Conserver le focus sur la modale
const focusable = "button, a, input, textarea";
let focusablesElements = Array.from(displayModal.querySelectorAll(focusable));

function focusInModal(event) {
  event.preventDefault();
  const focusedElement = displayModal.querySelector(":focus");
  console.log(focusedElement);
  let index = focusablesElements.findIndex((f) => f === focusedElement);
  console.log(index);
  index++;
  if (index >= focusablesElements.length) {
    index = 0;
  }
  focusablesElements[index].focus();
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && displayModal !== null) {
    focusInModal(event);
  }
});

//Fermeture fenêtre modale
function closeModal() {
  displayModal.style.display = "none";

  modalElement.setAttribute("aria-hidden", "true");
  modalElement.setAttribute("aria-modal", "false");
  console.log(modalElement);
}

const closeIcon = document.querySelector(".fa-xmark");
closeIcon.addEventListener("click", (event) => {
  event.preventDefault();
  closeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
});

//Affichage des projets dans la modale
let works = JSON.parse(window.localStorage.getItem("worksGallery"));
const galleryModalElement = document.querySelector(".modal-gallery");

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
    const tokenFromStorage = window.localStorage.getItem("token");
    deleteInset.addEventListener("click", async (event) => {
        event.preventDefault();
        fetch("http://localhost:5678/api/works/"+work.id, {
          method: "DELETE",
          headers: {Authorization: `Bearer ${tokenFromStorage}`}
        });

        //Mise à jour de la modale et de l'affichage des projets
        galleryModalParam.removeChild(figureElement);
        const galleryElement = document.querySelector(".gallery");
        
        works = await fetch("http://localhost:5678/api/works").then((works) => works.json());
        window.localStorage.setItem("worksGallery", JSON.stringify(works));
  
        displayWorks(works, galleryElement);
    });

  }
}
displayWorksModal(works, galleryModalElement);

