const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
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
const btnAllCategories = document.getElementById("category_all");
btnAllCategories.addEventListener("click", function () {
  displayWorks(works);
});

const btnObjects = document.getElementById("category_objects");
btnObjects.addEventListener("click", function () {
  const objects = works.filter(function (work) {
    return work.category.id == 1;
  });
  console.log(objects);
  displayWorks(objects);
});

const btnFlats = document.getElementById("category_flats");
btnFlats.addEventListener("click", function () {
  const flats = works.filter(function (work) {
    return work.category.id == 2;
  });
  console.log(flats);
  displayWorks(flats);
});

const btnHotels = document.getElementById("category_hotels");
btnHotels.addEventListener("click", function () {
  const hotels = works.filter(function (work) {
    return work.category.id == 3;
  });
  console.log(hotels);
  displayWorks(hotels);
});
