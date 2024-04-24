/*Projets*/
const works = await fetch("http://localhost:5678/api/works").then((works) =>
  works.json()
);
console.log(works);

const galleryElement = document.querySelector(".gallery");
console.log(galleryElement);

function displayWorks(works) {
  galleryElement.replaceChildren();
  for (let work of works) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    console.log(imageElement);

    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;
    console.log(titleElement);

    const figureElement = document.createElement("figure");
    figureElement.append(imageElement, titleElement);
    console.log(figureElement);
    galleryElement.appendChild(figureElement);
  }
}
displayWorks(works);

/*Filtres*/
const categories = await fetch("http://localhost:5678/api/categories").then(
  (categories) => categories.json()
);
console.log(categories);

const filterElement = document.getElementById("filter");
console.log(filterElement);

function displayButtons(categories) {
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
    console.log(btnElement);

    filterElement.appendChild(btnElement);

    btnElement.addEventListener("click", () => {
      const filteredWorks = works.filter(function (work) {
        return work.category.id == categoryBtn.id;
      });
      console.log(filteredWorks);
      displayWorks(filteredWorks);
    });
  }
}
displayButtons(categories);


