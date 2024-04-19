const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

console.log(works);

const work = works[0];
console.log(work);
const galleryElement = document.querySelector(".gallery");
console.log(galleryElement);

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

