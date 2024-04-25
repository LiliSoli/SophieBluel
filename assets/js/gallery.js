/*Projets*/
const works = await fetch("http://localhost:5678/api/works").then((works) =>
  works.json()
);

const galleryElement = document.querySelector(".gallery");

function displayWorks(works) {
  galleryElement.replaceChildren();
  for (let work of works) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;

    const figureElement = document.createElement("figure");
    figureElement.append(imageElement, titleElement);
    galleryElement.appendChild(figureElement);
  }
}
displayWorks(works);

/*Filtres*/

async function displayButtons() {
  const categories = await fetch("http://localhost:5678/api/categories").then(
    (categories) => categories.json()
  );

  const filterElement = document.getElementById("filter");

  //Création du bouton "Tous"
  const btnAllElement = document.createElement("button");
  btnAllElement.textContent = "Tous";

  btnAllElement.addEventListener("click", () => {
    displayWorks(works);
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
      displayWorks(filteredWorks);
    });
  }
}

//Création de la div pour modifier
function displayModify() {
  const icon = document.createElement("i");
  icon.classList.add("fa-regular", "fa-pen-to-square");

  const modifyText = document.createElement("p");
  modifyText.classList.add("modify-txt");
  modifyText.textContent = "modifier";

  const modifyElement = document.createElement("div");
  modifyElement.classList.add("modify");
  modifyElement.append(icon, modifyText);

  const projectsElement = document.getElementById("projects");
  projectsElement.appendChild(modifyElement);
}

//Vérification de la connexion de l'utilisateur
const tokenFromStorage = window.localStorage.getItem("token");
console.log(tokenFromStorage);

if (tokenFromStorage !== null) {
  displayModify();

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
