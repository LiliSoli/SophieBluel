//Récupération des projets
let works = window.localStorage.getItem("worksGallery");
if (works === null) {
  const works = await fetch("http://localhost:5678/api/works").then((works) =>
    works.json()
  );
  window.localStorage.setItem("worksGallery", JSON.stringify(works));
} else {
  works = JSON.parse(works);
}

//Affichage des projets
const galleryElement = document.querySelector(".gallery");
export function displayWorks(worksParam, galleryParam) {
  galleryParam.replaceChildren();
  for (let work of worksParam) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;

    const figureElement = document.createElement("figure");
    figureElement.append(imageElement, titleElement);
    galleryParam.appendChild(figureElement);
  }
}
displayWorks(works, galleryElement);

//Filtres
async function displayButtons() {
  const categories = await fetch("http://localhost:5678/api/categories").then(
    (categories) => categories.json()
  );
  window.localStorage.setItem("categories", JSON.stringify(categories));

  const filterElement = document.getElementById("filter");

  //Création du bouton "Tous"
  const btnAllElement = document.createElement("button");
  btnAllElement.textContent = "Tous";

  btnAllElement.addEventListener("click", () => {
    displayWorks(works, galleryElement);
  });

  filterElement.appendChild(btnAllElement);

  //Création des boutons filtres
  for (let categoryBtn of categories) {
    const btnElement = document.createElement("button");
    btnElement.setAttribute("id", "btn-" + categoryBtn.id);
    btnElement.textContent = categoryBtn.name;

    filterElement.appendChild(btnElement);

    btnElement.addEventListener("click", () => {
      const filteredWorks = works.filter(function (work) {
        return work.category.id == categoryBtn.id;
      });
      displayWorks(filteredWorks, galleryElement);
    });
  }
}

//Affichage selon le statut de l'utilisateur
const tokenFromStorage = window.localStorage.getItem("token");

if (tokenFromStorage !== null) {
  const editModeElement = document.querySelector(".edit-mode-banner");
  const modifyElement = document.querySelector(".modify");
  editModeElement.style.display = "flex";
  modifyElement.style.display = "flex";

  const headerElement = document.querySelector("header");
  headerElement.style.margin = "97px 0 92px 0";

  const loginElement = document.getElementById("login");
  loginElement.textContent = "logout";

  loginElement.addEventListener("click", (event) => {
    event.preventDefault();
    window.localStorage.removeItem("token");
    location.reload();
  });
} else {
  displayButtons();
}
